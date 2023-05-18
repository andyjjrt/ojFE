<template>
  <v-layout>
    <v-app-Bar>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-app-bar-title>{{ website?.website_name }}</v-app-bar-title>
      <UserNavButton />
    </v-app-Bar>
    <v-navigation-drawer v-model="drawer" temporary>
      <v-list nav active-color="primary">
        <v-list-item
          :title="t('home')"
          to="/"
          :active="routes.name === 'Home'"
          prepend-icon="mdi-home-variant"
        />
        <v-list-item
          :title="t('problem.title')"
          to="/problem"
          :active="routes.name === 'Problems'"
          prepend-icon="mdi-view-grid-outline"
        />
        <v-list-item
          :title="t('contest.title')"
          to="/contest"
          :active="routes.name === 'Contests'"
          prepend-icon="mdi-trophy"
        />
        <v-list-item
          :title="t('submission.title')"
          to="/status"
          :active="routes.name === 'Submissions'"
          prepend-icon="mdi-chart-line"
        />
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="t('rank.title')"
              prepend-icon="mdi-chart-bar"
            />
          </template>
          <v-list-item
            :title="`ACM ${t('rank.title')}`"
            to="/acm-rank"
            :active="routes.name === 'ACMRank'"
          >
          </v-list-item>
          <v-list-item
            :title="`OI ${t('rank.title')}`"
            to="/oi-rank"
            :active="routes.name === 'OIRank'"
          >
          </v-list-item>
        </v-list-group>
        <v-list-group>
          <template v-slot:activator="{ props }">
            <v-list-item
              v-bind="props"
              :title="t('about.title')"
              prepend-icon="mdi-information-outline"
            />
          </template>
          <v-list-item
            title="Judger"
            to="/judger"
            :active="routes.name === 'Judger'"
          >
          </v-list-item>
          <v-list-item title="FAQ" to="/faq" :active="routes.name === 'FAQ'">
          </v-list-item>
        </v-list-group>
        <template v-if="user.profile?.user.admin_type.includes('Admin')">
          <v-list-group v-if="smAndDown">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="t('management.title')"
                prepend-icon="mdi-cog"
              />
            </template>
            <AdminNav />
          </v-list-group>
          <v-list-item
            :title="t('management.title')"
            to="/admin"
            :active="routes.name === 'Admin'"
            prepend-icon="mdi-cog"
            v-else
          />
        </template>
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
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useConstantsStore } from "../store/constants";
import { useUserStore } from "../store/user";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { RouteLocationNormalized, useRoute, useRouter } from "vue-router";
import UserNavButton from "../components/UserNavButton.vue";
import AdminNav from "../components/Admin/Nav.vue";

const constants = useConstantsStore();
const user = useUserStore();
const { smAndDown } = useDisplay();
const { t } = useI18n();

const { website } = storeToRefs(constants);
const drawer = ref(false);

const versionString = computed(
  () => process.env.VUE_APP_VERSION + "-" + process.env.VUE_APP_HASH
);

const routes = useRoute();
const router = useRouter();

const generateTitle = (route: RouteLocationNormalized) => {
  if (!constants.website) {
    document.title = "OnlineJudge";
  } else {
    document.title = `${constants.website.website_name_shortcut} | ${String(
      route.name
    )}`;
  }
};

onMounted(() => {
  if (
    routes.meta.admin &&
    !(user.profile && user.profile.user.admin_type.includes("Admin"))
  ) {
    router.push({ name: "Home" });
  }
  generateTitle(routes);
});

router.beforeEach((to, from, next) => {
  if (
    to.meta.admin &&
    !(user.profile && user.profile.user.admin_type.includes("Admin"))
  ) {
    next({ name: "Home" });
  }
  generateTitle(to);
  next();
});
</script>
