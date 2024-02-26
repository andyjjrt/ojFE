<template>
  <div>
    <RouterView />
    <ReloadPrompt />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useTheme } from "vuetify";
import { useConstantsStore } from "./store/constants";
import { useUserStore } from "./store/user";
import ReloadPrompt from "./components/ReloadPrompt.vue";

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
