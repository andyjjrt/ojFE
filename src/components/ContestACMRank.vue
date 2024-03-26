<template>
  <div>
    <div class="pa-4 d-flex justify-space-between align-center">
      <v-switch
        :label="t('rank.autoRefresh')"
        v-model="autoReload"
        hide-details
        density="compact"
        :disabled="loading"
      />
    </div>
    <!-- <v-card class="pa-4 mb-6">
      <v-overlay
        contained
        persistent
        class="align-center justify-center"
        :modelValue="loading"
      >
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>
      
      <div
        style="margin: 0 auto; position: relative; width: 100%"
        :style="{ height: mobile ? '300px' : '400px' }"
      >
        <LineChart :chartData="chartData" v-if="chartData.datasets.length" />
      </div>
    </v-card> -->
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
        <template v-slot="{ data }: { data: ContestACMRankUser[] }">
          <v-table v-if="data.length">
            <thead>
              <tr>
                <th>{{ t("rank.username") }}</th>
                <th>AC / Total</th>
                <th>Total Time</th>
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
                  {{ item.accepted_number }} / {{ item.submission_number }}
                </td>
                <td>
                  {{ formatTime(item.total_time) }}
                </td>
                <td
                  v-for="problem in problems"
                  :class="getBackgroundColor(item.submission_info[problem.id])"
                >
                  <div
                    v-if="item.submission_info[problem.id]"
                    class="d-flex flex-column align-center"
                  >
                    <span v-if="item.submission_info[problem.id].ac_time">
                      {{ formatTime(item.submission_info[problem.id].ac_time) }}
                    </span>
                    <span v-if="item.submission_info[problem.id].error_number">
                      (-{{ item.submission_info[problem.id].error_number }})
                    </span>
                  </div>
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
  reactive,
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
import LineChart from "../components/LineChart.vue";
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

const ranks = ref<ContestACMRankUser[]>([]);
const chartData = ref<{
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
}>({
  labels: [],
  datasets: [],
});
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
  Object.assign(chartData.value, {
    labels: [],
    datasets: [],
  });
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
    // Init chart data
    let tmp: {
      labels: number[];
      datasets: {
        label: string;
        data: number[];
        backgroundColor: string;
        borderColor: string;
        borderWidth: number;
      }[];
    } = {
      labels: [],
      datasets: [],
    };
    ranks.value.forEach((r) => {
      Object.keys(r.submission_info).forEach((submission) => {
        tmp.labels.push(r.submission_info[submission].ac_time);
      });
    });
    tmp.labels = [...new Set(tmp.labels)];
    tmp.labels.sort((a, b) => a - b);
    ranks.value.forEach((r) => {
      tmp.datasets.push({
        label: r.user.username,
        data: [0, 1, 2],
        backgroundColor: "rgb(255, 99, 132, 0.4)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      });
    });

    Object.assign(chartData.value, tmp);
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

const formatTime = (time: number) => {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor((time / (60 * 60)) % 24);
  if (!seconds && !minutes && !hours) return "";
  return `${hours}:${minutes}:${seconds}`;
};

const getBackgroundColor = (problemResult: {
  is_ac: boolean;
  ac_time: number;
  is_first_ac: boolean;
  error_number: number;
}) => {
  if (!problemResult) return "";
  if (problemResult.is_first_ac) return "bg-success";
  if (problemResult.is_ac) return "bg-green-lighten-3";
  else return "bg-red-lighten-3";
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

// const chartData = computed(() => {
//   return {
//     labels: rankLabels.value,
//     datasets: ranks.value.map((data) => ({
//       label: data.user.username,
//       data: rankLabels.value.map((r) => {
//         Object.keys(data.submission_info).forEach((s) => {
//           if (r == data.submission_info[s].ac_time) return 1;
//         });
//         return NaN;
//       }),
//       backgroundColor: "rgb(255, 99, 132, 0.4)",
//       borderColor: "rgb(255, 99, 132)",
//       borderWidth: 1,
//     })),
//   };
// });

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

watch(chartData, (val) => {
  console.log(val);
});
</script>
