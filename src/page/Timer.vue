<template>
  <div>
    <div class="text-center" style="font-size: 8rem">
      {{ zero(hour) }}:{{ zero(minute) }}:{{ zero(second) }}
    </div>
    <div style="position: relative">
      <iframe
        class="w-100"
        ref="iframeElm"
        style="height: 55dvh; border: none"
      />
      <v-dialog width="500">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-cog-outline"
            style="position: absolute; bottom: 10px; right: 10px"
          />
        </template>

        <template v-slot:default="{ isActive }">
          <v-card title="Setting">
            <v-card-text>
              <v-text-field
                label="iframe src"
                variant="outlined"
                v-model="iframeSrc"
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Save"
                @click="
                  isActive.value = false;
                  refresh();
                "
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useTimestamp } from "@vueuse/core";

const timestamp = useTimestamp({ offset: 0 });

const iframeSrc = ref("");
const iframeElm = ref<HTMLIFrameElement | null>(null);

const hour = computed(() => new Date(timestamp.value).getHours());
const minute = computed(() => new Date(timestamp.value).getMinutes());
const second = computed(() => new Date(timestamp.value).getSeconds());

const zero = computed(() => {
  return (val: number) => {
    return `${val < 10 ? "0" : ""}${val}`;
  };
});

const refresh = () => {
  if (iframeElm.value) {
    iframeElm.value.src = iframeSrc.value;
  }
};
</script>
