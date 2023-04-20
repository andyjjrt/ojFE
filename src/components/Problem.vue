<template>
  <v-card class="pa-2">
    <v-card-title class="font-weight-bold text-h5">{{ title }}</v-card-title>
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
      <template v-for="(sample, index) in samples">
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
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import vKatex from "../plugins/vKatex";

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

const copy = (text: string) => {
  navigator.clipboard.writeText("text");
};
</script>
