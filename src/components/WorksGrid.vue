<script setup>
defineProps({
  lang: {
    type: String,
    required: true,
  },
  works: {
    type: Array,
    required: true,
  },
  labels: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <section id="gallery" class="works-section" aria-labelledby="works-title">
    <h2 id="works-title" class="section-title">
      <span :key="lang" class="fade-enter">{{ labels.title[lang] }}</span>
      <span>/ 2026</span>
    </h2>

    <div class="statement-copy">
      <p v-if="labels.subtitle[lang]" class="statement-subtitle">
        {{ labels.subtitle[lang] }}
      </p>
      <p v-for="paragraph in labels.paragraphs[lang]" :key="paragraph">
        {{ paragraph }}
      </p>
    </div>

    <div class="works-grid">
      <article
        v-for="work in works"
        :key="work.number"
        class="work-card"
        :class="`tone-${work.tone}`"
      >
        <div class="work-number">{{ work.number }}</div>
        <div>
          <p class="work-label">{{ work.label[lang] }}</p>
          <h3 class="work-title">{{ work.title }}</h3>
        </div>
        <a class="work-link" :href="work.href">
          <span>{{ work.action[lang] }}</span>
          <span aria-hidden="true">→</span>
        </a>
      </article>
    </div>
  </section>
</template>
