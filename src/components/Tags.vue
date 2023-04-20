<template>
  <v-card class="pa-4">
    <v-card-title>Tags</v-card-title>
    <v-chip
      class="ma-1 me-2"
      size="small"
      label
      color="primary"
      v-for="tag in tags"
    >
      {{ tag.name }}
    </v-chip>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fetchApi } from "../utils/api";

const tags = ref<Tag[]>([]);
const loading = ref(false);

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/problem/tags", "get");
  loading.value = false;
  tags.value = response.data.data;
};

onMounted(() => {
  init();
});
</script>
