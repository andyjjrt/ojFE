<template>
  <vue-monaco-editor
    :height="height ? `${height}px` : '300px'"
    v-model:value="value"
    :theme="currentTheme"
    :options="MONACO_EDITOR_OPTIONS"
    :language="lang"
    @mount="handleMount"
  />
</template>

<script setup lang="ts">
import { shallowRef, computed } from "vue";
import { useTheme } from "vuetify";

const props = defineProps<{
  modelValue: string;
  lang: string;
  readOnly?: boolean;
  height?: number
}>();
const emit = defineEmits(["update:modelValue"]);

const MONACO_EDITOR_OPTIONS = {
  automaticLayout: true,
  formatOnType: true,
  formatOnPaste: true,
  scrollBeyondLastLine: false,
  minimap: { enabled: false },
  readOnly: props.readOnly ? true : false,
  domReadOnly: props.readOnly ? true : false
};

const value = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

const editorRef = shallowRef();
const vuetifyTheme = useTheme();
const currentTheme = computed(() =>
  vuetifyTheme.global.name.value === "dark" ? "vs-dark" : "vs"
);

const lang = computed(() => {
  switch (props.lang) {
    case "C":
    case "C++":
      return "cpp";
    case "Java":
      return "java";
    case "Python2":
    case "Python3":
      return "python";
    case "JavaScript":
      return "javascript";
    case "Golang":
      return "go";
    case "Rust":
      return "rust";
    default:
      return "text";
  }
});

const handleMount = (editor: any) => (editorRef.value = editor);
</script>
