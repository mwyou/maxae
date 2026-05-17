<script setup>
defineProps({
  variant: {
    type: String,
    default: 'hero',
    validator: (value) => ['hero', 'nav'].includes(value),
  },
})
</script>

<template>
  <img
    class="maxae-logo"
    :class="`maxae-logo--${variant}`"
    src="https://imgbed.698891.xyz/file/logo/maxae/1778980346239_maxae.png"
    alt="MAXAE logo"
    decoding="async"
    fetchpriority="high"
  />
</template>
