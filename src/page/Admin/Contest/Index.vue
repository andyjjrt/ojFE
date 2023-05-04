<template>
  <div>
    <Loader v-if="loading" />
    <Contest
      v-else-if="contest"
      :contest="contest"
      @handleUpdate="handleUpdate"
      @handleSave="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, watch, computed } from "vue";
import { fetchApi } from "../../../utils/api";
import { useUserStore } from "../../../store/user";
import Message from "vue-m-message";
import Contest from "../../../components/Admin/Contest.vue";
import { provide } from "vue";
import Loader from "../../../components/Loader.vue";

const routes = useRoute();
const user = useUserStore();

const contest = ref<ManagementContest | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const contestId = routes.params.contestId;

const init = async () => {
  error.value = null;
  loading.value = true;
  const response = await fetchApi("/admin/contest", "get", {
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
};

const handleSave = async () => {
  error.value = null;
  loading.value = true;
  const response = await fetchApi("/admin/contest", "put", {
    data: contest.value,
  });
  loading.value = false;
  if (response.data.error) {
    error.value = response.data.data;
    return;
  }
  contest.value = response.data.data;
};

const handleUpdate = (_contest: ManagementContest) => {
  contest.value = _contest;
};

onMounted(() => init());
watch(
  () => user.profile,
  () => init()
);
</script>
