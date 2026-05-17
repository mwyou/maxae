const json = (data, init = {}) =>
  new Response(JSON.stringify(data), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...(init.headers || {}),
    },
  })

const readJson = async (request) => {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

const textOrNull = (value) => {
  if (value === undefined || value === null) return null
  const trimmed = String(value).trim()
  return trimmed ? trimmed : null
}

const numberOrZero = (value) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

const boolToInt = (value, fallback = 1) => {
  if (value === undefined || value === null || value === '') return fallback
  if (value === '0' || value === 0 || value === false || value === 'false') return 0
  if (value === '1' || value === 1 || value === true || value === 'true') return 1
  return value ? 1 : 0
}

const categoryPayload = (body = {}) => ({
  slug: String(body.slug || '').trim(),
  name_zh: String(body.name_zh || '').trim(),
  name_en: String(body.name_en || '').trim(),
  summary_zh: textOrNull(body.summary_zh),
  summary_en: textOrNull(body.summary_en),
  medium_zh: textOrNull(body.medium_zh),
  medium_en: textOrNull(body.medium_en),
  focus_zh: textOrNull(body.focus_zh),
  focus_en: textOrNull(body.focus_en),
  cover_url: textOrNull(body.cover_url),
  accent: textOrNull(body.accent) || '#c084fc',
  sort_order: numberOrZero(body.sort_order),
  is_active: boolToInt(body.is_active, 1),
})

const artworkPayload = (body = {}) => ({
  category_id: Number(body.category_id),
  title_zh: String(body.title_zh || '').trim(),
  title_en: textOrNull(body.title_en),
  artist_zh: textOrNull(body.artist_zh),
  artist_en: textOrNull(body.artist_en),
  year_text: textOrNull(body.year_text),
  medium_zh: textOrNull(body.medium_zh),
  medium_en: textOrNull(body.medium_en),
  size_text: textOrNull(body.size_text),
  image_url: String(body.image_url || '').trim(),
  description_zh: textOrNull(body.description_zh),
  description_en: textOrNull(body.description_en),
  sort_order: numberOrZero(body.sort_order),
  is_featured: boolToInt(body.is_featured, 0),
  is_active: boolToInt(body.is_active, 1),
})

const missingFields = (payload, fields) => fields.filter((field) => !payload[field])

const b64url = (bytes) =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')

const b64urlText = (text) => b64url(new TextEncoder().encode(text))

const fromB64url = (value) => {
  const base64 = value.replaceAll('-', '+').replaceAll('_', '/')
  return atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
}

const sign = async (value, secret) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  return b64url(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(value)))
}

const makeToken = async (username, secret) => {
  const payload = {
    username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7,
  }
  const body = b64urlText(JSON.stringify(payload))
  return `${body}.${await sign(body, secret)}`
}

const verifyToken = async (request, env) => {
  const secret = await getJwtSecret(env)
  if (!secret) return false

  const header = request.headers.get('authorization') || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : ''
  const [body, signature] = token.split('.')
  if (!body || !signature) return false

  const expected = await sign(body, secret)
  if (signature !== expected) return false

  try {
    const payload = JSON.parse(fromB64url(body))
    return payload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}

const all = async (statement) => {
  const result = await statement.all()
  return result.results || []
}

const first = (db, sql, ...params) => db.prepare(sql).bind(...params).first()

const randomToken = (bytes = 32) => {
  const values = new Uint8Array(bytes)
  crypto.getRandomValues(values)
  return b64url(values)
}

const getSetting = async (db, key) => {
  const row = await first(db, 'SELECT value FROM site_settings WHERE key = ?', key)
  return row?.value || ''
}

const setSetting = (db, key, value) =>
  db
    .prepare(
      `INSERT INTO site_settings (key, value, updated_at)
       VALUES (?, ?, CURRENT_TIMESTAMP)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = CURRENT_TIMESTAMP`,
    )
    .bind(key, value)
    .run()

const getJwtSecret = async (env) => {
  if (env.JWT_SECRET) return env.JWT_SECRET
  return getSetting(env.DB, 'jwt_secret')
}

const getAdminCount = async (db) => {
  try {
    const row = await first(db, 'SELECT COUNT(*) AS count FROM admins')
    return row?.count || 0
  } catch {
    return 0
  }
}

const hashPassword = async (password, salt = randomToken(18), iterations = 120000) => {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  )
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      hash: 'SHA-256',
      salt: new TextEncoder().encode(salt),
      iterations,
    },
    key,
    256,
  )
  return `pbkdf2$${iterations}$${salt}$${b64url(bits)}`
}

const verifyPassword = async (password, storedHash) => {
  if (!storedHash?.startsWith('pbkdf2$')) return false
  const [, iterations, salt, expected] = storedHash.split('$')
  const actual = await hashPassword(password, salt, Number(iterations))
  return actual.endsWith(`$${expected}`)
}

