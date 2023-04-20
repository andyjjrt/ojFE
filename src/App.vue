<template>
  <RouterView v-if="isReady" />
  <v-layout v-else>
    <v-main style="height: 100dvh">
      <v-container class="h-100 w-100 d-flex align-center justify-center">
        <v-progress-circular :size="50" color="primary" indeterminate />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useConstantsStore } from "./store/constants";

const constants = useConstantsStore();
const { isReady } = storeToRefs(constants);

constants.init();
</script>
