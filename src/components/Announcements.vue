<template>
  <v-card class="pa-4">
    <v-card-title>Announcements</v-card-title>
    <ErrorMessage :message="error" v-if="error" class="mx-4" />
    <Datagrid
      :data="announcements"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="rowsPerPage"
      :hidePagination="contestId !== undefined"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
    >
      <template v-slot="{ data }: { data: Announcement[] }">
        <v-list lines="one">
          <v-dialog scrollable max-width="900" v-for="item in data">
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
import { useDisplay } from "vuetify";
import { fetchApi } from "../utils/api";
import Datagrid from "./Datagrid.vue";
import ErrorMessage from "./ErrorMessage.vue";

const props = defineProps<{
  contestId?: string;
}>();

const { smAndUp } = useDisplay();

const announcements = ref<Announcement[] | ContestAnnouncement[]>([]);
const page = ref(1);
const rowsPerPage = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (rowsPerPage.value = newRowPerPage);

const init = async () => {
  loading.value = true;
  const response = await fetchApi(
    `${props.contestId ? "/contest" : ""}/announcement`,
    "get",
    {
      params: {
        offset: (page.value - 1) * rowsPerPage.value,
        limit: rowsPerPage.value,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    announcements.value = props.contestId
      ? response.data.data
      : response.data.data.results;
    total.value = props.contestId
      ? response.data.data.length
      : response.data.data.total;
  }
};

onMounted(() => {
  init();
});

watch(page, () => init());
watch(rowsPerPage, () => init());
</script>
