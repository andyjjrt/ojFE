<template>
  <v-card class="pa-4">
    <v-md-preview v-katex :text="contest.description" />
  </v-card>
</template>

<script setup lang="ts">
import { inject } from "vue";
import vKatex from "../../plugins/vKatex";

const contest = inject("contest") as Contest;
</script>
