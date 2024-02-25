<template>
  <div>
    <v-file-input
      accept=".csv"
      label="File input"
      hide-details
      @change="handleParseFile"
      v-if="users.length == 0"
    ></v-file-input>
    <Datagrid
      :data="users"
      :total="total"
      :page="page"
      :loading="loading"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
      v-else
    >
      <template v-slot="{ data }: { data: string[] }">
        <v-list lines="one">
          <template v-for="item in data">
            <v-list-item>
              <v-list-item-title>{{ item[0] }}</v-list-item-title>
              <v-list-item-subtitle>{{ item[2] }}</v-list-item-subtitle>
              <template v-slot:append>{{ item[3] }}</template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
      <template v-slot:footer>
        <div class="d-flex ga-2">
          <v-btn color="error" variant="elevated" @click="() => handleClear()">
            Reset
          </v-btn>
          <v-btn
            color="primary"
            variant="elevated"
            @click="() => handleUpload()"
          >
            Upload
          </v-btn>
        </div>
      </template>
    </Datagrid>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import papa from "papaparse";
import Datagrid from "../Datagrid.vue";
import Message from "vue-m-message";
import { fetchApi } from "../../utils/api";

const emits = defineEmits(["handleImported"]);

const users = ref<Array<Array<string>>>([]);

const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const handleParseFile = (e: Event) => {
  users.value = [];
  papa.parse((e.target as HTMLInputElement)!.files![0], {
    complete: (results) => {
      let fail = 0;
      for (let i in results.data) {
        console.log(results.data[i]);
        if ((results as any).data[i].length == 4) {
          users.value.push((results as any).data[i]);
        } else {
          fail += 1;
        }
      }
      if (fail > 0) {
        Message.warning(fail + "users have been filtered due to empty value");
      }
      total.value = results.data.length - fail;
      (e.target as HTMLInputElement).value = "";
    },
  });
};

const handleClear = () => {
  total.value = 0;
  users.value = [];
};

const handleUpload = async () => {
  loading.value = true;
  fetchApi("/admin/user", "POST", {
    data: {
      users: users.value,
    },
  }).then((res) => {
    loading.value = false;
    if (res.data.error) {
      Message.error(res.data.data);
    } else {
      Message.success("Success");
      emits("handleImported");
      handleClear();
    }
  });
};
</script>
