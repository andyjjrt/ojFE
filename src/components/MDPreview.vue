<template>
  <MdPreview :modelValue="text" :theme="theme" previewTheme="vuepress" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
import { MdPreview } from "md-editor-v3";

const props = defineProps<{
  text: string;
}>();

const vuetifyTheme = useTheme();
const theme = computed(() =>
  vuetifyTheme.global.name.value === "dark" ? "dark" : "light"
);
</script>
