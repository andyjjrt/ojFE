<template>
  <Problem :contestId="contestId" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Problem from "../../../components/Admin/Problem.vue";

const routes = useRoute();
const contestId = routes.params.contestId as string;
</script>
