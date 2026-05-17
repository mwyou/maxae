<script setup>
import MaxaeLogo from './MaxaeLogo.vue'

defineProps({
  lang: {
    type: String,
    required: true,
  },
  nav: {
    type: Object,
    required: true,
  },
})

defineEmits(['toggle-language'])
</script>

<template>
  <nav class="site-header" aria-label="Primary navigation">
    <a href="/" class="brand" aria-label="MAXAE.ART home">
      <MaxaeLogo variant="nav" />
    </a>

    <div class="header-actions">
      <div class="desktop-nav">
        <a href="/exhibition.html">{{ nav.exhibition[lang] }}</a>
        <a href="/about.html">{{ nav.about[lang] }}</a>
      </div>

      <button
        class="language-toggle"
        type="button"
        :aria-label="lang === 'zh' ? 'Switch to English' : '\u5207\u6362\u5230\u4e2d\u6587'"
        @click="$emit('toggle-language')"
      >
        {{ lang === 'zh' ? 'EN' : '\u4e2d\u6587' }}
      </button>
    </div>
  </nav>
</template>
