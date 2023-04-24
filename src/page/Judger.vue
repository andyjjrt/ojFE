<template>
  <v-card class="pa-4 mb-4">
    <v-sheet v-for="language in constants.languages" class="pa-2">
      <h3 class="mb-2">{{ language.name }} ({{ language.description }})</h3>
      <v-code class="overflow-auto">
        <code class="text-no-wrap">
          {{ language.config.compile.compile_command }}
        </code>
      </v-code>
    </v-sheet>
  </v-card>
  <v-card class="pa-4">
    <v-sheet v-for="senario in explanation" class="pa-1">
      <b>{{ senario.type }}</b>
      <span>: {{ senario.description }}</span>
    </v-sheet>
  </v-card>
</template>

<script setup lang="ts">
import { useConstantsStore } from "../store/constants";

const constants = useConstantsStore();

const explanation = [
  {
    type: "Pending & Judging",
    description: "You solution will be judged soon, please wait for result.",
  },
  {
    type: "Compile Error",
    description:
      "Failed to compile your source code. Click on the link to see compiler's output.",
  },
  {
    type: "Accepted",
    description: "Congratulations. Your solution is correct.",
  },
  {
    type: "Wrong Answer",
    description: "Your program's output doesn't match judger's answer.",
  },
  {
    type: "Runtime Error",
    description:
      "Your program terminated abnormally. Possible reasons are: segment fault, divided by zero or exited with code other than 0.",
  },
  {
    type: "Time Limit Exceeded",
    description: "The CPU time your program used has exceeded limit.",
  },

  {
    type: "Memory Limit Exceeded",
    description: "The memory your program actually used has exceeded limit.",
  },

  {
    type: "System Error",
    description:
      "Oops, something has gone wrong with the judger. Please report this to administrator.",
  },
];
</script>
