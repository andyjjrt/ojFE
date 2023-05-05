<template>
  <div>
    <v-tabs class="mb-3">
      <v-tab :to="{ name: 'AdminContest', params: { contestId: contestId } }">
        Overview
      </v-tab>
      <v-tab :to="{ name: 'AdminContestAnnouncement', params: { contestId: contestId } }">
        Announement
      </v-tab>
      <v-tab :to="{ name: 'AdminContestProblems', params: { contestId: contestId } }">
        Problems
      </v-tab>
    </v-tabs>
    <RouterView v-slot="{ Component }">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const routes = useRoute();
const contestId = routes.params.contestId;
</script>
