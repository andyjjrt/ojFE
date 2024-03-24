<template>
  <v-list-item
    v-for="item in adminNavItem"
    :title="item.title"
    :to="{ name: item.routeName }"
    :active="routes.name === item.routeName"
    :prepend-icon="icon ? item.icon : undefined"
  />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { adminNavItem } from "../../utils/navItems";

const props = defineProps<{
  icon?: boolean;
}>();

const routes = useRoute();
</script>
