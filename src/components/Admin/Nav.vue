<template>
  <v-list-item
    title="Dashboard"
    :to="{ name: 'AdminDashboard' }"
    :active="routes.name === 'AdminDashboard'"
    :prepend-icon="icon ? 'mdi-monitor-dashboard' : undefined"
  />
  <v-list-item
    title="Config"
    :to="{ name: 'AdminConfig' }"
    :active="routes.name === 'AdminConfig'"
    :prepend-icon="icon ? 'mdi-wrench' : undefined"
  />
  <v-list-item
    title="JudgeServer"
    :to="{ name: 'AdminJudgeServer' }"
    :active="routes.name === 'AdminJudgeServer'"
    :prepend-icon="icon ? 'mdi-server' : undefined"
  />
  <v-list-item
    title="Testcase"
    :to="{ name: 'AdminTestcase' }"
    :active="routes.name === 'AdminTestcase'"
    :prepend-icon="icon ? 'mdi-treasure-chest' : undefined"
  />
  <v-list-item
    title="User"
    :to="{ name: 'AdminUser' }"
    :active="routes.name === 'AdminUser'"
    :prepend-icon="icon ? 'mdi-account-group' : undefined"
  />
  <v-list-item
    title="Announcement"
    :to="{ name: 'AdminAnnouncement' }"
    :active="routes.name === 'AdminAnnouncement'"
    :prepend-icon="icon ? 'mdi-bullhorn' : undefined"
  />
  <v-list-item
    title="Problem"
    :to="{ name: 'AdminProblems' }"
    :active="routes.name === 'AdminProblems'"
    :prepend-icon="icon ? 'mdi-view-grid-outline' : undefined"
  />
  <v-list-item
    title="Contest"
    :to="{ name: 'AdminContests' }"
    :active="routes.name === 'AdminContests'"
    :prepend-icon="icon ? 'mdi-trophy' : undefined"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const props = defineProps<{
  icon?: boolean;
}>();

const routes = useRoute();
</script>
