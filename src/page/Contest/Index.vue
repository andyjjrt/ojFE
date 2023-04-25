<template>
  <v-card class="pa-4 mb-6">
    <v-md-preview v-katex :text="contest.description" />
  </v-card>
  <Announcements :contestId="contest.id.toString()" />
</template>

<script setup lang="ts">
import { inject } from "vue";
import vKatex from "../../plugins/vKatex";
import Announcements from "../../components/Announcements.vue";

const contest = inject("contest") as Contest;
</script>
