<template>
  <v-layout>
    <v-app-Bar>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title>{{ website?.website_name }}</v-app-bar-title>
      <UserNavButton />
      <ThemeButton />
    </v-app-Bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav active-color="primary">
        <v-list-item title="Home" to="/" :active="routes.name === 'Home'" />
        <v-list-item title="Problem" to="/problem" :active="routes.name === 'Problems'" />
        <v-list-item title="Status" to="/status" :active="routes.name === 'Submissions'" />
        <v-list-item title="Contests" to="/contests" :active="routes.name === 'Contests'" />
        <v-list-item title="Status" to="/status" :active="routes.name === 'status'" />
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import ThemeButton from "../components/ThemeButton.vue";
import UserNavButton from "../components/UserNavButton.vue";
import { useConstantsStore } from "../store/constants";

const constants = useConstantsStore();
const { website } = storeToRefs(constants);
const drawer = ref(false);

const routes = useRoute();
</script>
