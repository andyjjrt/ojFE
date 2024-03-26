<template>
  <ContestOIRank v-if="contest.rule_type == 'OI'" />
  <ContestACMRank v-else />
</template>

<script setup lang="ts">
import ContestOIRank from "../../components/ContestOIRank.vue";
import ContestACMRank from "../../components/ContestACMRank.vue";
import { inject, Ref } from "vue";

const contest = inject("contest") as Ref<Contest>;
</script>
