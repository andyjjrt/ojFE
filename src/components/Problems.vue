<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Problems</v-card-title>
      <div class="d-flex align-center w-50">
        <TypeSelection
          :label="difficulty"
          defaultLabel="Difficulty"
          :items="['Low', 'Mid', 'High']"
          @click="handleChangeDifficulty"
          class="d-none d-sm-flex"
        >
          <template v-slot:item="{ item }">
            <DifficultyLabel :difficulty="item" />
          </template>
        </TypeSelection>
        <form class="flex-grow-1" @submit.prevent="() => handleAction">
          <v-text-field
            v-model="keyword"
            density="compact"
            variant="solo"
            label="keyword..."
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            @click:append-inner="() => handleAction"
          ></v-text-field>
        </form>
      </div>
    </div>
    <Datagrid
      :data="problems"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
    >
      <template v-slot="{ data }: { data: Problem[] }">
        <v-list lines="one" density="compact">
          <template v-for="item in data">
            <v-list-item :to="`/problem/${item._id}`" :active="false">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <template v-slot:prepend>
                <DifficultyLabel :difficulty="item.difficulty" />
              </template>
              <template v-slot:append>
                {{
                  (
                    (item.accepted_number * 100) /
                    item.submission_number
                  ).toFixed(2)
                }}%
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
import { fetchApi } from "../utils/api";
import Datagrid from "./Datagrid.vue";
import DifficultyLabel from "../components/DifficultyLabel.vue";
import TypeSelection from "./TypeSelection.vue";

const router = useRouter();
const routes = useRoute();

const problems = ref<Problem[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const keyword = ref("");
const difficulty = ref("");
const tag = ref<string | null>(null);

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);
const handleChangeDifficulty = (newDifficulty: string) => {
  if (newDifficulty === "all") difficulty.value = "";
  else difficulty.value = newDifficulty;
};

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  keyword.value = routes.query.keyword as string || "";
  difficulty.value = routes.query.difficulty as string || "";
  tag.value = (routes.query.tag as string) || null;
  loading.value = true;
  const response = await fetchApi("/problem", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
      difficulty: difficulty.value,
      tag: tag.value,
    },
  });
  loading.value = false;
  problems.value = response.data.data.results;
  total.value = response.data.data.total;
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (keyword.value !== "") params.keyword = keyword.value;
  if (limit.value !== 10) params.limit = limit.value;
  if (difficulty.value !== "") params.difficulty = difficulty.value;
  if (routes.query.tag) params.tag = routes.query.tag;
  router.push({
    path: routes.path,
    query: params,
  });
};

onMounted(() => {
  init();
});

watch(page, () => handleAction());
watch(limit, () => handleAction(true));
watch(difficulty, () => handleAction(true));
watch(
  () => routes.query,
  () => init()
);
</script>
