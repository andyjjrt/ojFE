<template>
  <v-menu location="bottom">
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-icon icon="mdi-palette" />
      </v-btn>
    </template>

    <v-list>
      <v-list-item
        v-for="theme in themes"
        :value="theme"
        @click="changeTheme(theme)"
      >
        <v-list-item-title>{{ theme }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useTheme } from "vuetify";
const vuetifyTheme = useTheme();

const themes = computed(() => Object.keys(vuetifyTheme.themes.value));

const changeTheme = (name: string) => {
  vuetifyTheme.global.name.value = name;
};
</script>
