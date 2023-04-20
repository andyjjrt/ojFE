<template>
  <div class="d-flex flex-column h-100">
    <slot :data="data">
      <div class="flex-grow-1">
        <div v-for="item in data">
          <slot name="row" :item="item" />
        </div>
      </div>
    </slot>
    <div class="d-flex justify-end align-center">
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn color="primary" size="small" v-bind="props">{{ rowsPerPage }}/page</v-btn>
        </template>
        <v-list density="compact">
          <v-list-item v-for="item in [10, 20, 30]" :value="item">
            <v-list-item-title>{{ item }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-pagination
        :length="totalPages"
        :total-visible="7"
        active-color="primary"
        density="compact"
        v-model="_page"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, defineEmits } from "vue";

const props = defineProps<{
  data: any[];
  loading: boolean;
  page: number;
  rowsPerPage: 10 | 20 | 30 | number;
  total: number;
}>();
const emits = defineEmits(["handleNavigate"]);

const totalPages = computed(
  () => Math.floor(props.total / props.rowsPerPage) + 1
);
const _page = computed({
  get: () => props.page,
  set: (value: number) => emits("handleNavigate", value),
});
</script>
