<template>
  <div>
    <ErrorMessage :message="error" v-if="error" />
    <Loader v-else-if="loading" />
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
          {{ t("contest.overview") }}
        </v-tab>
        <v-tab
          :to="{ name: 'ContestProblems', params: { contestId: contestId } }"
        >
          {{ t("problem.title") }}
        </v-tab>
        <v-tab
          :to="{ name: 'ContestSubmissions', params: { contestId: contestId } }"
        >
          {{ t("submission.title") }}
        </v-tab>
        <v-tab :to="{ name: 'ContestRank', params: { contestId: contestId } }">
          {{ t("rank.title") }}
        </v-tab>
        <v-tab
          :to="{ name: 'AdminContest', params: { contestId: contestId } }"
          v-if="user.isAdmin"
        >
          {{ t("management.title") }}
        </v-tab>
      </v-tabs>
      <div class="my-6">
        <v-card v-if="!access" title="Password Required" class="pa-4">
          <v-text-field label="Password" v-model="password"></v-text-field>
          <v-card-actions class="d-flex justify-end">
            <v-btn color="primary" @click="handleAccess">Access</v-btn>
          </v-card-actions>
        </v-card>
        <RouterView v-slot="{ Component }" v-else>
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
import { useI18n } from "vue-i18n";
import { fetchApi } from "../utils/api";
import ErrorMessage from "../components/ErrorMessage.vue";
import Loader from "../components/Loader.vue";
import { useUserStore } from "../store/user";
import Message from "vue-m-message";
import { contestStatusList } from "../utils/status";

const routes = useRoute();
const user = useUserStore();
const { t } = useI18n();

const contest = ref<Contest | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const contestId = routes.params.contestId;
const remainTime = ref(0);
const timer = ref(0);

const access = ref(true);
const password = ref("");

const init = async () => {
  error.value = null;
  access.value = true;
  loading.value = true;
  const response = await fetchApi("/contest", "get", {
    params: {
      id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) {
    error.value = response.data.data;
    return;
  }
  contest.value = response.data.data;
  remainTime.value = Math.round(
    (new Date(contest.value!.end_time).getTime() - new Date().getTime()) / 1000
  );
  timer.value = window.setInterval(() => {
    const time = Math.round(
      (new Date(contest.value!.end_time).getTime() - new Date().getTime()) /
        1000
    );
    if (time < 0) window.clearInterval(timer.value);
    else remainTime.value = time;
  }, 1000);

  if (
    (response.data.data as Contest).contest_type === "Password Protected" &&
    !user.profile!.user.admin_type.includes("Admin")
  ) {
    loading.value = true;
    const response = await fetchApi("/contest/access", "get", {
      params: {
        contest_id: contestId,
      },
    });
    loading.value = false;
    if (response.data.error) {
      error.value = response.data.data;
      return;
    }
    access.value = response.data.data.access;
  }
};

const remainTimeString = computed(() => {
  if (!contest.value) return { type: undefined, short: undefined };
  if (remainTime.value < 0) return { type: "error", value: t("contest.ended") };
  if (new Date() < new Date(contest.value.start_time))
    return { type: "warning", value: t("contest.notStarted") };
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

const handleAccess = async () => {
  loading.value = true;
  const response = await fetchApi("/contest/password", "post", {
    data: {
      contest_id: contestId,
      password: password.value,
    },
  });
  loading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
    password.value = "";
  } else {
    init();
  }
};

provide("contest", readonly(contest));

onMounted(() => init());
watch(
  () => user.profile,
  () => init()
);
</script>
