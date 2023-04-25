<template>
  <ErrorMessage :message="error" v-if="error" />
  <template v-else-if="contest">
    <h1>{{ contest.title }}</h1>
    <v-tabs>
      <v-tab :to="{ name: 'Contest', params: { contestId: contestId } }">
        Overview
      </v-tab>
      <v-tab
        :to="{ name: 'ContestProblems', params: { contestId: contestId } }"
      >
        Problems
      </v-tab>
      <v-tab
        :to="{ name: 'ContestSubmissions', params: { contestId: contestId } }"
      >
        Status
      </v-tab>
      <v-tab :to="{ name: 'ContestRank', params: { contestId: contestId } }">
        Rank
      </v-tab>
    </v-tabs>
    <div class="my-6">
      <RouterView />
    </div>
  </template>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, provide, readonly } from "vue";
import { fetchApi } from "../utils/api";
import ErrorMessage from "../components/ErrorMessage.vue";

const routes = useRoute();
const contest = ref<Contest | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const contestId = routes.params.contestId;

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/contest", "get", {
    params: {
      id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else contest.value = response.data.data;
};

provide("contest", readonly(contest));

onMounted(() => init());
</script>
