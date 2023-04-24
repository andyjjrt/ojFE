<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Submissions</v-card-title>
      <div>
        <v-text-field
          v-model="keyword"
          density="compact"
          variant="solo"
          label="Search templates"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
        ></v-text-field>
      </div>
    </div>
    <Datagrid
      :data="submissions"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
    >
      <template v-slot="{ data }: { data: BriefStatus[] }">
        <v-list lines="one">
          <template v-for="item in data" :key="item.id">
            <v-list-item>
              <template v-slot:title>
                <RouterLink
                  class="text-decoration-none text-primary"
                  :to="{ name: 'Problem', params: { id: item.problem } }"
                >
                  {{ item.problem }}
                </RouterLink>
              </template>
              <template v-slot:subtitle>
                {{ getDate(item.create_time) }} {{ item.username }}
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

const router = useRouter();
const routes = useRoute();
const { mobile } = useDisplay();

const submissions = ref<BriefStatus[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const keyword = ref("");

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  keyword.value = routes.query.keyword as string;
  loading.value = true;
  const response = await fetchApi("/submissions", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
    },
  });
  loading.value = false;
  submissions.value = response.data.data.results;
  total.value = response.data.data.total;
};

const handleAction = () => {
  let params: { [key: string]: any } = {};
  if (page.value !== 1) params.page = page.value;
  if (keyword.value !== "") params.keyword = keyword.value;
  if (limit.value !== 10) params.limit = limit.value;
  router.push({
    path: routes.path,
    query: params,
  });
};

const getDate = computed(() => {
  return (dateString: string) => {
    const date = new Date(dateString);
    return (
      (mobile.value ? "" : date.getFullYear() + "/") +
      (date.getMonth() < 9 ? "0" : "") +
      (date.getMonth() + 1) +
      "/" +
      (date.getDate() < 10 ? "0" : "") +
      date.getDate() +
      " " +
      (date.getHours() < 10 ? "0" : "") +
      date.getHours() +
      ":" +
      (date.getMinutes() < 10 ? "0" : "") +
      date.getMinutes() +
      (mobile.value
        ? ""
        : ":" + (date.getSeconds() < 10 ? "0" : "") + date.getSeconds())
    );
  };
});

onMounted(() => {
  init();
});

watch(page, () => handleAction());
watch(limit, () => handleAction());
watch(
  () => routes.query,
  () => init()
);
</script>
