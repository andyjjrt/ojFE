<template>
  <v-chip class="ma-1 me-2" size="small" label :color="color">
    {{ difficulty }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  difficulty: string;
}>();

const color = computed(() => {
  if (props.difficulty === "Low") return "success";
  else if (props.difficulty === "Mid") return "warning";
  else if (props.difficulty === "High") return "primary";
});
</script>
