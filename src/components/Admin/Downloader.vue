<template>
  <slot :handleDownload="handleDownload" :loading="loading">
    <v-btn @click.stop.prevent="handleDownload" :loading="loading">click</v-btn>
  </slot>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { fetchApi } from "../../utils/api";

const props = defineProps<{
  link: string;
  title: string;
}>();

const loading = ref(false);

const handleDownload = async () => {
  loading.value = true;
  const response = await fetchApi(props.link, "get", {
    responseType: "blob",
  });
  let blob = new Blob([response.data], { type: "application/zip" });
  let url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = props.title;
  link.click();
  URL.revokeObjectURL(url);
  loading.value = false;
};
</script>
