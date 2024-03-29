<template>
  <div>
    <v-card
      class="pa-4 mb-6"
      style="margin: 0 auto; position: relative; width: 100%"
      :style="{ height: mobile ? '300px' : '400px' }"
    >
      <v-overlay
        contained
        persistent
        class="align-center justify-center"
        :modelValue="loading"
      >
        <v-progress-circular indeterminate color="primary" />
      </v-overlay>
      <BarChart :chartData="chartData" />
    </v-card>
    <v-card class="pa-4">
      <v-card-title>{{ t("rank.ACMTitle") }}</v-card-title>
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
        <template v-slot="{ data }: { data: RankUser[] }">
          <v-list lines="two" density="compact">
            <template v-for="item in data" :key="item.user.id">
              <v-list-item>
                <v-list-item-title>
                  <RouterLink
                    class="text-decoration-none text-primary"
                    :to="`/user?username=${item.user.username}`"
                  >
                    {{ item.user.username }}
                  </RouterLink>
                </v-list-item-title>
                <v-list-item-subtitle class="d-inline-block text-truncate">
                  {{ item.mood }}
                </v-list-item-subtitle>
                <template v-slot:prepend>
                  <v-avatar :image="item.avatar" />
                </template>
                <template v-slot:append>
                  {{ item.accepted_number }}
                  /
                  {{ item.submission_number }}
                  |
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
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { fetchApi } from "../utils/api";
import Datagrid from "../components/Datagrid.vue";
import BarChart from "../components/BarChart.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

const router = useRouter();
const routes = useRoute();
const { mobile } = useDisplay();
const { t } = useI18n();

const ranks = ref<RankUser[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  loading.value = true;
  const response = await fetchApi("user_rank", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      rule: "ACM",
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
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

onMounted(() => {
  init();
});

const chartData = computed(() => {
  return {
    labels: ranks.value.map((rank) => rank.user.username),
    datasets: [
      {
        label: "AC",
        data: ranks.value.map((rank) => rank.accepted_number),
        backgroundColor: "rgba(255, 99, 132, 0.4)",
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 1,
      },
      {
        label: "Total",
        data: ranks.value.map((rank) => rank.submission_number),
        backgroundColor: "rgb(54, 162, 235, 0.4)",
        borderColor: "rgb(54, 162, 235)",
        borderWidth: 1,
      },
    ],
  };
});

watch(page, () => handleAction());
watch(limit, () => handleAction(true));

watch(routes, (newVal, oldVal) => {
  if (newVal.name === "ACMRank") init();
});
</script>
