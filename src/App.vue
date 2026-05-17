<script setup>
import { ref, watchEffect } from 'vue'
import { messages, works } from './data/i18n'
import HeroSection from './components/HeroSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import SiteHeader from './components/SiteHeader.vue'
import WorksGrid from './components/WorksGrid.vue'

const languageKey = 'maxae-lang'
const savedLang = localStorage.getItem(languageKey)
const lang = ref(savedLang === 'en' ? 'en' : 'zh')

const toggleLang = () => {
  lang.value = lang.value === 'zh' ? 'en' : 'zh'
}

watchEffect(() => {
  document.documentElement.lang = lang.value === 'zh' ? 'zh-CN' : 'en'
  document.title = 'MAX\u00c6'
  localStorage.setItem(languageKey, lang.value)
})
</script>

<template>
  <div class="site-shell">
    <SiteHeader
      :lang="lang"
      :nav="messages.nav"
      @toggle-language="toggleLang"
    />
    <main>
      <HeroSection :lang="lang" :hero="messages.hero" />
      <WorksGrid :lang="lang" :works="works" :labels="messages.works" />
    </main>
    <SiteFooter :text="messages.footer.text" />
  </div>
</template>