const requireAuth = async (request, env) => {
  if (await verifyToken(request, env)) return null
  return json({ error: 'Unauthorized' }, { status: 401 })
}

const routePublic = async (request, env, parts) => {
  if (request.method !== 'GET') return json({ error: 'Method not allowed' }, { status: 405 })

  if (parts.length === 2 && parts[1] === 'categories') {
    return json(
      await all(
        env.DB.prepare(
          `SELECT * FROM categories
           WHERE is_active = 1
           ORDER BY sort_order ASC, id ASC`,
        ),
      ),
    )
  }

  if (parts.length === 3 && parts[1] === 'categories') {
    const category = await first(
      env.DB,
      'SELECT * FROM categories WHERE slug = ? AND is_active = 1',
      parts[2],
    )
    return category ? json(category) : json({ error: 'Category not found' }, { status: 404 })
  }

  if (parts.length === 4 && parts[1] === 'categories' && parts[3] === 'artworks') {
    const category = await first(
      env.DB,
      'SELECT id FROM categories WHERE slug = ? AND is_active = 1',
      parts[2],
    )
    if (!category) return json({ error: 'Category not found' }, { status: 404 })

    return json(
      await all(
        env.DB.prepare(
          `SELECT artworks.*, categories.slug AS category_slug
           FROM artworks
           INNER JOIN categories ON categories.id = artworks.category_id
           WHERE artworks.category_id = ? AND artworks.is_active = 1
           ORDER BY artworks.sort_order ASC, artworks.id ASC`,
        ).bind(category.id),
      ),
    )
  }

  return json({ error: 'Not found' }, { status: 404 })
}

const routeAdminCategories = async (request, env, parts) => {
  if (request.method === 'GET' && parts.length === 2) {
    return json(await all(env.DB.prepare('SELECT * FROM categories ORDER BY sort_order ASC, id ASC')))
  }

  if (request.method === 'POST' && parts.length === 2) {
    const payload = categoryPayload(await readJson(request))
    const missing = missingFields(payload, ['slug', 'name_zh', 'name_en'])
    if (missing.length) return json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })

    const result = await env.DB.prepare(
      `INSERT INTO categories
        (slug, name_zh, name_en, summary_zh, summary_en, medium_zh, medium_en,
         focus_zh, focus_en, cover_url, accent, sort_order, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        payload.slug,
        payload.name_zh,
        payload.name_en,
        payload.summary_zh,
        payload.summary_en,
        payload.medium_zh,
        payload.medium_en,
        payload.focus_zh,
        payload.focus_en,
        payload.cover_url,
        payload.accent,
        payload.sort_order,
        payload.is_active,
      )
      .run()

    return json({ id: result.meta.last_row_id, ...payload }, { status: 201 })
  }

  if (request.method === 'PUT' && parts.length === 3) {
    const payload = categoryPayload(await readJson(request))
    const missing = missingFields(payload, ['slug', 'name_zh', 'name_en'])
    if (missing.length) return json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })

    await env.DB.prepare(
      `UPDATE categories SET
        slug = ?, name_zh = ?, name_en = ?, summary_zh = ?, summary_en = ?,
        medium_zh = ?, medium_en = ?, focus_zh = ?, focus_en = ?,
        cover_url = ?, accent = ?, sort_order = ?, is_active = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
      .bind(
        payload.slug,
        payload.name_zh,
        payload.name_en,
        payload.summary_zh,
        payload.summary_en,
        payload.medium_zh,
        payload.medium_en,
        payload.focus_zh,
        payload.focus_en,
        payload.cover_url,
        payload.accent,
        payload.sort_order,
        payload.is_active,
        parts[2],
      )
      .run()

    return json({ id: Number(parts[2]), ...payload })
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    await env.DB.prepare('DELETE FROM categories WHERE id = ?').bind(parts[2]).run()
    return json({ ok: true })
  }

  return json({ error: 'Not found' }, { status: 404 })
}

