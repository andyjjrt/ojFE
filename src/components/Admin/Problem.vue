<template>
  <v-card class="pa-4" :loading="loading" :disabled="loading">
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
          <MDEditor height="400px" v-model="description" />
        </v-col>
        <v-col cols="12">
          <h4 class="mb-2">Input Description</h4>
          <MDEditor height="400px" v-model="inputDescription" />
        </v-col>
        <v-col cols="12">
          <h4 class="mb-2">Output Description</h4>
          <MDEditor height="400px" v-model="outputDescription" />
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
          <v-switch
            hide-details
            v-model="problem.share_submission"
            label="Share"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-autocomplete
            chips
            v-model="problem.tags"
            label="Tags"
            :items="tags.map((t) => t.name)"
            multiple
            hide-details
            v-model:search="newTag"
            :loading="tagLoading"
          >
            <template v-slot:no-data>
              <v-list-item @click="handleCreateTag">
                <v-list-item-title>Create "{{ newTag }}"</v-list-item-title>
              </v-list-item>
            </template>
          </v-autocomplete>
        </v-col>
        <v-col cols="12" v-for="(sample, i) in problem.samples">
          <v-sheet border class="pa-4 rounded">
            <div class="d-flex justify-space-between align-center mb-4">
              <h4>Sample {{ i + 1 }}</h4>
              <v-btn
                size="small"
                color="warning"
                @click="() => handleDeleteSample(i)"
              >
                <v-icon icon="mdi-trash-can-outline" />
              </v-btn>
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
          <v-btn block color="primary" @click="handleCreateSample">
            Add sample
          </v-btn>
        </v-col>
        <v-col cols="12">
          <h4 class="mb-2">Hint</h4>
          <MDEditor height="400px" v-model="hint" />
        </v-col>
        <v-col cols="12">
          <h4 class="mb-3">Template</h4>
          <v-expansion-panels
            variant="accordion"
            v-model="templateLanguages"
            multiple
          >
            <v-expansion-panel
              v-for="language in problem.languages"
              :key="language"
              :value="language"
            >
              <v-expansion-panel-title>
                <span>{{ language }}</span>
                <template v-slot:actions="{ expanded }">
                  <v-icon
                    :color="!expanded ? '' : 'success'"
                    :icon="expanded ? 'mdi-check-underline-circle' : ''"
                  ></v-icon>
                </template>
              </v-expansion-panel-title>
              <v-expansion-panel-text eager>
                <MonacoEditor
                  :lang="language"
                  v-model="problem.template[language]"
                  v-if="problem.template[language]"
                />
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
        <v-col cols="12">
          <h4 class="mb-3">
            Special Judge
            {{ oldSpjCode === problem.spj_code && problem.spj_compile_ok }}
          </h4>
          <div class="d-flex align-center">
            <v-select
              :model-value="problem.spj_language"
              @update:model-value="handleOpenComfirmModel"
              :items="[
                null,
                ...(constant.languages
                  ?.filter((l) => l.spj)
                  .map((l) => l.name) || []),
              ]"
              label="Languages"
              density="comfortable"
              hide-details
            >
              <template v-slot:selection="{ item, index }">
                {{ item.title || "None" }}
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="item.title || 'None'"
                ></v-list-item>
              </template>
            </v-select>
            <v-btn
              color="primary"
              class="ml-2"
              @click="handleCompileSpj"
              :loading="spjLoading"
            >
              <v-icon icon="mdi-powershell" />
            </v-btn>
          </div>

          <div class="my-3">
            <MonacoEditor
              :lang="problem.spj_language"
              v-model="problem.spj_code!"
              v-if="problem.spj_language"
            />
          </div>
          <v-alert type="error" variant="tonal" v-if="spjError !== ''">
            <v-code class="overflow-auto mt-2">
              <pre><code>{{ spjError }}</code></pre>
            </v-code>
          </v-alert>
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
            <div class="d-flex">
              <Downloader
                v-if="problem.test_case_id !== ''"
                :link="`/admin/test_case?problem_id=${problem.test_case_id}`"
                :title="`${problem.id}_${problem.title}_testcase`"
              >
                <template v-slot="{ handleDownload, loading }">
                  <v-btn
                    color="primary"
                    class="mx-2"
                    :loading="loading"
                    :disabled="loading"
                    @click="handleDownload"
                  >
                    <v-icon icon="mdi-download" />
                  </v-btn>
                </template>
              </Downloader>
              <v-btn
                color="primary"
                tag="label"
                :loading="uploadLoading"
                :disabled="uploadLoading"
              >
                <input
                  type="file"
                  class="d-none"
                  @change="handleUploadTestcase"
                />
                <v-icon icon="mdi-upload" />
              </v-btn>
            </div>
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
      <v-btn
        color="primary"
        variant="elevated"
        class="mx-1"
        :loading="loading"
        @click="handleSave"
      >
        save
      </v-btn>
    </v-card-actions>
    <v-dialog v-model="comfirmModel" width="auto">
      <v-card
        max-width="400"
        prepend-icon="mdi-update"
        text="Your application will relaunch automatically after the update is complete."
        title="Update in progress"
      >
        <template v-slot:actions>
          <v-btn
            class="ms-auto"
            text="Cancel"
            @click="comfirmModel = false"
          ></v-btn>
          <v-btn
            text="Ok"
            @click="handleChangeSpjLanguage"
          ></v-btn>
        </template>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { reactive, ref, onMounted, computed, watch } from "vue";
