<template>
  <Problem :problem="problem" v-if="problem" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted } from "vue";
import { fetchApi } from "../utils/api";
import Problem from "../components/Problem.vue";

const routes = useRoute();
const problem = ref<Problem | null>(null);
const loading = ref(false);
const problemId = routes.params.id;

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/problem", "get", {
    params: {
      problem_id: problemId,
    },
  });
  loading.value = false;
  problem.value = response.data.data;
};

onMounted(() => init());
</script>
