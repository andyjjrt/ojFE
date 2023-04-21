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
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTheme } from "vuetify";
import { useConstantsStore } from "./store/constants";
import { useUserStore } from "./store/user";

const constants = useConstantsStore();
const user = useUserStore();
const vuetifyTheme = useTheme();
const { isReady } = storeToRefs(constants);

constants.init();
user.getProfile();

onMounted(() => {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    vuetifyTheme.global.name.value = "dark";
  }
});
</script>
