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
    <v-card class="position-relative my-4">
      <MonacoEditor v-model="status.code" :lang="status.language" readOnly :height="500"/>
      <v-btn
        icon="mdi-clipboard-text"
        class="me-1 text-disabled me-1 mt-1"
        style="position: absolute; right: 0; top: 0"
        variant="text"
        @click="copy(status?.code as string)"
      />
    </v-card>
    <div class="d-flex justify-end">
      <v-btn
        color="info"
        :disabled="loading"
        :loading="loading"
        @click="handleShare"
      >
        {{ shareBtn }}
      </v-btn>
    </div>
  </div>
  <Loader v-else />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { fetchApi } from "../utils/api";
import statusList from "../utils/status";
import Loader from "../components/Loader.vue";
import Message from "vue-m-message";
import MonacoEditor from "../components/MonacoEditor.vue";

const routes = useRoute();
const status = ref<Status | null>(null);
const loading = ref(false);
const statusId = routes.params.id;

const shareBtn = computed(() => (status.value?.shared ? "Unshare" : "Share"));

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

const handleShare = async () => {
  loading.value = true;
  const response = await fetchApi("/submission", "put", {
    data: {
      id: statusId,
      shared: !status.value!.shared,
    },
  });
  loading.value = false;
  init();
};

const copy = (text: string) => {
  Message.success("Code copied!");
  navigator.clipboard.writeText(text);
};

const statusListDetail = computed(() => {
  if (status.value) return statusList[status.value.result];
  return statusList[0];
});

onMounted(() => init());
</script>