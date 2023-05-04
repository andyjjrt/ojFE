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
            <v-list-item :to="getProblemLocation(item.id)">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <template v-slot:prepend>
                <DifficultyLabel :difficulty="item.difficulty" />
              </template>
              <template v-slot:append>
                <Downloader
                  :link="`/admin/test_case?problem_id=${item.id}`"
                  :title="`${item.id}_${item.title}_testcase`"
                >
                  <template v-slot="{ handleDownload, loading }">
                    <v-tooltip text="Download Testcases" location="top">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          @click.stop.prevent="handleDownload"
                          :loading="loading"
                          v-bind="props"
                          variant="text"
                          icon
                          size="small"
                          class="mx-1"
                        >
                          <v-icon icon="mdi-download" />
                        </v-btn>
                      </template>
                    </v-tooltip>
                  </template>
                </Downloader>
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
      <template v-slot:footer>
        <v-btn color="primary" :to="getCreateProblem">Create</v-btn>
      </template>
    </Datagrid>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";
import Datagrid from "../../components/Datagrid.vue";
import Downloader from "../../components/Admin/Downloader.vue";
import DifficultyLabel from "../DifficultyLabel.vue";
import ErrorMessage from "../ErrorMessage.vue";

const router = useRouter();
const routes = useRoute();
const user = useUserStore();

const props = defineProps<{
  contestId?: string;
}>();

const problems = ref<ManagementProblem[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const keyword = ref("");

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) => (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  keyword.value = (routes.query.keyword as string) || "";
  error.value = null;
  loading.value = true;
  const response = await fetchApi(
    `/admin/${props.contestId ? "contest/" : ""}problem`,
    "get",
    {
      params: {
        offset: offset.value,
        limit: limit.value,
        keyword: keyword.value,
        contest_id: props.contestId,
      },
    }
  );
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
  loading.value = true;
  const response = await fetchApi(
    `/admin/${props.contestId ? "contest/" : ""}problem`,
    "put",
    {
      data: {
        ...problem,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  init();
};

const getProblemLocation = computed(() => {
  return (id: number) => {
    if (props.contestId) {
      return {
        name: "AdminContestProblem",
        params: {
          contestId: props.contestId,
          problemId: id,
        },
      };
    } else {
      return {
        name: "AdminProblem",
        params: {
          problemId: id,
        },
      };
    }
  };
});

const getCreateProblem = computed(() => {
  if (props.contestId) {
    return {
      name: "AdminContestProblemCreate",
      params: {
        contestId: props.contestId,
      },
    };
  } else {
    return {
      name: "AdminProblemCreate",
    };
  }
});

onMounted(() => {
  init();
});

watch(page, () => handleAction());
watch(limit, () => handleAction(true));
watch(routes, (newVal, oldVal) => {
  if (newVal.name === "AdminContestProblems" || newVal.name === "AdminProblems") init();
});
watch(
  () => user.profile,
  () => init()
);
</script>
