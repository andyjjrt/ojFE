<template>
  <code-mirror
    v-model="value"
    basic
    :lang="lang"
    :extensions="isDark"
    ref="cm"
  />
</template>

<script setup lang="ts">
import { computed, ref, onMounted, type Ref } from "vue";
import CodeMirror from "vue-codemirror6";
import { EditorView } from "@codemirror/view";
import { cpp } from "@codemirror/lang-cpp";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "vuetify";

const props = defineProps<{
  modelValue: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const lang = cpp();
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
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
