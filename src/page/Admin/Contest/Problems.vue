<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Problems</v-card-title>
      <div class="d-flex align-center w-50">
        <form class="flex-grow-1" @submit.prevent="() => handleAction()">
          <v-text-field
            v-model="keyword"
            density="compact"
            variant="solo"
            label="keyword..."
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
      :data="problems"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
      v-else
    >
      <template v-slot="{ data }: { data: ManagementProblem[] }">
        <v-list lines="one" density="compact">
          <template v-for="item in data">
            <v-list-item>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <template v-slot:prepend>
                <DifficultyLabel :difficulty="item.difficulty" />
              </template>
              <template v-slot:append>
                <div class="d-flex-inline">
                  <v-switch
                    color="primary"
                    hide-details
                    density="compact"
                    v-model="item.visible"
                    @click.native.stop
                    @update:modelValue="() => handleChangeVisibility(item)"
                  >
                    <template v-slot:label>
                      <v-icon :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'" />
                    </template>
                  </v-switch>
                </div>
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
import { useUserStore } from "../../../store/user";
import { fetchApi } from "../../../utils/api";
import Datagrid from "../../../components/Datagrid.vue";
import DifficultyLabel from "../../../components/DifficultyLabel.vue";
import TypeSelection from "../../../components/TypeSelection.vue";
import ErrorMessage from "../../../components/ErrorMessage.vue";

const router = useRouter();
const routes = useRoute();
const user = useUserStore();

const problems = ref<ManagementProblem[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const keyword = ref("");
const contestId = routes.params.contestId;

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) => (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  keyword.value = (routes.query.keyword as string) || "";
  error.value = null;
  loading.value = true;
  const response = await fetchApi("/admin/contest/problem", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
      contest_id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    problems.value = response.data.data.results;
    total.value = response.data.data.total;
  }
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (keyword.value !== "") params.keyword = keyword.value;
  if (limit.value !== 10) params.limit = limit.value;
  if (routes.query.tag) params.tag = routes.query.tag;
  router.push({
    path: routes.path,
    query: params,
  });
};

const handleChangeVisibility = async (problem: ManagementProblem) => {
  console.log(problem.visible);
  loading.value = true;
  const response = await fetchApi("/admin/contest/problem", "put", {
    data: {
      ...problem,
      contest_id: contestId,
    },
  });
  loading.value = false;
  init();
};

onMounted(() => {
  init();
});

watch(page, () => handleAction());
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
