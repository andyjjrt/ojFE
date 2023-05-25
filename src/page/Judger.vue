<template>
  <div>
    <v-card class="pa-4 mb-4">
      <v-card-title>{{ t("judger.title") }}</v-card-title>
      <v-card-text>
        <v-sheet v-for="language in constants.languages" class="py-2">
          <h3 class="mb-2">{{ language.name }} ({{ language.description }})</h3>
          <v-code class="overflow-auto">
            <code class="text-no-wrap">
              {{ language.config.compile.compile_command }}
            </code>
          </v-code>
        </v-sheet>
      </v-card-text>
    </v-card>
    <v-card class="pa-4">
      <v-sheet v-for="senario in explanation" class="pa-1">
        <b>{{ senario.type }}</b>
        <span>: {{ senario.description }}</span>
      </v-sheet>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useConstantsStore } from "../store/constants";
import { useI18n } from "vue-i18n";

const constants = useConstantsStore();
const { t } = useI18n();

const explanation = computed(() => [
  {
    type: "Pending & Judging",
    description: t("judger.pendingAndJudging"),
  },
  {
    type: "Compile Error",
    description: t("judger.compileError"),
  },
  {
    type: "Accepted",
    description: t("judger.accepted"),
  },
  {
    type: "Wrong Answer",
    description: t("judger.wrongAnswer"),
  },
  {
    type: "Runtime Error",
    description: t("judger.runtimeError"),
  },
  {
    type: "Time Limit Exceeded",
    description: t("judger.timeLimitExceeded"),
  },
  {
    type: "Memory Limit Exceeded",
    description: t("judger.memoryLimitExceeded"),
  },
  {
    type: "System Error",
    description: t("judger.systemError"),
  },
]);
</script>
