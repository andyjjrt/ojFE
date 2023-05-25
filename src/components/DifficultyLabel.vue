<template>
  <v-chip class="ma-1 me-2" size="small" label :color="color">
    {{ difficultyLabel }}
  </v-chip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const props = defineProps<{
  difficulty: string;
}>();

const { t } = useI18n();

const color = computed(() => {
  if (props.difficulty === "Low") return "success";
  else if (props.difficulty === "Mid") return "warning";
  else if (props.difficulty === "High") return "primary";
});

const difficultyLabel = computed(() => {
  if (props.difficulty === "Low") return t("difficulty.low");
  else if (props.difficulty === "Mid") return t("difficulty.mid");
  else if (props.difficulty === "High") return t("difficulty.high");
});
</script>
