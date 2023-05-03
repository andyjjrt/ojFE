<template>
  <Problems :contestId="contestId" />
</template>

<script setup lang="ts">
import Problems from "../../../components/Admin/Problems.vue";
import { useRoute } from "vue-router";

const routes = useRoute();
const contestId = routes.params.contestId as string;
</script>
