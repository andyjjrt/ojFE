<template>
  <v-tabs v-model="tab" color="primary" direction="vertical">
    <v-tab
      v-for="item in adminNavItem"
      :value="item.routeName"
      :to="{ name: item.routeName }"
      exact
      class="text-none"
    >
      <v-icon start v-if="icon"> {{ item.icon }} </v-icon>
      {{ item.title }}
    </v-tab>
  </v-tabs>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { adminNavItem } from "../../utils/navItems";
import { computed } from "vue";

const props = defineProps<{
  icon?: boolean;
}>();

const routes = useRoute();
const tab = computed({
  get: () => routes.name,
  set: (val) => {},
});
</script>
