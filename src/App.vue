<template>
  <RouterView v-if="constants.isReady && user.isReady" />
  <v-layout v-else>
    <v-main style="height: 100dvh">
      <v-container
        class="h-100 w-100 d-flex flex-column align-center justify-center"
      >
        <v-progress-circular :size="50" color="primary" indeterminate />
        <div v-if="timeout" class="mt-1 text-center">
          <p>There may be some network error...</p>
          <p>Please try again later.</p>
        </div>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import { useConstantsStore } from "./store/constants";
import { useUserStore } from "./store/user";

const constants = useConstantsStore();
const user = useUserStore();
const vuetifyTheme = useTheme();

const timeout = ref(false);

constants.init();
user.getProfile();

onMounted(() => {
  if (localStorage.getItem("theme")) {
    vuetifyTheme.global.name.value = localStorage.getItem("theme") as string;
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    vuetifyTheme.global.name.value = "dark";
  }
  setTimeout(() => {
    timeout.value = true;
  }, 10000);
});
</script>
