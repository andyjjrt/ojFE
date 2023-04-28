<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Submissions</v-card-title>
      <div class="w-50 d-flex" v-if="!error">
        <v-switch
          v-model="myself"
          label="Myself"
          density="compact"
          inline
          hide-details
          class="d-none d-sm-flex"
        />
        <form class="flex-grow-1" @submit.prevent="() => handleAction()">
          <v-text-field
            v-model="username"
            density="compact"
            variant="solo"
            label="username..."
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            @click:append-inner="() => handleAction()"
          ></v-text-field>
        </form>
      </div>
    </div>
    <ErrorMessage :message="error" v-if="error" class="mx-4" />
    <Datagrid
      :data="submissions"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
      v-else
    >
      <template v-slot="{ data }: { data: BriefStatus[] }">
        <v-list lines="one">
          <template v-for="item in data" :key="item.id">
            <v-list-item>
              <template v-slot:title>
                <RouterLink
                  class="text-decoration-none text-primary"
                  :to="getProblemLocation(item.problem)"
                >
                  {{ item.problem }}
                </RouterLink>
              </template>
              <template v-slot:subtitle>
                <span class="me-2">{{
                  getDate(item.create_time, mobile)
                }}</span>
                <RouterLink
                  class="text-decoration-none text-primary"
                  :to="{ name: 'User', query: { username: item.username } }"
                >
                  {{ item.username }}
                </RouterLink>
              </template>
              <template v-slot:append>
                <v-chip
                  size="small"
                  label
                  :to="item.show_link ? `/status/${item.id}` : undefined"
                  :variant="item.show_link ? 'elevated' : 'tonal'"
                  :color="statusList[item.result].type"
                >
                  {{ statusList[item.result].name }}
                </v-chip>
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
    </Datagrid>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { fetchApi } from "../utils/api";
import Datagrid from "./Datagrid.vue";
import statusList from "../utils/status";
import useDate from "../hooks/useDate";
import ErrorMessage from "./ErrorMessage.vue";
import { useUserStore } from "../store/user";

const props = defineProps<{
  contestId?: string;
}>();

const router = useRouter();
const routes = useRoute();
const { mobile } = useDisplay();
const { getDate } = useDate();
const user = useUserStore();

const submissions = ref<BriefStatus[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const username = ref("");
const myself = ref(false);

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  username.value = routes.query.username as string;
  myself.value = routes.query.myself ? true : false;
  error.value = null;
  loading.value = true;
  const response = await fetchApi(
    props.contestId ? "/contest_submissions" : "/submissions",
    "get",
    {
      params: {
        offset: offset.value,
        limit: limit.value,
        username: username.value,
        problem_id: routes.query.problem_id,
        myself: myself.value ? 1 : null,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    submissions.value = response.data.data.results;
    total.value = response.data.data.total;
  }
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (username.value !== "") params.username = username.value;
  if (limit.value !== 10) params.limit = limit.value;
  if (routes.query.problem_id) params.problem_id = routes.query.problem_id;
  if (myself.value) params.myself = 1;
  router.push({
    path: routes.path,
    query: params,
  });
};

const getProblemLocation = computed(() => {
  return (id: string) => {
    let params: any = { problemId: id };
    if (props.contestId) params.contestId = props.contestId;
    return {
      name: props.contestId ? "ContestProblem" : "Problem",
      params,
    };
  };
});

onMounted(() => {
  init();
});

watch(page, () => handleAction());
watch(myself, () => handleAction(true));
watch(limit, () => handleAction(true));
watch(
  () => routes.query,
  () => init()
);
watch(
  () => user.profile,
  () => init()
);
</script>
