<template>
  <v-layout>
    <v-app-Bar>
      <v-skeleton-loader
        type="avatar, heading, avatar"
        class="w-100"
        v-if="constants.website === null"
      />
      <template v-else>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="smAndDown" />
        <v-app-bar-title>{{ website?.website_name }}</v-app-bar-title>
        <v-tabs v-model="currentNav" v-if="!smAndDown">
          <template v-for="item in nav" :key="item.title">
            <v-tab v-if="item.routes" :value="item.routeName">
              {{ t(item.title) }}
              <v-menu activator="parent">
                <v-list>
                  <v-list-item
                    v-for="subItem in item.routes"
                    :key="subItem.title"
                    :value="subItem.title"
                    :to="{ name: subItem.routeName }"
                  >
                    <v-list-item-title>
                      {{ t(subItem.title) }}
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-tab>
            <v-tab
              v-else
              :value="item.routeName"
              :to="{ name: item.routeName }"
            >
              {{ t(item.title) }}
            </v-tab>
          </template>
        </v-tabs>
        <div class="mx-2">
          <v-skeleton-loader type="avatar" v-if="!constants.isReady" />
          <UserNavButton v-else />
        </div>
      </template>
    </v-app-Bar>
    <v-navigation-drawer v-model="drawer" temporary v-if="smAndDown">
      <v-list navcolor="primary">
        <template v-for="item in nav" :key="item.title">
          <v-list-group v-if="item.routes">
            <template v-slot:activator="{ props }">
              <v-list-item
                v-bind="props"
                :title="t(item.title)"
                :prepend-icon="item.icon"
              />
            </template>
            <v-list-item
              v-for="subItem in item.routes"
              :title="t(subItem.title)"
              :to="{ name: subItem.routeName }"
              :active="routes.name === subItem.routeName"
            >
            </v-list-item>
          </v-list-group>
          <v-list-item
            v-else
            :title="t(item.title)"
            :to="{ name: item.routeName }"
            :active="routes.name === item.routeName"
            :prepend-icon="item.icon"
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

      <v-footer
        class="d-flex flex-column align-center bg-background text-caption"
      >
        <div
          v-if="constants.website == null"
          style="max-width: 500px"
          class="w-100 text-center"
        >
          <v-skeleton-loader type="text" class="bg-background" />
        </div>
        <template v-else>
          <div v-html="constants.website?.website_footer" />
          <div>
            <span>FE redesign by</span>
            <a
              href="https://andyjjrt.cc"
              class="me-2 text-decoration-none"
              target="_blank"
            >
              andyjjrt
            </a>
            <span>Version:</span>
            <a
              :href="releaseLocation"
              class="mx-1 text-decoration-none"
              target="_blank"
            >
              {{ versionString }}
            </a>
          </div>
        </template>
      </v-footer>
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import { useConstantsStore } from "../store/constants";
import { useUserStore } from "../store/user";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";
import { RouteLocationNormalized, useRoute, useRouter } from "vue-router";
import UserNavButton from "../components/UserNavButton.vue";
import AdminNav from "../components/Admin/Nav.vue";
import { navItems, adminNavItem } from "../utils/navItems";

const constants = useConstantsStore();
const user = useUserStore();
const { smAndDown } = useDisplay();
const { t } = useI18n();

const { website } = storeToRefs(constants);
const drawer = ref(false);

const versionString = computed(
  () => process.env.VUE_APP_VERSION + "-" + process.env.VUE_APP_HASH
);

const releaseLocation = computed(
  () =>
    `https://github.com/andyjjrt/ojFE/releases/tag/v${process.env.VUE_APP_VERSION}`
);

const nav = computed(() => {
  if (user.profile?.user.admin_type.includes("Admin")) {
    if (smAndDown.value) {
      return [
        ...navItems,
        {
          title: "management.title",
          icon: "mdi-cog",
          routeName: "Admin",
          routes: adminNavItem,
        },
      ];
    } else {
      return [
        ...navItems,
        {
          title: "management.title",
          icon: "mdi-cog",
          routeName: "Admin",
        },
      ];
    }
  } else return navItems;
});

const currentNav = computed({
  get: () => routes.meta.name || routes.name,
  set: (val) => {},
});

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

watch(
  () => user.isReady,
  () => {
    if (
      routes.meta.admin &&
      !(user.profile && user.profile.user.admin_type.includes("Admin"))
    ) {
      router.push({ name: "Home" });
    }
    generateTitle(routes);
  }
);
</script>
