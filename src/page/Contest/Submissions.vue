<template>
  <Submissions :contestId="contest.id.toString()" />
</template>

<script setup lang="ts">
import { inject } from "vue";
import Submissions from "../../components/Submissions.vue";

const contest = inject("contest") as Contest;
</script>
