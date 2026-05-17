<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <footer class="site-footer">
    {{ text }}
  </footer>
</template>
