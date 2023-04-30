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
import { RouteLocationNormalized, useRoute, useRouter } from "vue-router";
import { watch } from "vue";

const constants = useConstantsStore();
const user = useUserStore();
const router = useRouter();
const routes = useRoute();
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

const generateTitle = (route: RouteLocationNormalized) => {
  if (!constants.website) {
    document.title = "OnlineJudge";
  } else {
    document.title = `${constants.website.website_name_shortcut} | ${String(
      route.name
    )}`;
  }
}

watch(constants, () => {
  generateTitle(routes);
});

router.beforeEach((to, from, next) => {
  generateTitle(to);
  next();
});
</script>
