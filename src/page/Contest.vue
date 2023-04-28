<template>
  <div>
    <ErrorMessage :message="error" v-if="error" />
    <template v-else-if="contest">
      <div class="d-flex justify-space-between">
        <h1>{{ contest.title }}</h1>
        <v-chip
          class="ma-1 me-2"
          size="large"
          label
          :color="remainTimeString.type"
          variant="elevated"
        >
          {{ remainTimeString.value }}
        </v-chip>
      </div>

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
        <RouterView v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </RouterView>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, provide, readonly, computed, watch } from "vue";
import { fetchApi } from "../utils/api";
import ErrorMessage from "../components/ErrorMessage.vue";
import { useUserStore } from "../store/user";

const routes = useRoute();
const user = useUserStore();

const contest = ref<Contest | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const contestId = routes.params.contestId;
const remainTime = ref(0);
const timer = ref(0);

const init = async () => {
  error.value = null;
  loading.value = true;
  const response = await fetchApi("/contest", "get", {
    params: {
      id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    contest.value = response.data.data;
    remainTime.value = Math.round(
      (new Date(contest.value!.end_time).getTime() - new Date().getTime()) /
        1000
    );
    timer.value = window.setInterval(() => {
      const time = Math.round(
        (new Date(contest.value!.end_time).getTime() - new Date().getTime()) /
          1000
      );
      if (time < 0) window.clearInterval(timer.value);
      else remainTime.value = time;
    }, 1000);
  }
};

const remainTimeString = computed(() => {
  if (!contest.value) return { type: undefined, value: undefined };
  if (remainTime.value < 0) return { type: "error", value: "Ended" };
  if (new Date() < new Date(contest.value.start_time))
    return { type: "warning", value: "Not Started" };
  const seconds = Math.floor(remainTime.value % 60);
  const minutes = Math.floor(remainTime.value / 60) % 60;
  const hours = Math.floor((remainTime.value / (60 * 60)) % 24);
  const days = Math.floor(remainTime.value / (60 * 60 * 24));
  return {
    type: "success",
    value: `${days}D ${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${seconds < 10 ? "0" : ""}${seconds}`,
  };
});

provide("contest", readonly(contest));

onMounted(() => init());
watch(
  () => user.profile,
  () => init()
);
</script>