import { useConstantsStore } from "../../store/constants";
import { fetchApi } from "../../utils/api";
import MonacoEditor from "../MonacoEditor.vue";
import MDEditor from "../MDEditor.vue";
import Downloader from "./Downloader.vue";
import Message from "vue-m-message";
import router from "../../router";

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
const problemInit = ref(false);

const tagLoading = ref(false);
const spjLoading = ref(false);
const spjError = ref("");
const oldSpjCode = ref("");
const newTag = ref("");
const templateLanguages = ref<string[]>([]);
const comfirmModel = ref(false);
const tmpSpjLanguage = ref("");

const init = async () => {
  if (!props.create) {
    problemInit.value = false;
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
  templateLanguages.value = problem.languages.filter(
    (language) => problem.template[language]
  );
  constant.languages!.map((language) => {
    if (!problem.template[language.name])
      problem.template[language.name] = language.config.template;
    defaultTemplate.value[language.name] = language;
  });
  oldSpjCode.value = problem.spj_code || "";
  loading.value = false;
  problemInit.value = true;
};

const handleSave = async () => {
  loading.value = true;
  Object.keys(problem.template).map((key) => {
    if (templateLanguages.value.indexOf(key) < 0) delete problem.template[key];
  });
  const response = await fetchApi(
    `/admin${props.contestId ? "/contest" : ""}/problem`,
    props.create ? "post" : "put",
    {
      data: {
        ...problem,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
    return;
  }
  Message.success("Success");
  if (props.create) {
    router.push({
      name: props.contestId ? "AdminContestProblems" : "AdminProblems",
      params: {
        contestId: props.contestId,
      },
    });
  } else {
    init();
  }
};

const handleCompileSpj = () => {
  spjLoading.value = true;
  spjError.value = "";
  fetchApi("/admin/compile_spj", "post", {
    data: {
      id: problem.id,
      spj_code: problem.spj_code,
      spj_language: problem.spj_language,
    },
  })
    .then((res) => {
      spjLoading.value = false;
      if (res.data.error) throw new Error(res.data.data);
      problem.spj_compile_ok = true;
      Message.success("Success");
    })
    .catch((err) => {
      problem.spj_compile_ok = false;
      spjError.value = err.message;
    });
};

const handleOpenComfirmModel = (val: string) => {
  if (problem.test_case_id !== "") {
    comfirmModel.value = true;
    tmpSpjLanguage.value = val;
  } else {
    problem.spj_language = val;
  }
};

const handleChangeSpjLanguage = () => {
  problem.spj_language = tmpSpjLanguage.value;
  comfirmModel.value = false;
  problem.spj = false;
  problem.test_case_id = "";
  problem.test_case_score = [];
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
    Message.error(response.data.data);
  } else {
    problem.test_case_id = response.data.data.id;
    problem.test_case_score = response.data.data.info.map((item: any) => ({
      input_name: item.input_name,
      output_name: item.output_name,
      score: (100 / response.data.data.info.length).toFixed(0),
    }));
    problem.spj = response.data.data.spj;
    Message.success(response.data.data.id);
  }
  (e.target as HTMLInputElement)!.value = "";
};

const handleCreateTag = () => {
  if (newTag.value === "") return;
  tags.value.push({ id: new Date().getTime(), name: newTag.value });
  problem.tags.push(newTag.value);
  newTag.value = "";
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
