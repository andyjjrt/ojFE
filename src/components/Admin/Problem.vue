<template>
  <div>
    <Loader v-if="loading" />
    <v-card class="pa-4" v-else>
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field hide-details v-model="problem._id" label="Display ID" />
          </v-col>
          <v-col cols="12" sm="8">
            <v-text-field hide-details v-model="problem.title" label="Title" />
          </v-col>
          <v-col cols="12">
            <h4 class="mb-2">Description</h4>
            <v-md-editor height="400px" v-model="description" />
          </v-col>
          <v-col cols="12">
            <h4 class="mb-2">Input Description</h4>
            <v-md-editor height="400px" v-model="inputDescription" />
          </v-col>
          <v-col cols="12">
            <h4 class="mb-2">Output Description</h4>
            <v-md-editor height="400px" v-model="outputDescription" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              hide-details
              v-model="problem.time_limit"
              label="Time limit(ms)"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              hide-details
              v-model="problem.memory_limit"
              label="Memory limit(MB)"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              hide-details
              v-model="problem.difficulty"
              :items="['Low', 'Mid', 'High']"
              label="difficulty"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              chips
              v-model="problem.languages"
              :items="constant.languages?.map((l) => l.name)"
              label="Languages"
              multiple
              hide-details
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-switch hide-details v-model="problem.visible" label="Visible" />
          </v-col>
          <v-col cols="12" sm="4">
            <v-switch hide-details v-model="problem.share_submission" label="Share" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              chips
              v-model="problem.tags"
              label="Tags"
              :items="tags.map((t) => t.name)"
              multiple
              hide-details
            />
          </v-col>
          <v-col cols="12" v-for="(sample, i) in problem.samples">
            <v-sheet border class="pa-4 rounded">
              <div class="d-flex justify-space-between align-center mb-4">
                <h4>Sample {{ i + 1 }}</h4>
                <v-btn size="small" color="warning" @click="() => handleDeleteSample(i)"
                  >delete</v-btn
                >
              </div>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-textarea
                    v-model="sample.input"
                    :label="'Input' + (i + 1)"
                    class="codearea"
                    variant="outlined"
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="6">
                  <v-textarea
                    v-model="sample.output"
                    :label="'Output' + (i + 1)"
                    class="codearea"
                    variant="outlined"
                    hide-details
                  />
                </v-col>
              </v-row>
            </v-sheet>
          </v-col>
          <v-col cols="12">
            <v-btn block color="primary" @click="handleCreateSample">Add sample</v-btn>
          </v-col>
          <v-col cols="12">
            <h4 class="mb-2">Hint</h4>
            <v-md-editor height="400px" v-model="hint" />
          </v-col>
          <v-col cols="12">
            <h4 class="mb-3">Template</h4>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel v-for="language in problem.languages" :key="language">
                <v-expansion-panel-title>
                  <span>{{ language }}</span>
                  <v-icon
                    icon="mdi-check-underline-circle"
                    class="mx-2"
                    color="success"
                    v-if="
                      problem.template[language] !==
                      defaultTemplate[language].config.template
                    "
                  />
                </v-expansion-panel-title>
                <v-expansion-panel-text eager>
                  <CodeMirror :lang="language" v-model="problem.template[language]" />
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              :items="['ACM', 'OI']"
              hide-details
              label="Rule Type"
              v-model="problem.rule_type"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-select
              :items="['Standard IO', 'File IO']"
              hide-details
              label="IO Mode"
              v-model="problem.io_mode.io_mode"
            />
          </v-col>
          <template v-if="problem.io_mode.io_mode === 'File IO'">
            <v-col cols="12" sm="6">
              <v-text-field
                hide-details
                label="Input File"
                v-model="problem.io_mode.input"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                hide-details
                label="Output File"
                v-model="problem.io_mode.output"
              />
            </v-col>
          </template>
          <v-col cols="12">
            <div class="d-flex justify-space-between align-center mb-3">
              <h4>Test Case</h4>
              <v-btn
                color="primary"
                tag="label"
                :loading="uploadLoading"
                :disabled="uploadLoading"
              >
                <input type="file" class="d-none" @change="handleUploadTestcase" />
                Upload
              </v-btn>
            </div>
            <v-table class="position-relative">
              <v-overlay
                contained
                persistent
                class="align-center justify-center"
                :modelValue="uploadLoading"
              >
                <v-progress-circular indeterminate color="primary" />
              </v-overlay>
              <thead>
                <tr>
                  <th class="text-left">Input</th>
                  <th class="text-left">Output</th>
                  <th class="text-left">Score</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in problem.test_case_score">
                  <td>{{ item.input_name }}</td>
                  <td>{{ item.output_name }}</td>
                  <td>
                    <v-text-field
                      hide-details="auto"
                      density="compact"
                      variant="outlined"
                      v-model="item.score"
                    />
                  </td>
                </tr>
                <tr v-if="problem.test_case_score.length > 0">
                  <td colspan="3" class="pt-2">
                    <v-alert
                      :type="totalScore > 100 ? 'error' : 'success'"
                      :title="'Total Score: ' + totalScore"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="d-flex justify-end gutter">
        <v-btn color="primary" variant="elevated" class="mx-1" @click="handleSave"
          >save</v-btn
        >
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { reactive, ref, onMounted, computed } from "vue";
import { useConstantsStore } from "../../store/constants";
import { fetchApi } from "../../utils/api";
import CodeMirror from "../CodeMirror.vue";
import Loader from "../Loader.vue";

