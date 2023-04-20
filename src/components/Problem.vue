<template>
  <v-card class="pa-2">
    <v-card-title class="font-weight-bold text-h5">{{ title }}</v-card-title>
    <v-divider />
    <div class="pa-2">
      <h6 class="text-h5">Description</h6>
      <v-md-preview v-katex :text="description" />
    </div>
    <div class="pa-2">
      <h6 class="text-h5">Input</h6>
      <v-md-preview  v-katex :text="input" />
    </div>
    <div class="pa-2">
      <h6 class="text-h5">Output</h6>
      <v-md-preview  v-katex :text="output" />
    </div>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import vKatex from "../plugins/vKatex"

const props = defineProps<{
  problem: Problem | null;
  loading: boolean;
}>();

const title = computed(() => props.problem?.title);
const description = computed(() => decodeURI(props.problem?.description || ""));
const input = computed(() => decodeURI(props.problem?.input_description || ""));
const output = computed(() =>
  decodeURI(props.problem?.output_description || "")
);
const samples = computed(() => props.problem?.samples || []);
const hint = computed(() => decodeURI(props.problem?.hint || ""));
</script>
