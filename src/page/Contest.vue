<template>
  <template v-if="contest">
    <h1>{{ contest.title }}</h1>
    <v-tabs>
      <v-tab :to="{ name: 'Contest', params: { contestId: contestId } }">
        Overview
      </v-tab>
      <v-tab :to="{ name: 'ContestProblems', params: { contestId: contestId } }">
        Problems
      </v-tab>
      <v-tab :to="{ name: 'ContestSubmissions', params: { contestId: contestId } }">
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
import { ref, onMounted, provide, readonly  } from "vue";
import { fetchApi } from "../utils/api";

const routes = useRoute();
const contest = ref<Contest | null>(null);
const loading = ref(false);
const contestId = routes.params.contestId;

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/contest", "get", {
    params: {
      id: contestId,
    },
  });
  loading.value = false;
  contest.value = response.data.data;
};

provide("contest", readonly(contest));

onMounted(() => init());
</script>
