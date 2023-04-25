<template>
  <Problems :contestId="contest.id.toString()" />
</template>

<script setup lang="ts">
import { inject } from "vue";
import Problems from "../../components/Problems.vue";

const contest = inject("contest") as Contest;
</script>
