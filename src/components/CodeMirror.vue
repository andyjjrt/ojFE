<template>
  <code-mirror
    v-model="value"
    basic
    :lang="(langPlugin as LanguageSupport)"
    :extensions="isDark"
    ref="cm"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import CodeMirror from "vue-codemirror6";
import { LanguageSupport } from "@codemirror/language";
import { EditorView } from "@codemirror/view";
import { oneDark } from "@codemirror/theme-one-dark";
import { useTheme } from "vuetify";
import { cpp } from "@codemirror/lang-cpp";

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

const langPlugin = ref<LanguageSupport>(cpp());

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

watch(
  () => props.lang,
  async (val) => {
    switch (val) {
      case "C":
      case "C++":
        const { cpp } = await import("@codemirror/lang-cpp");
        langPlugin.value = cpp();
        return;
      case "Java":
        const { java } = await import("@codemirror/lang-java");
        langPlugin.value = java();
        return;
      case "Python2":
      case "Python3":
        const { python } = await import("@codemirror/lang-python");
        langPlugin.value = python();
        return;
      case "Javascript":
        const { javascript } = await import("@codemirror/lang-javascript");
        langPlugin.value = javascript();
        return;
      case "Rust":
        const { rust } = await import("@codemirror/lang-rust");
        langPlugin.value = rust();
        return;
    }
  }
);
</script>
