<template>
  <div>
    <v-card class="pa-4 mb-6">
      <v-md-preview v-katex :text="decodeURI(contest.description)" />
    </v-card>
    <Announcements :contestId="contest.id.toString()" />
  </div>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref } from "vue";
import vKatex from "../../plugins/vKatex";
import Announcements from "../../components/Announcements.vue";
import { useConstantsStore } from "../../store/constants";

const contest = inject("contest") as Ref<Contest>;
const constants = useConstantsStore();

onMounted(() => {
  document.title = `${constants.website!.website_name_shortcut} | ${contest.value.title}`;
});
</script>
