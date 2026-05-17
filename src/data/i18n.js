export const messages = {
  nav: {
    exhibition: { zh: '\u5c55\u89c8', en: 'Exhibition' },
    about: { zh: '\u5173\u4e8e', en: 'About' },
  },
  hero: {
    subtitle: {
      zh: '\u827a\u672f\u4e0d\u662f\u5355\u4e00\u7684\u5a92\u4ecb\uff0c\n\u800c\u662f\u4e00\u79cd\u89c2\u770b\u4e16\u754c\u7684\u65b9\u5f0f\u3002\n\u4ece\u7ebf\u6761\u3001\u8272\u5f69\u5230\u6750\u6599\u4e0e\u7a7a\u95f4\uff0c\n\u6bcf\u4e00\u79cd\u8868\u8fbe\uff0c\u90fd\u5728\u91cd\u65b0\u5b9a\u4e49\u611f\u77e5\u3002',
      en: 'Art is not a single medium, but a way of seeing. From line and color to material and space, every expression reshapes perception.',
    },
    scroll: { zh: '\u5f00\u542f\u827a\u672f\u4e4b\u65c5', en: 'Begin the Journey' },
  },
  works: {
    title: { zh: '\u5728\u4e0d\u540c\u5a92\u4ecb\u4e4b\u95f4\uff0c\u5bfb\u627e\u827a\u672f\u7684\u5171\u632f', en: 'Finding Resonance Across Mediums' },
    subtitle: {
      zh: '',
      en: 'MAX\u00c6.ART gathers art through categories, materials, and ways of seeing.',
    },
    paragraphs: {
      zh: [
        'MAX\u00c6.ART \u5173\u6ce8\u591a\u5143\u827a\u672f\u95e8\u7c7b\u4e4b\u95f4\u7684\u4ea4\u6c47\uff1a\u4ece\u4e2d\u56fd\u753b\u3001\u6cb9\u753b\u3001\u7248\u753b\u3001\u96d5\u5851\uff0c\u5230\u58c1\u753b\u3001\u7d20\u63cf\u3001\u4e66\u6cd5\u3001\u6c34\u5f69\u4e0e\u7c89\u753b\u3001\u7efc\u5408\u6750\u6599\u827a\u672f\u3002\u8fd9\u91cc\u4e0d\u662f\u4ee5\u5355\u4e00\u98ce\u683c\u5212\u5206\u827a\u672f\uff0c\u800c\u662f\u4ee5\u5a92\u4ecb\u3001\u6280\u6cd5\u4e0e\u89c2\u770b\u65b9\u5f0f\u4e3a\u7ebf\u7d22\uff0c\u5efa\u7acb\u4e00\u4e2a\u5f00\u653e\u7684\u827a\u672f\u5165\u53e3\u3002\u6bcf\u4e00\u79cd\u6750\u6599\u90fd\u6709\u81ea\u5df1\u7684\u8bed\u8a00\uff1a\u7eb8\u5f20\u8bb0\u5f55\u547c\u5438\uff0c\u989c\u6599\u627f\u8f7d\u65f6\u95f4\uff0c\u91d1\u5c5e\u4e0e\u77f3\u6750\u5851\u9020\u4f53\u91cf\uff0c\u7ebf\u6761\u5219\u5728\u6c89\u9ed8\u4e2d\u5efa\u7acb\u79e9\u5e8f\u3002MAX\u00c6.ART \u5e0c\u671b\u8ba9\u89c2\u8005\u4ece\u5206\u7c7b\u8fdb\u5165\u4f5c\u54c1\uff0c\u4ece\u4f5c\u54c1\u56de\u5230\u611f\u77e5\uff0c\u5728\u4e0d\u540c\u827a\u672f\u95e8\u7c7b\u4e4b\u95f4\uff0c\u91cd\u65b0\u53d1\u73b0\u5f62\u5f0f\u3001\u6750\u6599\u4e0e\u7cbe\u795e\u4e4b\u95f4\u7684\u8054\u7cfb\u3002',
      ],
      en: [
        'MAX\u00c6.ART looks at the intersections between art categories: Chinese painting, oil painting, printmaking, sculpture, mural painting, drawing, calligraphy, watercolor and pastel, and mixed media.',
        'Rather than sorting art by a single style, the site uses medium, technique, and ways of seeing as its map.',
        'Every material has its own language: paper records breath, pigment carries time, metal and stone shape volume, and line builds order in silence.',
        'MAX\u00c6.ART invites viewers to enter through categories, return through works, and rediscover the connection between form, material, and spirit.',
      ],
    },
  },
  footer: {
    text: 'MAX\u00c6.ART / Art Exhibition / Categories / Studio / studio@maxae.art',
  },
}

export const works = [
  {
    number: '#01',
    title: 'CATEGORIES',
    label: { zh: '\u827a\u672f\u95e8\u7c7b', en: 'Art Categories' },
    action: { zh: '\u6d4f\u89c8\u5206\u7c7b', en: 'Browse Categories' },
    href: '/exhibition.html',
    tone: 'purple',
  },
  {
    number: '#02',
    title: 'RANDOM',
    label: { zh: '\u968f\u673a\u5c55\u89c8', en: 'Random Exhibition' },
    action: { zh: '\u968f\u673a\u8fdb\u5165', en: 'Enter Randomly' },
    href: '/exhibition.html?random=1',
    tone: 'yellow',
  },
  {
    number: '#03',
    title: 'ARTISTS',
    label: { zh: '\u827a\u672f\u5bb6\u6863\u6848', en: 'Artist Archive' },
    action: { zh: '\u63a2\u7d22\u827a\u672f\u5bb6', en: 'Explore Artists' },
    href: '/about.html',
    tone: 'gradient',
  },
]
