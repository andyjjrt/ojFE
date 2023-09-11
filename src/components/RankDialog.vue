<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <v-btn color="primary" v-bind="props"><v-icon icon="mdi-chart-histogram" /></v-btn>
    </template>
    <v-card>
      <div class="d-flex justify-end">
        <v-btn icon dark @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>
      <div class="pa-4 d-flex flex-column justify-center">
        <v-card class="pa-4 mb-6">
          <div class="text-center text-h1 ma-3">
            {{ getDate(time.toISOString(), false) }}
          </div>
        </v-card>
        <slot />
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import useDate from "../hooks/useDate";

const dialog = ref(false);

const time = ref(new Date());
const timer = ref<NodeJS.Timer>();

const { getDate } = useDate();

const init = () => {
  time.value = new Date();
  setTimeout(() => {
    timer.value = setInterval(() => {
      time.value = new Date();
    }, 1000);
  }, 1000 - new Date().getMilliseconds());
};

watch(dialog, (val) => {
  if (val) init();
  else clearInterval(timer.value);
});
</script>
