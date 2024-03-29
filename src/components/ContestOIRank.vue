<template>
  <div>
    <v-card class="pa-4 mb-6">
      <v-overlay
        contained
        persistent
        class="align-center justify-center"
        :modelValue="loading"
      >
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>
      <div class="d-flex justify-space-between align-center">
        <v-switch
          :label="t('rank.autoRefresh')"
          v-model="autoReload"
          hide-details
          density="compact"
          :disabled="loading"
        />
      </div>

      <div
        style="margin: 0 auto; position: relative; width: 100%"
        :style="{ height: mobile ? '300px' : '400px' }"
      >
        <BarChart :chartData="chartData" />
      </div>
    </v-card>
    <v-card class="pa-4">
      <v-card-title>{{ t("rank.title") }}</v-card-title>
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
        <template v-slot="{ data }: { data: ContestOIRankUser[] }">
          <v-table v-if="data.length">
            <thead>
              <tr>
                <th>{{ t("rank.username") }}</th>
                <th>{{ t("rank.score") }}</th>
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
import {
  computed,
  onMounted,
  ref,
  watch,
  onBeforeUnmount,
  inject,
  Ref,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { fetchApi } from "../utils/api";
import Datagrid from "../components/Datagrid.vue";
import BarChart from "../components/BarChart.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import { useUserStore } from "../store/user";
import { useConstantsStore } from "../store/constants";

const router = useRouter();
const routes = useRoute();
const { mobile } = useDisplay();
const { t } = useI18n();
const user = useUserStore();
const constants = useConstantsStore();

const contest = inject("contest") as Ref<Contest>;

const ranks = ref<ContestOIRankUser[]>([]);
const problems = ref<Problem[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const autoReload = ref(false);
const autoreloadTimer = ref(0);
const contestId = routes.params.contestId;

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  error.value = null;
  if (!autoReload.value) loading.value = true;
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
  document.title = `${constants.website!.website_name_shortcut} | ${
    contest.value.title
  }`;
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

onBeforeUnmount(() => window.clearInterval(autoreloadTimer.value));

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
watch(autoReload, (newVal) => {
  if (newVal) {
    autoreloadTimer.value = window.setInterval(() => init(), 10000);
  } else {
    window.clearInterval(autoreloadTimer.value);
  }
});
watch(
  () => user.profile,
  async () => {
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
  }
);
</script>
