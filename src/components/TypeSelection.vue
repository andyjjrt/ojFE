<template>
  <v-menu>
    <template v-slot:activator="{ props }">
      <v-btn color="primary" size="small" v-bind="props" class="me-2" :class="class">
        <template v-if="label === '' || label === undefined">
          {{ defaultLabel }}
        </template>
        <slot name="label" v-else :item="label">
          {{ label }}
        </slot>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        @click="handleClick('all')"
        :active="label === '' || label === undefined"
      >
        All
      </v-list-item>
      <v-list-item
        v-for="item in items"
        :key="item"
        @click="handleClick(item)"
        :active="label === item"
      >
        <v-list-item-title>
          <slot name="item" :item="item" />
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string | undefined;
  defaultLabel: string;
  items: Array<string>;
  class?: string;
}>();

const emits = defineEmits(["click"]);

const handleClick = (item: string) => {
  emits("click", item);
};
</script>
