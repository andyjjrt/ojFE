<template>
  <v-card class="pa-4" :loading="loading" :disabled="loading">
    <div class="my-2">
      <v-card-title class="mb-2">Judge Server Token</v-card-title>
      <v-card-text>
        <v-code>{{ judgeServerStatus.token }}</v-code>
      </v-card-text>
      
    </div>
    <div class="my-2">
      <v-card-title  class="mb-2">Judge Server</v-card-title>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="server in judgeServerStatus.servers"
          :key="server.id"
        >
          <template v-slot:title>
            <v-chip
              label
              :color="server.status === 'normal' ? 'success' : 'error'"
            >
              {{ server.status }}
            </v-chip>
            <span class="mx-2">{{ server.hostname }}@{{ server.ip }}</span>
          </template>
          <template v-slot:text>
            <div class="d-flex">
              <v-btn
                color="error"
                variant="elevated"
                @click="() => handleDelete(server.hostname)"
              >
                delete
              </v-btn>
              <div class="d-flex-inline ms-2">
                <v-switch
                  color="primary"
                  hide-details
                  density="compact"
                  label="disabled"
                  v-model="server.is_disabled"
                  @click.native.stop
                  @update:modelValue="
                    () => handleDisabled(server.id, server.is_disabled)
                  "
                />
              </div>
            </div>
            <ul>
              <li v-for="key in Object.keys(server)">
                {{ key }}: {{ server[key] }}
              </li>
            </ul>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { reactive, onMounted, onBeforeUnmount, ref } from "vue";
import { fetchApi } from "../../utils/api";

const judgeServerStatus = reactive<JudgeServerStatus>({
  token: "",
  servers: [],
});

const loading = ref(false);
const timer = ref<number>(-1);

const init = async (triggerLoading: boolean = false) => {
  if (triggerLoading) loading.value = true;
  const response = await fetchApi("/admin/judge_server", "get");
  loading.value = false;
  Object.assign(judgeServerStatus, response.data.data);
};

const handleDelete = async (id: string) => {
  const response = await fetchApi("/admin/judge_server", "delete", {
    params: { hostname: id },
  });
  if (response.data.error) {
  }
  init();
};

const handleDisabled = async (id: number, disabled: boolean) => {
  const response = await fetchApi("/admin/judge_server", "put", {
    data: { id: id, is_disabled: disabled },
  });
  if (response.data.error) {
  }
  init();
};

onMounted(() => {
  init(true);
  timer.value = window.setInterval(() => {
    init();
  }, 5000);
});

onBeforeUnmount(() => {
  window.clearInterval(timer.value);
});
</script>
