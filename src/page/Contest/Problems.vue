<template>
  <Problems :contestId="contest.id.toString()" />
</template>

<script setup lang="ts">
import { inject, onMounted, Ref } from "vue";
import Problems from "../../components/Problems.vue";
import { useConstantsStore } from "../../store/constants";

const contest = inject("contest") as Ref<Contest>;

const constants = useConstantsStore();

onMounted(() => {
  document.title = `${constants.website!.website_name_shortcut} | ${
    contest.value.title
  }`;
});
</script>
