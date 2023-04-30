<template>
  <div v-if="status">
    <v-alert :type="statusListDetail.type" variant="tonal">
      <v-alert-title>
        <div class="d-flex justify-space-between w-100">
          <h4>{{ statusListDetail.name }}</h4>
          <h6>{{ status.username }}</h6>
        </div>
      </v-alert-title>
      <div
        v-if="
          Object.hasOwn(status.statistic_info, 'time_cost') &&
          Object.hasOwn(status.statistic_info, 'memory_cost')
        "
        class="mt-2 d-flex align-center"
      >
        <v-icon icon="mdi-timer" class="me-2" />
        {{ status.statistic_info.time_cost }}ms
        <v-icon icon="mdi-memory" class="mx-2" />
        {{ Math.round(status.statistic_info.memory_cost! / (1024 * 1024)) }}MB
        <v-icon icon="mdi-xml" class="mx-2" />{{ status.language }}
      </div>
      <v-code v-if="status.statistic_info.err_info" class="overflow-auto mt-2">
        <pre><code>{{ status.statistic_info.err_info }}</code></pre>
      </v-code>
    </v-alert>
    <v-card class="mt-4 rounded" v-if="status.info?.data">
      <v-list lines="one">
        <v-list-item
          v-for="(record, index) in status.info.data"
          :key="record.output_md5"
        >
          <template v-slot:prepend>
            {{ index + 1 }}
          </template>
          <v-list-item-title>
            <v-row>
              <v-col cols="6" md="3">
                <v-chip
                  size="small"
                  class="mx-2"
                  label
                  :color="statusList[record.result].type"
                >
                  {{ statusList[record.result].name }}
                </v-chip>
              </v-col>
              <v-col cols="4" class="d-none d-md-flex">
                {{ Math.round(record.memory / (1024 * 1024)) }}MB
              </v-col>
              <v-col cols="4" class="d-none d-md-flex">
                {{ record.real_time }}ms
              </v-col>
              <v-col cols="6" md="1" class="text-end">{{ record.score }}</v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
    <v-sheet rounded="xl" class="position-relative mt-4">
      <pre class="language-clang"><code v-html="html" /></pre>
      <v-btn
        icon="mdi-clipboard-text"
        class="me-1 text-disabled me-2 mt-2"
        density="compact"
        style="position: absolute; right: 0; top: 0"
        variant="text"
        @click="copy(status?.code as string)"
      />
    </v-sheet>
  </div>
  <Loader v-else />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { fetchApi } from "../utils/api";
import statusList from "../utils/status";
import Loader from "../components/Loader.vue";
import Prism from "prismjs";
import Message from "vue-m-message";

const routes = useRoute();
const status = ref<Status | null>(null);
const loading = ref(false);
const statusId = routes.params.id;

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/submission", "get", {
    params: {
      id: statusId,
    },
  });
  loading.value = false;
  status.value = response.data.data;
};

const copy = (text: string) => {
  Message.success("Code copied!");
  navigator.clipboard.writeText(text);
};

const statusListDetail = computed(() => {
  if (status.value) return statusList[status.value.result];
  return statusList[0];
});

const html = computed(() =>
  Prism.highlight(status.value?.code || "", Prism.languages.clike, "clike")
);

onMounted(() => init());
console.log(Prism.languages);
</script>

<style>
@import "prism-theme-vars/base.css";

.v-theme--light {
  --prism-foreground: #393a34;
  --prism-background: #f8f8f8;

  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #bc8671;
  --prism-punctuation: #80817d;
  --prism-literal: #36acaa;
  --prism-keyword: #248459;
  --prism-function: #849145;
  --prism-deleted: #9a050f;
  --prism-class: #2b91af;
  --prism-builtin: #800000;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}

.v-theme--dark {
  --prism-foreground: #d4d4d4;
  --prism-background: #1e1e1e;

  --prism-namespace: #aaaaaa;
  --prism-comment: #758575;
  --prism-namespace: #444444;
  --prism-string: #ce9178;
  --prism-punctuation: #d4d4d4;
  --prism-literal: #36acaa;
  --prism-keyword: #38a776;
  --prism-function: #dcdcaa;
  --prism-deleted: #9a050f;
  --prism-class: #4ec9b0;
  --prism-builtin: #d16969;
  --prism-property: #ce9178;
  --prism-regex: #ad502b;
}
</style>
