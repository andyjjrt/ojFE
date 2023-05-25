<template>
  <v-dialog v-model="dialog" scrollable max-width="900" :persistent="loading">
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props" :class="class">
        Add Public Problem
      </v-btn>
    </template>
    <v-card :disabled="loading">
      <v-toolbar color="primary" title="Add Public Problem">
        <div class="d-flex align-center w-50 me-4" v-if="progress === 0">
          <form class="flex-grow-1" @submit.prevent="() => init()">
            <v-text-field
              v-model="keyword"
              density="compact"
              variant="solo"
              label="keyword..."
              append-inner-icon="mdi-magnify"
              single-line
              hide-details
              @click:append-inner="() => init()"
            />
          </form>
        </div>
      </v-toolbar>
      <v-window v-model="progress">
        <v-window-item>
          <v-card-text class="position-relative">
            <Datagrid
              :data="problems"
              :loading="loading"
              :total="total"
              :page="page"
              :rows-per-page="limit"
              @handleNavigate="handleNavigate"
              @handleChangeRowPerPage="handleChangeRowPerPage"
            >
              <template v-slot="{ data }: { data: ManagementProblem[] }">
                <v-list lines="one" density="compact">
                  <template v-for="item in data">
                    <v-list-item @click="() => handleClick(item)">
                      <v-list-item-title>{{ item.title }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ item._id }}
                      </v-list-item-subtitle>
                    </v-list-item>
                    <v-divider />
                  </template>
                </v-list>
              </template>
            </Datagrid>
          </v-card-text>
        </v-window-item>
        <v-window-item>
          <v-card-text>
            <v-list-item v-if="selectedProblem" class="mb-3">
              <v-list-item-title>
                {{ selectedProblem.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ selectedProblem._id }}
              </v-list-item-subtitle>
            </v-list-item>
            <v-text-field
              label="Display ID for the contest problem"
              hide-details
              v-model="displayId"
            />
          </v-card-text>
        </v-window-item>
      </v-window>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="handleBack" v-if="progress"> Back </v-btn>
        <v-btn variant="text" @click="dialog = false"> Close </v-btn>
        <v-btn
          variant="elevated"
          color="primary"
          @click="handleAdd"
          v-if="progress"
        >
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, watch } from "vue";
import { fetchApi } from "../../utils/api";
import Datagrid from "../Datagrid.vue";
import Message from "vue-m-message";
import { emit } from "process";

const props = withDefaults(
  defineProps<{
    class: string;
  }>(),
  { class: "" }
);

const emits = defineEmits(["handleAdded"]);

const dialog = ref(false);
const contest = inject<ManagementContest>("contest", {
  id: -1,
  created_by: {
    id: -1,
    username: "",
    real_name: null,
  },
  status: "",
  contest_type: "",
  title: "",
  description: "",
  real_time_rank: true,
  rule_type: "OI",
  start_time: "",
  end_time: "",
  create_time: "",
  last_update_time: "",
  password: "",
  visible: true,
  allowed_ip_ranges: [],
});
const problems = ref<ManagementProblem[]>([]);
const selectedProblem = ref<ManagementProblem | null>(null);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const keyword = ref("");
const displayId = ref("");

const progress = computed(() => (selectedProblem.value ? 1 : 0));
const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  loading.value = true;
  const response = await fetchApi(`/admin/problem`, "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
      rule_type: contest.rule_type,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    problems.value = response.data.data.results;
    total.value = response.data.data.total;
  }
};

const handleClick = (problem: ManagementProblem) => {
  selectedProblem.value = problem;
};

const handleBack = () => {
  selectedProblem.value = null;
};

const handleAdd = async () => {
  loading.value = true;
  const response = await fetchApi(
    "/admin/contest/add_problem_from_public",
    "post",
    {
      data: {
        contest_id: contest.id,
        problem_id: selectedProblem.value!.id,
        display_id: displayId.value,
      },
    }
  );
  loading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  } else {
    Message.success("Success");
    dialog.value = false;
    emits("handleAdded")
  }
};

watch(page, () => init());
watch(limit, () => init());
watch(dialog, (val) => {
  if (!val) return;
  selectedProblem.value = null;
  problems.value = [];
  page.value = 1;
  limit.value = 10;
  init();
});
</script>
