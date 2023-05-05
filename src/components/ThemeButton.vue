<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <slot name="activator" :props="props">
        <v-btn icon v-bind="props">
          <v-icon icon="mdi-palette" />
        </v-btn>
      </slot>
    </template>

    <v-list>
      <v-list-item
        v-for="theme in themes"
        :active="theme === currentTheme"
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
const currentTheme = computed(() => vuetifyTheme.global.name.value);

const changeTheme = (name: string) => {
  vuetifyTheme.global.name.value = name;
  localStorage.setItem("theme", name)
};
</script>
