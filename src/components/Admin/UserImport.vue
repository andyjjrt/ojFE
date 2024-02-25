<template>
  <v-file-input accept=".csv" label="File input" @change="handleUpload"></v-file-input>
</template>

<script setup lang="ts">
import { ref } from "vue";
import papa from "papaparse";
import Message from "vue-m-message";

const users = ref<Array<Array<string>>>([]);

const handleUpload = (e: Event) => {
  users.value = []
  papa.parse((e.target as HTMLInputElement)!.files![0], {
    complete: (results) => {
      let fail = 0;
      for (let i in results.data) {
        if ((results as any).data[i].length == 3) {
          users.value.push((results as any).data[i]);
        } else {
          fail += 1;
        }
      }
      if (fail > 0) {
        Message.warning({
          message: fail + "users have been filtered due to empty value",
          duration: 3000,
          zIndex: 1000000,
        });
      }
      e.target.value = "";
    },
  });
};
</script>
