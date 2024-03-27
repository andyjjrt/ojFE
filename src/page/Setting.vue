<template>
  <div>
    <div class="d-flex" v-if="user.profile">
      <v-avatar :image="user.profile.avatar" size="100" />
      <div class="mx-4 d-flex flex-column">
        <h1>{{ user.profile.user.username }}</h1>
        <p>
          {{ t("setting.lastLoggedin") }}:
          {{ new Date(user.profile.user.last_login).toLocaleString() }}
        </p>
      </div>
    </div>
    <v-tabs class="mt-3 mb-6">
      <v-tab value="Setting" :to="{ name: 'Setting' }">
        {{ t("setting.profile.title") }}
      </v-tab>
      <v-tab value="SettingAccount" :to="{ name: 'SettingAccount' }">
        {{ t("setting.account.title") }}
      </v-tab>
      <v-tab value="SettingSecurity" :to="{ name: 'SettingSecurity' }">
        {{ t("setting.security.title") }}
      </v-tab>
    </v-tabs>
    <RouterView v-slot="{ Component }" v-if="user.profile">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from "vue";
import { useUserStore } from "../store/user";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";

const user = useUserStore();
const routes = useRoute();
const router = useRouter();
const { t } = useI18n();

watch(
  () => user.profile,
  (val) => {
    if (!val) router.push({ name: "Home" });
  }
);
</script>
