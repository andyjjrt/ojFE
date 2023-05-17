<template>
  <v-row>
    <v-col md="9">
      <v-card class="pa-2">
        <v-card-title class="d-flex justify-space-between align-center">
          <p class="font-weight-bold text-h5">
            {{ title }}
          </p>
          <div class="d-flex align-center">
            <v-btn
              :to="getAdminLocation"
              variant="elevated"
              size="small"
              color="primary"
              class="me-2"
              v-if="user.isAdmin"
            >
              <v-icon icon="mdi-file-edit" />
            </v-btn>
            <v-icon
              icon="mdi-check-circle"
              color="success"
              v-if="getProblemStatus === 1"
            />
            <v-icon
              icon="mdi-close-circle"
              color="error"
              v-else-if="getProblemStatus === -1"
            />
          </div>
        </v-card-title>

        <v-divider />
        <div class="pa-4">
          <h5 class="text-h5 mb-2">{{ t("problem.description") }}</h5>
          <v-md-preview :text="description" />
        </div>
        <div class="pa-4">
          <h5 class="text-h5 mb-2">{{ t("problem.input") }}</h5>
          <v-md-preview :text="input" />
        </div>
        <div class="pa-4">
          <h5 class="text-h5 mb-2">{{ t("problem.output") }}</h5>
          <v-md-preview :text="output" />
        </div>
        <v-row class="pa-4">
          <template v-for="(sample, index) in samples" :key="index">
            <v-col cols="12" sm="6" class="d-flex flex-column">
              <h5 class="text-h5 mb-2">
                {{ t("problem.sampleInput") }} {{ index + 1 }}
              </h5>
              <div class="position-relative flex-grow-1">
                <v-code tag="pre" class="pa-2 overflow-auto h-100">
                  {{ sample.input }}
                </v-code>
                <v-btn
                  icon="mdi-clipboard-text"
                  class="me-1 text-disabled me-2 mt-2"
                  density="compact"
                  style="position: absolute; right: 0; top: 0"
                  variant="text"
                  @click="copy(sample.input)"
                />
              </div>
            </v-col>
            <v-col cols="12" sm="6" class="d-flex flex-column">
              <h5 class="text-h5 mb-2">
                {{ t("problem.sampleOutput") }} {{ index + 1 }}
              </h5>
              <div class="position-relative flex-grow-1">
                <v-code tag="pre" class="pa-2 overflow-auto h-100">
                  {{ sample.output }}
                </v-code>
                <v-btn
                  icon="mdi-clipboard-text"
                  class="me-1 text-disabled me-2 mt-2"
                  density="compact"
                  style="position: absolute; right: 0; top: 0"
                  variant="text"
                  @click="copy(sample.output)"
                />
              </div>
            </v-col>
          </template>
        </v-row>
        <div class="pa-4" v-if="hint">
          <h5 class="text-h5 mb-2">{{ t("problem.hint") }}</h5>
          <v-md-preview :text="hint" />
        </div>
        <div class="pa-4 d-flex flex-column">
          <div class="mb-3 d-flex">
            <v-select
              :label="t('problem.language')"
              :items="languages"
              variant="solo"
              density="compact"
              v-model="selectedLanguage"
              hide-details
            />
          </div>
          <div class="position-relative">
            <v-progress-linear indeterminate absolute :active="loading" />
            <CodeMirror v-model="code" :lang="selectedLanguage" />
          </div>

          <div class="mt-3 d-flex justify-space-between">
            <div>
              <v-btn
                v-if="status"
                :color="status.type"
                :to="`/status/${status.id}`"
              >
                {{ status.name }}
              </v-btn>
            </div>
            <v-btn color="primary" @click="submit" :loading="loading">
              {{ t("problem.submit") }}
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col md="3" v-if="mdAndUp">
      <v-btn
        block
        class="mb-5"
        :to="getSubmissionLocation(problem._id)"
        prepend-icon="mdi-format-list-bulleted"
      >
        {{ t("problem.submissions") }}
      </v-btn>
      <v-card class="py-1 px-2 mb-5">
        <v-list lines="one" density="compact">
          <v-list-item :title="problem._id">
            <template v-slot:prepend>
              <v-icon icon="mdi-identifier" />
            </template>
          </v-list-item>
          <v-list-item :title="problem.time_limit + ' ms'">
            <template v-slot:prepend>
              <v-icon icon="mdi-timer" />
            </template>
          </v-list-item>
          <v-list-item :title="problem.memory_limit + ' MB'">
            <template v-slot:prepend>
              <v-icon icon="mdi-memory" />
            </template>
          </v-list-item>
          <v-list-item :title="problem.io_mode.io_mode">
            <template v-slot:prepend>
              <v-icon icon="mdi-xml" />
            </template>
          </v-list-item>
          <v-list-item :title="problem.created_by.username">
            <template v-slot:prepend>
              <v-icon icon="mdi-shield-crown" />
            </template>
          </v-list-item>
          <v-list-item>
            <DifficultyLabel :difficulty="problem.difficulty" />
            <template v-slot:prepend>
              <v-icon icon="mdi-gavel" />
            </template>
          </v-list-item>
          <v-list-item>
            <v-chip
              class="ma-1 me-2"
              size="small"
              label
              color="primary"
              v-for="tag in problem.tags"
            >
              {{ tag }}
            </v-chip>
            <template v-slot:prepend>
              <v-icon icon="mdi-tag-multiple" />
            </template>
          </v-list-item>
        </v-list>
      </v-card>
      <v-card class="pa-4" v-if="problem.submission_number > 0">
        <PieChart :chartData="getProblemChart" />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { useDisplay, useTheme } from "vuetify";
