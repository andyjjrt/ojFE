<template>
  <v-list-item
    title="Dashboard"
    :to="{ name: 'AdminDashboard' }"
    :active="routes.name === 'AdminDashboard'"
  />
  <v-list-item
    title="User"
    :to="{ name: 'AdminUser' }"
    :active="routes.name === 'AdminUser'"
  />
  <v-list-item
    title="Announcement"
    :to="{ name: 'AdminAnnouncement' }"
    :active="routes.name === 'AdminAnnouncement'"
  />
  <v-list-item
    title="Problem"
    :to="{ name: 'AdminProblems' }"
    :active="routes.name === 'AdminProblems'"
  />
  <v-list-item
    title="Contest"
    :to="{ name: 'AdminContests' }"
    :active="routes.name === 'AdminContests'"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const routes = useRoute();
</script>
