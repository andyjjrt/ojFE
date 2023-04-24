<template>
  <v-card class="pa-4" v-if="contests">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Contests</v-card-title>
      <div class="d-flex align-center w-50">
        <TypeSelection
          :label="status"
          defaultLabel="Status"
          :items="['-1', '0', '1']"
          @click="handleChangeStatus"
        >
          <template v-slot:label="{ item }">
            {{ contestStatusList[item].name }}
          </template>
          <template v-slot:item="{ item }">
            {{ contestStatusList[item].name }}
          </template>
        </TypeSelection>
        <TypeSelection
          :label="ruleType"
          defaultLabel="Rule"
          :items="['OI', 'ACM']"
          @click="handleChangeRuleType"
        >
          <template v-slot:item="{ item }">
            {{ item }}
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
      :data="contests"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
    >
      <template v-slot="{ data }: { data: Contest[] }">
        <v-list lines="two" density="compact">
          <template v-for="item in data">
            <v-list-item :to="`/constest/${item.id}`" :active="false">
              <template v-slot:title>
                <div class="d-flex align-center">
                  {{ item.title }}
                  <v-chip
                    color="info"
                    size="small"
                    density="compact"
                    class="mx-2"
                  >
                    {{ item.contest_type }}
                  </v-chip>
                </div>
              </template>
              <template v-slot:subtitle>
                {{ getDate(item.start_time, mobile) }}
                ~
                {{ getDate(item.end_time, mobile) }}
              </template>
              <template v-slot:prepend>
                <v-icon icon="mdi-trophy" />
              </template>

              <template v-slot:append>
                <v-chip
                  class="ma-1 me-2"
                  size="small"
                  label
                  :color="contestStatusList[item.status].type"
                >
                  {{ contestStatusList[item.status].name }}
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
import useDate from "../hooks/useDate";
import { fetchApi } from "../utils/api";
import { contestStatusList } from "../utils/status";
import Datagrid from "../components/Datagrid.vue";
import TypeSelection from "../components/TypeSelection.vue";
import { stat } from "fs";

const router = useRouter();
const routes = useRoute();
const { mobile } = useDisplay();
const { getDate } = useDate();

const contests = ref<Contest[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const keyword = ref("");
const ruleType = ref("");
const status = ref("");

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);
const handleChangeStatus = (newStatus: string) => {
  if (newStatus === "all") status.value = "";
  else status.value = newStatus;
};
const handleChangeRuleType = (newRuleType: string) => {
  if (newRuleType === "all") ruleType.value = "";
  else ruleType.value = newRuleType;
};

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  keyword.value = (routes.query.keyword as string) || "";
  ruleType.value = (routes.query.rule_type as string) || "";
  status.value = (routes.query.status as string) || "";
  loading.value = true;
  const response = await fetchApi("/contests", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
      rule_type: ruleType.value,
      status: status.value,
    },
  });
  loading.value = false;
  contests.value = response.data.data.results;
  total.value = response.data.data.total;
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (keyword.value !== "") params.keyword = keyword.value;
  if (limit.value !== 10) params.limit = limit.value;
  if (routes.query.tag) params.tag = routes.query.tag;
  if (ruleType.value !== "") params.rule_type = ruleType.value;
  if (status.value !== "") params.status = status.value;
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
watch(status, () => handleAction(true));
watch(ruleType, () => handleAction(true));
watch(
  () => routes.query,
  () => init()
);
</script>
