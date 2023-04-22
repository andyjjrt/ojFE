<template>
  <code-mirror
    v-model="value"
    basic
    :lang="langPlugin"
    :extensions="isDark"
    ref="cm"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import CodeMirror from "vue-codemirror6";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "vuetify";
import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { javascript } from "@codemirror/lang-javascript";
import { rust } from "@codemirror/lang-rust";

const props = defineProps<{
  modelValue: string;
  lang: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const langPlugin = computed(() => {
  switch (props.lang) {
    case "C":
    case "C++":
      return cpp();
    case "Java":
      return java();
    case "Python2":
    case "Python3":
      return python();
    case "JavaScript":
      return javascript();
    case "Rust":
      return rust();
  }
});

const vuetifyTheme = useTheme();
const editorView = EditorView.theme({
  "&": { height: "300px" },
  "&.cm-editor.cm-focused": {
    outline: "0px",
  },
  ".cm-scroller": { overflow: "auto" },
});
const isDark = computed(() =>
  vuetifyTheme.current.value.dark ? [editorView, oneDark] : [editorView]
);
</script>