const routes = useRoute();
const constant = useConstantsStore();

const props = defineProps<{
  contestId?: string;
  create?: boolean;
}>();

const problemId = routes.params.problemId;

const loading = ref(false);
const uploadLoading = ref(false);
const defaultTemplate = ref<{ [key: string]: Language }>({});
const tags = ref<Tag[]>([]);
const problem = reactive<ManagementProblem>({
  id: 0,
  tags: [],
  created_by: {
    id: 0,
    username: "",
    real_name: null,
  },
  template: {},
  _id: "",
  title: "",
  description: "",
  input_description: "",
  output_description: "",
  samples: [
    {
      input: "",
      output: "",
    },
  ],
  hint: "",
  languages: [],
  create_time: "",
  last_update_time: null,
  time_limit: 1000,
  memory_limit: 256,
  io_mode: {
    input: "input.txt",
    output: "output.txt",
    io_mode: "Standard IO",
  },
  spj: false,
  spj_language: null,
  rule_type: "OI",
  difficulty: "Low",
  source: "",
  total_score: 0,
  submission_number: 0,
  accepted_number: 0,
  statistic_info: {},
  share_submission: false,
  contest: null,
  my_status: null,
  is_public: false,
  test_case_id: "",
  test_case_score: [],
  spj_code: null,
  spj_version: null,
  spj_compile_ok: false,
  visible: false,
});

const init = async () => {
  constant.languages!.map((language) => {
    if (!problem.template[language.name])
      problem.template[language.name] = language.config.template;
    defaultTemplate.value[language.name] = language;
  });
  if (!props.create) {
    loading.value = true;
    const response = await fetchApi(
      `/admin${props.contestId ? "/contest" : ""}/problem`,
      "get",
      {
        params: {
          id: problemId,
        },
      }
    );
    loading.value = false;
    if (response.data.error) {
    } else {
      Object.assign(problem, response.data.data);
    }
  }
  loading.value = true;
  const tagResponse = await fetchApi("/problem/tags", "get");
  tags.value = tagResponse.data.data;
  loading.value = false;
};

const handleSave = async () => {
  loading.value = true;
  Object.keys(problem.template).map((key) => {
    if (problem.template[key] === defaultTemplate.value[key].config.template)
      delete problem.template[key];
  });
  const response = await fetchApi(
    `/admin${props.contestId ? "/contest" : ""}/problem`,
    "put",
    {
      data: {
        ...problem,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  if (response.data.error) {
  }
  init();
};

const handleDeleteSample = (index: number) => {
  problem.samples = problem.samples.filter((_, i) => i !== index);
};

const handleCreateSample = () => {
  problem.samples = [...problem.samples, { input: "", output: "" }];
};

const handleUploadTestcase = async (e: Event) => {
  let formData = new FormData();
  formData.append("file", (e.target as HTMLInputElement)!.files![0]);
  formData.append("spj", problem.spj ? "true" : "false");
  uploadLoading.value = true;
  const response = await fetchApi("/admin/test_case", "post", {
    data: formData,
  });
  uploadLoading.value = false;
  if (response.data.error) {
    problem.test_case_id = "";
    problem.test_case_score = [];
    problem.spj = false;
  } else {
    problem.test_case_id = response.data.data.id;
    problem.test_case_score = response.data.data.info.map((item: any) => ({
      input_name: item.input_name,
      output_name: item.output_name,
      score: (100 / response.data.data.info.length).toFixed(0),
    }));
    problem.spj = response.data.data.spj;
  }
  (e.target as HTMLInputElement)!.value = "";
};

const description = computed({
  get: () => decodeURI(problem.description),
  set: (val) => {
    problem.description = encodeURI(val);
  },
});

const inputDescription = computed({
  get: () => decodeURI(problem.input_description),
  set: (val) => {
    problem.input_description = encodeURI(val);
  },
});

const outputDescription = computed({
  get: () => decodeURI(problem.output_description),
  set: (val) => {
    problem.output_description = encodeURI(val);
  },
});

const hint = computed({
  get: () => decodeURI(problem.hint),
  set: (val) => {
    problem.hint = encodeURI(val);
  },
});

const totalScore = computed(() => {
  return problem.test_case_score.reduce((prev, curr) => {
    return prev + parseInt(curr.score.toString());
  }, 0);
});

onMounted(() => init());
</script>

<style scoped>
.codearea {
  font-family: monospace, monospace;
}
</style>
