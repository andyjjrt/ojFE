<template>
  <v-sheet class="d-flex flex-column h-100">
    <v-overlay
      contained
      persistent
      class="align-center justify-center"
      :modelValue="loading"
    >
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
    <div class="my-4 text-center" v-if="!loading && data.length === 0">
      {{ t("datagrid.noData") }}
    </div>
    <slot :data="data">
      <div class="flex-grow-1">
        <div v-for="item in data">
          <slot name="row" :item="item" />
        </div>
      </div>
    </slot>
    <div class="d-flex justify-space-between align-center">
      <div class="ms-3">
        <slot name="footer" />
      </div>
      <div class="d-flex align-center">
        <template v-if="!hidePagination">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                color="primary"
                size="small"
                class="text-none"
                v-bind="props"
              >
                {{ rowsPerPage }}/{{ t("datagrid.page") }}
              </v-btn>
            </template>
            <v-list density="compact">
              <v-list-item
                @click="handleChangeRowPerPage(item)"
                v-for="item in [10, 20, 30]"
                :value="item"
                :active="item === rowsPerPage"
              >
                <v-list-item-title>
                  {{ item }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-pagination
            :length="totalPages"
            :total-visible="mobile ? 2 : 7"
           color="primary"
            density="compact"
            v-model="_page"
          />
        </template>
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  data: any[];
  loading: boolean;
  page: number;
  rowsPerPage: 10 | 20 | 30 | number;
  total: number;
  hidePagination?: boolean;
}>();
const emits = defineEmits(["handleNavigate", "handleChangeRowPerPage"]);

const totalPages = computed(
  () => Math.floor(props.total / props.rowsPerPage) + 1
);
const _page = computed({
  get: () => props.page,
  set: (value: number) => emits("handleNavigate", value),
});

const { mobile } = useDisplay();

const handleChangeRowPerPage = (value: number) =>
  emits("handleChangeRowPerPage", value);
</script>
