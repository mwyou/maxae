<script setup>
import MaxaeLogo from './MaxaeLogo.vue'

defineProps({
  lang: {
    type: String,
    required: true,
  },
  hero: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section class="hero-section" aria-labelledby="hero-title">
    <div class="ambient-orb ambient-orb-purple" aria-hidden="true"></div>
    <div class="ambient-orb ambient-orb-yellow" aria-hidden="true"></div>

    <div :key="lang" class="hero-content fade-enter">
      <h1 id="hero-title" class="sr-only">maxae.art</h1>
      <MaxaeLogo variant="hero" />
      <p class="hero-subtitle" :class="{ 'is-zh': lang === 'zh' }">
        {{ hero.subtitle[lang] }}
      </p>
    </div>

    <div class="scroll-cue" aria-hidden="true">
      <span>{{ hero.scroll[lang] }}</span>
      <div></div>
    </div>
  </section>
</template>
