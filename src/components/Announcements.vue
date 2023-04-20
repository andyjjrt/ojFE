<template>
  <v-card class="pa-4">
    <v-card-title>Announcements</v-card-title>
    <Datagrid
      :data="announcements"
      :loading="false"
      :total="total"
      :page="page"
      :rows-per-page="rowsPerPage"
      @handleNavigate="handleNavigate"
    >
      <template v-slot="{ data }: { data: Announcement[] }">
        <v-list lines="one">
          <v-dialog scrollable  width="auto " v-for="item in data">
            <template v-slot:activator="{ props }">
              <v-list-item v-bind="props" :title="item.title"></v-list-item>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="primary" :title="item.title" />
                <v-card-text>
                  <v-md-preview :text="item.content" />
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn variant="text" @click="isActive.value = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-list>
      </template>
    </Datagrid>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fetchApi } from "../utils/api";
import Datagrid from "./Datagrid.vue";

const announcements = ref<Announcement[]>([]);
const page = ref(1);
const rowsPerPage = ref(2);
const total = ref(0);
const loading = ref(false);

const handleNavigate = (newPage: number) => (page.value = newPage);

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/announcement", "get", {
    params: {
      offset: (page.value - 1) * rowsPerPage.value,
      limit: rowsPerPage.value,
    },
  });
  loading.value = false;
  announcements.value = response.data.data.results;
  total.value = response.data.data.total;
};

onMounted(() => {
  init();
});

watch(page, () => {
  init();
});
</script>
