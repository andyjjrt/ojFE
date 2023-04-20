<template>
  <v-card class="pa-4">
    <v-card-title>Problems</v-card-title>
    <Datagrid
      :data="problems"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="rowsPerPage"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
    >
      <template v-slot="{ data }: { data: Problem[] }">
        <v-list lines="one" density="compact">
          <template v-for="item in data">
            <v-list-item :to="`/problem/${item._id}`" :active="false">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <template v-slot:prepend>
                <DifficultyLabel :difficulty="item.difficulty" />
              </template>
              <template v-slot:append>
                {{
                  (
                    (item.accepted_number * 100) /
                    item.submission_number
                  ).toFixed(2)
                }}%
              </template>
            </v-list-item>
            <v-divider />
          </template>
          <!-- <v-dialog scrollable width="auto " v-for="item in data">
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
          </v-dialog> -->
        </v-list>
      </template>
    </Datagrid>
  </v-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import { fetchApi } from "../utils/api";
import Datagrid from "./Datagrid.vue";
import DifficultyLabel from "../components/DifficultyLabel.vue";

const problems = ref<Problem[]>([]);
const page = ref(1);
const rowsPerPage = ref(10);
const total = ref(0);
const loading = ref(false);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (rowsPerPage.value = newRowPerPage);

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/problem", "get", {
    params: {
      offset: (page.value - 1) * rowsPerPage.value,
      limit: rowsPerPage.value,
    },
  });
  loading.value = false;
  problems.value = response.data.data.results;
  total.value = response.data.data.total;
};

onMounted(() => {
  init();
});

watch(page, () => init());
watch(rowsPerPage, () => init());
</script>
