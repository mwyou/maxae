CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL UNIQUE,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  summary_zh TEXT,
  summary_en TEXT,
  medium_zh TEXT,
  medium_en TEXT,
  focus_zh TEXT,
  focus_en TEXT,
  cover_url TEXT,
  accent TEXT NOT NULL DEFAULT '#c084fc',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_active_sort
ON categories (is_active, sort_order);

CREATE TABLE IF NOT EXISTS artworks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT,
  artist_zh TEXT,
  artist_en TEXT,
  year_text TEXT,
  medium_zh TEXT,
  medium_en TEXT,
  size_text TEXT,
  image_url TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_featured INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_artworks_category_active_sort
ON artworks (category_id, is_active, sort_order);

CREATE INDEX IF NOT EXISTS idx_artworks_featured
ON artworks (is_featured, is_active);
