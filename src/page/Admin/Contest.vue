<template>
  <div>
    <v-tabs class="mb-3">
      <v-tab :to="{ name: 'AdminContest', params: { contestId: contestId } }">
        Overview
      </v-tab>
      <v-tab
        :to="{
          name: 'AdminContestAnnouncement',
          params: { contestId: contestId },
        }"
      >
        Announcement
      </v-tab>
      <v-tab
        :to="{ name: 'AdminContestProblems', params: { contestId: contestId } }"
      >
        Problems
      </v-tab>
    </v-tabs>
    <RouterView v-slot="{ Component }" @handleInit="init">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { reactive, provide, onMounted, readonly } from "vue";
import { useRoute } from "vue-router";
import { fetchApi } from "../../utils/api";

const routes = useRoute();
const contestId = routes.params.contestId;

const contest = reactive<ManagementContest>({
  id: -1,
  created_by: {
    id: -1,
    username: "",
    real_name: null,
  },
  status: "",
  contest_type: "",
  title: "",
  description: "",
  real_time_rank: true,
  rule_type: "OI",
  start_time: "",
  end_time: "",
  create_time: "",
  last_update_time: "",
  password: "",
  visible: true,
  allowed_ip_ranges: [],
});

provide("contest", contest);

const init = async () => {
  const response = await fetchApi("/admin/contest", "get", {
    params: {
      id: contestId,
    },
  });
  Object.assign(contest, response.data.data);
};

onMounted(() => init());
</script>
