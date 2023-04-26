<template>
  <div v-if="user.profile">
    <div class="d-flex">
      <v-avatar :image="user.profile.avatar" size="100" />
      <div class="mx-4 d-flex flex-column">
        <h1>{{ user.profile.user.username }}</h1>
        <p>
          Last login:
          {{ new Date(user.profile.user.last_login).toLocaleString() }}
        </p>
      </div>
    </div>
    <v-tabs class="mt-3 mb-6">
      <v-tab :to="{ name: 'Setting' }"> Profile </v-tab>
      <v-tab :to="{ name: 'SettingAccount' }"> Account </v-tab>
      <v-tab :to="{ name: 'SettingSecurity' }"> Security </v-tab>
    </v-tabs>
    <RouterView v-slot="{ Component }">
      <v-fade-transition mode="out-in">
        <component :is="Component" />
      </v-fade-transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { provide, readonly } from "vue";
import { useUserStore } from "../store/user";

const user = useUserStore();
</script>