const routeAdminArtworks = async (request, env, parts, url) => {
  if (request.method === 'GET' && parts.length === 2) {
    const categoryId = Number(url.searchParams.get('category_id'))
    const hasCategory = Number.isFinite(categoryId) && categoryId > 0
    const sql = `SELECT artworks.*, categories.slug AS category_slug
       FROM artworks
       INNER JOIN categories ON categories.id = artworks.category_id
       ${hasCategory ? 'WHERE artworks.category_id = ?' : ''}
       ORDER BY artworks.sort_order ASC, artworks.id ASC`
    return json(await all(hasCategory ? env.DB.prepare(sql).bind(categoryId) : env.DB.prepare(sql)))
  }

  if (request.method === 'POST' && parts.length === 2) {
    const payload = artworkPayload(await readJson(request))
    const missing = missingFields(payload, ['category_id', 'title_zh', 'image_url'])
    if (missing.length) return json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })

    const result = await env.DB.prepare(
      `INSERT INTO artworks
        (category_id, title_zh, title_en, artist_zh, artist_en, year_text,
         medium_zh, medium_en, size_text, image_url, description_zh, description_en,
         sort_order, is_featured, is_active)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(
        payload.category_id,
        payload.title_zh,
        payload.title_en,
        payload.artist_zh,
        payload.artist_en,
        payload.year_text,
        payload.medium_zh,
        payload.medium_en,
        payload.size_text,
        payload.image_url,
        payload.description_zh,
        payload.description_en,
        payload.sort_order,
        payload.is_featured,
        payload.is_active,
      )
      .run()

    return json({ id: result.meta.last_row_id, ...payload }, { status: 201 })
  }

  if (request.method === 'PUT' && parts.length === 3) {
    const payload = artworkPayload(await readJson(request))
    const missing = missingFields(payload, ['category_id', 'title_zh', 'image_url'])
    if (missing.length) return json({ error: `Missing fields: ${missing.join(', ')}` }, { status: 400 })

    await env.DB.prepare(
      `UPDATE artworks SET
        category_id = ?, title_zh = ?, title_en = ?, artist_zh = ?, artist_en = ?,
        year_text = ?, medium_zh = ?, medium_en = ?, size_text = ?, image_url = ?,
        description_zh = ?, description_en = ?, sort_order = ?, is_featured = ?,
        is_active = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
    )
      .bind(
        payload.category_id,
        payload.title_zh,
        payload.title_en,
        payload.artist_zh,
        payload.artist_en,
        payload.year_text,
        payload.medium_zh,
        payload.medium_en,
        payload.size_text,
        payload.image_url,
        payload.description_zh,
        payload.description_en,
        payload.sort_order,
        payload.is_featured,
        payload.is_active,
        parts[2],
      )
      .run()

    return json({ id: Number(parts[2]), ...payload })
  }

  if (request.method === 'DELETE' && parts.length === 3) {
    await env.DB.prepare('DELETE FROM artworks WHERE id = ?').bind(parts[2]).run()
    return json({ ok: true })
  }

  return json({ error: 'Not found' }, { status: 404 })
}

const handleApi = async (request, env, apiPath) => {
  try {
    const url = new URL(request.url)
    const parts = apiPath.split('/').filter(Boolean)

    if (parts[0] === 'health') return json({ ok: true, name: 'MAXAE Cloudflare API' })

    if (parts[0] === 'setup' && parts[1] === 'status' && request.method === 'GET') {
      const adminCount = await getAdminCount(env.DB)
      return json({
        needsSetup: adminCount === 0,
        database: 'connected',
      })
    }

    if (parts[0] === 'setup' && parts[1] === 'init' && request.method === 'POST') {
      const adminCount = await getAdminCount(env.DB)
      if (adminCount > 0) return json({ error: 'Setup already completed' }, { status: 409 })

      const body = await readJson(request)
      const username = String(body.username || '').trim()
      const password = String(body.password || '')
      if (!username || password.length < 8) {
        return json({ error: 'Username is required and password must be at least 8 characters' }, { status: 400 })
      }

      await env.DB.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)')
        .bind(username, await hashPassword(password))
        .run()
      await setSetting(env.DB, 'jwt_secret', randomToken(48))

      return json({ ok: true, username })
    }

    if (parts[0] === 'auth' && parts[1] === 'login' && request.method === 'POST') {
      const body = await readJson(request)
      const username = String(body.username || '').trim()
      const password = String(body.password || '')

      const adminCount = await getAdminCount(env.DB)
      if (adminCount > 0) {
        const admin = await first(env.DB, 'SELECT username, password_hash FROM admins WHERE username = ?', username)
        if (!admin || !(await verifyPassword(password, admin.password_hash))) {
          return json({ error: 'Invalid username or password' }, { status: 401 })
        }
        return json({ username, token: await makeToken(username, await getJwtSecret(env)) })
      }

      if (username !== env.ADMIN_USERNAME || password !== env.ADMIN_PASSWORD) {
        return json({ error: 'Invalid username or password' }, { status: 401 })
      }
      return json({ username, token: await makeToken(username, await getJwtSecret(env)) })
    }

    if (parts[0] === 'public') return routePublic(request, env, parts)

    if (parts[0] === 'admin') {
      const auth = await requireAuth(request, env)
      if (auth) return auth
      if (parts[1] === 'categories') return routeAdminCategories(request, env, parts)
      if (parts[1] === 'artworks') return routeAdminArtworks(request, env, parts, url)
    }

    return json({ error: 'Not found' }, { status: 404 })
  } catch (error) {
    return json({ error: error.message || 'Internal server error' }, { status: 500 })
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url)

    if (url.pathname === '/api') {
      return json({ ok: true, name: 'MAXAE Worker API' })
    }

    if (url.pathname.startsWith('/api/')) {
      return handleApi(request, env, url.pathname.slice('/api/'.length))
    }

    return env.ASSETS.fetch(request)
  },
}
