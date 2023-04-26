<template>
  <v-layout>
    <v-app-Bar>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title>{{ website?.website_name }}</v-app-bar-title>
      <UserNavButton />
    </v-app-Bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav active-color="primary">
        <v-list-item title="Home" to="/" :active="routes.name === 'Home'">
          <template v-slot:prepend>
            <v-icon icon="mdi-home-variant"></v-icon>
          </template>
        </v-list-item>
        <v-list-item
          title="Problem"
          to="/problem"
          :active="routes.name === 'Problems'"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-view-grid-outline"></v-icon>
          </template>
        </v-list-item>
        <v-list-item
          title="Contest"
          to="/contest"
          :active="routes.name === 'Contests'"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-trophy"></v-icon>
          </template>
        </v-list-item>
        <v-list-item
          title="Status"
          to="/status"
          :active="routes.name === 'Submissions'"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-chart-line"></v-icon>
          </template>
        </v-list-item>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="Rank">
              <template v-slot:prepend>
                <v-icon icon="mdi-chart-bar"></v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list-item
            title="ACM Rank"
            to="/acm-rank"
            :active="routes.name === 'ACMRank'"
          >
          </v-list-item>
          <v-list-item
            title="OI Rank"
            to="/oi-rank"
            :active="routes.name === 'OIRank'"
          >
          </v-list-item>
        </v-list-group>

        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="About">
              <template v-slot:prepend>
                <v-icon icon="mdi-information-outline"></v-icon>
              </template>
            </v-list-item>
          </template>
          <v-list-item
            title="Judger"
            to="/judger"
            :active="routes.name === 'Judger'"
          >
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>
    <v-main>
      <v-container>
        <RouterView v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <component :is="Component" />
          </v-fade-transition>
        </RouterView>
      </v-container>
      <v-footer class="bg-background">
        <div class="text-center text-caption w-100">
          <div v-html="constants.website?.website_footer" />
          <span>FE redesign by</span>
          <a href="https://andyjjrt.cc" class="ms-1 me-2"> andyjjrt </a>
          <span>Version:</span>
          <a class="mx-1"> {{ versionString }} </a>
        </div>
      </v-footer>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import UserNavButton from "../components/UserNavButton.vue";
import { useConstantsStore } from "../store/constants";
import { computed } from "vue";

const constants = useConstantsStore();
const { website } = storeToRefs(constants);
const drawer = ref(false);

const versionString = computed(
  () => process.env.VUE_APP_VERSION + "-" + process.env.VUE_APP_HASH
);

const routes = useRoute();
</script>
