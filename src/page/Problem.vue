<template>
  <Problem :problem="problem" v-if="problem" />
  <v-row v-else>
    <v-col md="9">
      <v-skeleton-loader type="heading, article@2, image" />
    </v-col>
    <v-col md="3" v-if="mdAndUp">
      <v-skeleton-loader type="list-item-avatar@5" />
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, watch } from "vue";
import { useDisplay } from "vuetify";
import { fetchApi } from "../utils/api";
import Problem from "../components/Problem.vue";
import { useUserStore } from "../store/user";
import Loader from "../components/Loader.vue";

const { mdAndUp } = useDisplay();

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
