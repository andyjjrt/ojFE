<template>
  <v-card class="pa-4">
    <v-card-title>{{ t("tags.title") }}</v-card-title>
    <div class="mb-2">
      <v-skeleton-loader v-if="loading" type="chip@2" />
      <v-chip
        class="ma-1 me-2"
        size="small"
        label
        :variant="routes.query.tag === tag.name ? 'elevated' : 'tonal'"
        color="primary"
        @click="handleClick(tag.name)"
        v-for="tag in tags"
      >
        {{ tag.name }}
      </v-chip>
    </div>
    <v-btn block @click="handlePickone" prepend-icon="mdi-shuffle">
      {{ t("tags.pickone") }}
    </v-btn>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { fetchApi } from "../utils/api";
import Message from "vue-m-message";

const routes = useRoute();
const router = useRouter();
const { t } = useI18n();

const tags = ref<Tag[]>([]);
const loading = ref(false);

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/problem/tags", "get");
  loading.value = false;
  tags.value = response.data.data;
};

const handlePickone = async () => {
  const response = await fetchApi("/pickone", "get");
  const problemId = response.data.data;
  Message.success("Good Luck!")
  router.push({ name: "Problem", params: { problemId: problemId } });
};

const handleClick = (name: string) => {
  if (routes.query.tag === name) {
    router.push({ path: routes.path });
  } else {
    router.push({ path: routes.path, query: { tag: name } });
  }
};

onMounted(() => {
  init();
});
</script>
