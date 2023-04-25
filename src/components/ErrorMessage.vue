<template>
  <v-alert :text="message" type="error"></v-alert>
</template>

<script setup lang="ts">
const props = defineProps<{
  message: string;
}>();
</script>
