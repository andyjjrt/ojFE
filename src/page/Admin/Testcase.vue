<template>
  <v-card class="pa-4" :loading="loading" :disabled="loading">
    <v-card-title>Prune Testcase</v-card-title>
    <v-card-subtitle>
      These test cases are not owned by any problem, you can clean them safely.
    </v-card-subtitle>
    <v-card-text>
      <v-list lines="one">
        <v-list-item v-for="testcase in testcases">
          <v-list-item-title>{{ testcase.id }}</v-list-item-title>
          <template v-slot:append>
            <span>
              {{
                getDate(
                  new Date(testcase.create_time * 1000).toISOString(),
                  smAndDown
                )
              }}
            </span>
            <v-tooltip text="Delete" location="top">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  color="error"
                  icon
                  size="small"
                  @click="() => handleDelete(testcase.id)"
                >
                  <v-icon icon="mdi-delete" />
                </v-btn>
              </template>
            </v-tooltip>
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>
    <v-card-actions>
      <v-btn variant="elevated" color="error" @click="handleDelete">Delete all</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import useDate from "../../hooks/useDate";
import { useDisplay } from "vuetify";
import { fetchApi } from "../../utils/api";

const testcases = ref<TestCase[]>([]);
const loading = ref(false);
const { smAndDown } = useDisplay();
const { getDate } = useDate();

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/admin/prune_test_case", "get");
  loading.value = false;
  testcases.value = response.data.data;
};

const handleDelete = async (id: string) => {
  loading.value = true;
  const response = await fetchApi("/admin/prune_test_case", "delete", {
    params: {
      id: id,
    },
  });
  loading.value = false;
  init();
};

const handleDeleteAll = async () => {
  loading.value = true;
  const response = await fetchApi("/admin/prune_test_case", "delete");
  loading.value = false;
  init();
};

onMounted(() => init());
</script>
