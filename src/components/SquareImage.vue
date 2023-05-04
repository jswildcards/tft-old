<script setup lang="ts">
import { computed, ref, toRefs } from 'vue'

interface Props {
  src: string
  size?: "xs" | "sm" | "md" | "lg"
}

const props = withDefaults(defineProps<Props>(), {
  size: "md"
})

const { size, src } = toRefs(props)

const imageSizeClass = {
  xs: "w-4 h-4",
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-16 h-16",
}
</script>

<template>
  <img :class="imageSizeClass[size]" :src="src" />
</template>
