<template>
  <div>
    <ErrorMessage :message="error" v-if="error" />
    <Problem :problem="problem" v-else-if="problem" />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { fetchApi } from "../../utils/api";
import Problem from "../../components/Problem.vue";
import ErrorMessage from "../../components/ErrorMessage.vue";
import { useUserStore } from "../../store/user";

const routes = useRoute();
const user = useUserStore();

const problem = ref<Problem | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const problemId = routes.params.problemId;
const contestId = routes.params.contestId;

const init = async () => {
  error.value = null;
  loading.value = true;
  const response = await fetchApi("/contest/problem", "get", {
    params: {
      problem_id: problemId,
      contest_id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else problem.value = response.data.data;
};

onMounted(() => init());
watch(
  () => user.profile,
  () => init()
);
</script>
