<template>
  <v-row>
    <v-col md="9">
      <v-card class="pa-2">
        <v-card-title class="font-weight-bold text-h5">{{
          title
        }}</v-card-title>
        <v-divider />
        <div class="pa-4">
          <h5 class="text-h5 mb-2">Description</h5>
          <v-md-preview v-katex :text="description" />
        </div>
        <div class="pa-4">
          <h5 class="text-h5 mb-2">Input</h5>
          <v-md-preview v-katex :text="input" />
        </div>
        <div class="pa-4">
          <h5 class="text-h5 mb-2">Output</h5>
          <v-md-preview v-katex :text="output" />
        </div>
        <v-row class="pa-4">
          <template v-for="(sample, index) in samples" :key="index">
            <v-col cols="12" sm="6" class="d-flex flex-column">
              <h5 class="text-h5 mb-2">Sample Input {{ index + 1 }}</h5>
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
              <h5 class="text-h5 mb-2">Output Input {{ index + 1 }}</h5>
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
          <h5 class="text-h5 mb-2">Hint</h5>
          <v-md-preview v-katex :text="hint" />
        </div>
        <div class="pa-4 d-flex flex-column">
          <div class="mb-3 d-flex">
            <v-select
              label="Language"
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
                >{{ status.name }}</v-btn
              >
            </div>
            <v-btn @click="submit" :loading="loading">Submit</v-btn>
          </div>
        </div>
      </v-card>
    </v-col>
    <v-col md="3" v-if="mdAndUp">
      <v-card class="py-1 px-2 mb-6">
        <v-list lines="one"  density="compact">
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
      <v-card class="pa-4">
        <PieChart />
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import CodeMirror from "../components/CodeMirror.vue";
import PieChart from "./PieChart.vue";
import DifficultyLabel from "./DifficultyLabel.vue";
import vKatex from "../plugins/vKatex";
import { fetchApi } from "../utils/api";
import statusList from "../utils/status";
import Message from "vue-m-message";

const props = defineProps<{
  problem: Problem;
}>();

const { mdAndUp } = useDisplay();

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

const timer = ref<number>(-1);
const status = ref<{
  name: string;
  short: string;
  type: string;
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

watch(selectedLanguage, (newVal) => {
  resetTemplate(newVal);
});
</script>
~