import CodeMirror from "../components/CodeMirror.vue";
import PieChart from "./PieChart.vue";
import DifficultyLabel from "./DifficultyLabel.vue";
import { fetchApi } from "../utils/api";
import statusList from "../utils/status";
import Message from "vue-m-message";
import { useConstantsStore } from "../store/constants";
import { useUserStore } from "../store/user";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  problem: Problem;
}>();

const { mdAndUp } = useDisplay();
const theme = useTheme();
const routes = useRoute();
const constants = useConstantsStore();
const user = useUserStore();
const { t } = useI18n();

const title = computed(() => props.problem?.title);
const description = computed(() => decodeURI(props.problem.description));
const input = computed(() => decodeURI(props.problem.input_description));
const output = computed(() => decodeURI(props.problem.output_description));
const samples = computed(() => props.problem.samples);
const hint = computed(() => decodeURI(props.problem.hint));
const languages = computed(() => props.problem.languages);
const templates = computed(() => props.problem.template);

const loading = ref(false);
const selectedLanguage = ref(languages.value[0]);
const code = ref("");
const problemkey = ref(
  `problemCode_${routes.params.contestid || "NaN"}_${routes.params.problemId}`
);

const timer = ref<number>(-1);
const status = ref<{
  name: string;
  short: string;
  type: "info" | "error" | "success" | "warning" | undefined;
  id: string;
} | null>(null);

const copy = (text: string) => {
  Message.success("Code copied!");
  navigator.clipboard.writeText(text);
};

const resetTemplate = (language: string) => {
  if (Object.hasOwn(templates.value, language))
    code.value = templates.value[language];
};

const submit = async () => {
  status.value = null;
  loading.value = true;
  const response = await fetchApi("/submission", "post", {
    data: {
      code: code.value,
      language: selectedLanguage.value,
      problem_id: props.problem.id,
      contest_id: props.problem.contest || undefined,
    },
  });
  if (response.data.error) {
    Message.error(response.data.data);
    console.log(response.data.data);
    loading.value = false;
    return;
  }
  timer.value = window.setInterval(async () => {
    const res = await fetchApi("/submission", "get", {
      params: {
        id: response.data.data.submission_id,
      },
    });
    if (
      (res.data.data.result != 7 && res.data.data.result != 9) ||
      res.data.error
    ) {
      loading.value = false;
      window.clearInterval(timer.value);
      if (res.data.error) {
        console.log(res.data.data);
        Message.error(response.data.data);
      } else {
        status.value = {
          ...statusList[res.data.data.result],
          id: res.data.data.id,
        };
      }
    }
  }, 1000);
};

const getSubmissionLocation = computed(() => {
  return (id: string) => {
    let params: any = {};
    if (props.problem.contest) params.contestId = props.problem.contest;
    return {
      name: props.problem.contest ? "ContestSubmissions" : "Submissions",
      params,
      query: {
        problem_id: id,
      },
    };
  };
});

const getAdminLocation = computed(() => {
  return {
    name: props.problem.contest ? "AdminContestProblem" : "AdminProblem",
    params: {
      problemId: props.problem.id,
      contestId: props.problem.contest,
    },
  };
});

const getProblemStatus = computed(() => {
  if (
    props.problem.my_status !== null &&
    props.problem.my_status !== undefined
  ) {
    return props.problem.my_status ? -1 : 1;
  } else {
    return 0;
  }
});

const getProblemChart = computed(() => {
  return {
    labels: Object.keys(props.problem.statistic_info).map(
      (key) => statusList[key].name
    ),
    datasets: [
      {
        backgroundColor: Object.keys(props.problem.statistic_info).map(
          (key) => theme.current.value.colors[statusList[key].type || ""]
        ),
        data: Object.values(props.problem.statistic_info),
      },
    ],
  };
});

onMounted(() => {
  document.title = `${constants.website!.website_name_shortcut} | ${
    props.problem.title
  }`;
  const history = localStorage.getItem(problemkey.value);
  console.log(history);
  if (history) {
    code.value = JSON.parse(history).code;
    selectedLanguage.value = JSON.parse(history).language;
  }
});

onBeforeUnmount(() => {
  const history = JSON.stringify({
    code: code.value,
    language: selectedLanguage.value,
  });
  localStorage.setItem(problemkey.value, history);
});

watch(selectedLanguage, (newVal) => {
  resetTemplate(newVal);
});
</script>
