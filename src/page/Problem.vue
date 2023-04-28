<template>
  <Problem :problem="problem" v-if="problem" />
  <Loader v-else />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { fetchApi } from "../utils/api";
import Problem from "../components/Problem.vue";
import { useUserStore } from "../store/user";
import Loader from "../components/Loader.vue";

const routes = useRoute();
const user = useUserStore();
const problem = ref<Problem | null>(null);
const loading = ref(false);
const problemId = routes.params.problemId;

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
watch(
  () => user.profile,
  () => init()
);
</script>
