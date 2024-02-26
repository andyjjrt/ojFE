<script setup lang="ts">
import { useRegisterSW } from "virtual:pwa-register/vue";

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

async function close() {
  offlineReady.value = false;
  needRefresh.value = false;
}
</script>

<template>
  <v-snackbar
    location="bottom right"
    :model-value="offlineReady || needRefresh"
  >
    <span v-if="offlineReady"> App ready to work offline </span>
    <span v-else>
      New content available, click on reload button to update.
    </span>

    <template v-slot:actions>
      <v-btn
        v-if="needRefresh"
        color="primary"
        variant="text"
        @click="updateServiceWorker()"
      >
        Reload
      </v-btn>
      <v-btn color="primary" variant="text" @click="close()"> Close </v-btn>
    </template>
  </v-snackbar>
</template>