<template>
  <div>
    <v-card
      class="pa-4 mb-6"
      style="margin: 0 auto; position: relative; width: 100%"
      :style="{ height: mobile ? '300px' : '400px' }"
    >
      <BarChart :chartData="chartData" />
    </v-card>
    <v-card class="pa-4">
      <v-card-title>Rank</v-card-title>
      <ErrorMessage :message="error" v-if="error" class="mx-4" />
      <Datagrid
        :data="ranks"
        :loading="loading"
        :total="total"
        :page="page"
        :rows-per-page="limit"
        @handleNavigate="handleNavigate"
        @handleChangeRowPerPage="handleChangeRowPerPage"
        v-else
      >
        <template v-slot="{ data }: { data: ContestRankUser[] }">
          <v-table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Score</th>
                <th v-for="problem in problems">{{ problem._id }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item.id">
                <td>
                  <RouterLink
                    class="text-decoration-none text-primary"
                    :to="{
                      name: 'User',
                      query: { username: item.user.username },
                    }"
                  >
                    {{ item.user.username }}
                  </RouterLink>
                </td>
                <td>
                  {{ item.total_score }}
                </td>
                <td v-for="problem in problems">
                  {{ item.submission_info[problem.id] }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </template>
      </Datagrid>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { fetchApi } from "../../utils/api";
import Datagrid from "../../components/Datagrid.vue";
import BarChart from "../../components/BarChart.vue";
import ErrorMessage from "../../components/ErrorMessage.vue";

const router = useRouter();
const routes = useRoute();
const { mobile } = useDisplay();

const ranks = ref<ContestRankUser[]>([]);
const problems = ref<Problem[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const contestId = routes.params.contestId;

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  loading.value = true;
  const response = await fetchApi("/contest_rank", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      contest_id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) {
    error.value = response.data.data;
  } else {
    ranks.value = response.data.data.results;
    total.value = response.data.data.total;
  }
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (limit.value !== 10) params.limit = limit.value;
  router.push({
    path: routes.path,
    query: params,
  });
};

onMounted(async () => {
  init();
  const response = await fetchApi("/contest/problem", "get", {
    params: {
      contest_id: contestId,
    },
  });
  loading.value = false;
  if (response.data.error) {
    error.value = response.data.data;
  } else {
    problems.value = response.data.data;
  }
});

const chartData = computed(() => {
  return {
    labels: ranks.value.map((rank) => rank.user.username),
    datasets: [
      {
        label: "Total",
        data: ranks.value.map((rank) => rank.total_score),
        backgroundColor: "rgb(255, 99, 132, 0.4)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
    ],
  };
});

watch(page, () => handleAction());
watch(limit, () => handleAction(true));
watch(
  () => routes.query,
  () => init()
);
</script>
