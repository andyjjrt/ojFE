<template>
  <v-layout>
    <v-app-Bar>
      <v-app-bar-nav-icon variant="text" @click.stop="drawer = !drawer" />
      <v-app-bar-title>{{ website?.website_name }}</v-app-bar-title>
      <ThemeButton />
    </v-app-Bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav>
        <v-list-item value="item" active-color="primary-darken-1" title="123" />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <RouterView />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import ThemeButton from "../components/ThemeButton.vue";
import { useConstantsStore } from "../store/constants";

const constants = useConstantsStore();
const { website } = storeToRefs(constants);
const drawer = ref(false);
</script>
