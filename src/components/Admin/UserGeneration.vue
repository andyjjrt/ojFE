<template>
  <v-row tag="form">
    <v-col cols="12" md="6">
      <v-text-field hide-details label="Prefix" v-model="data.prefix" />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field hide-details label="Suffix" v-model="data.suffix" />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        hide-details
        label="Number From"
        type="number"
        v-model="data.number_from"
      />
    </v-col>
    <v-col cols="12" md="6">
      <v-text-field
        hide-details
        label="Number To"
        type="number"
        v-model="data.number_to"
      />
    </v-col>
    <v-col cols="12">
      <v-text-field
        hide-details
        label="Password Length"
        type="number"
        v-model="data.password_length"
      />
    </v-col>
    <v-col cols="12">
      <div class="d-flex justify-end">
        <v-btn
          variant="elevated"
          color="primary"
          @click="handleGenerate"
          :loading="loading"
        >
          Generate
        </v-btn>
      </div>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { fetchApi } from "../../utils/api";
import Message from "vue-m-message";

const emits = defineEmits(["handleImported"]);

const data = reactive({
  prefix: "",
  suffix: "",
  number_from: 0,
  number_to: 0,
  password_length: 8,
});
const loading = ref(false);

const handleGenerate = async () => {
  loading.value = true;
  fetchApi("/admin/generate_user", "POST", {
    data: data,
  }).then(async (res) => {
    if (res.data.error) {
      Message.error(res.data.data);
      loading.value = false;
    } else {
      Message.success("Success");
      const response = await fetchApi(
        "/admin/generate_user?file_id=" + res.data.data.file_id,
        "get",
        {
          responseType: "blob",
        }
      );
      console.log(response.headers["Content-Disposition"]);
      let blob = new Blob([response.data], {
        type: "application/xlsx",
      });
      let url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Generated-${new Date().getTime()}.xlsx`;
      link.click();
      URL.revokeObjectURL(url);
      loading.value = false;
      emits("handleImported");
    }
  });
};
</script>
