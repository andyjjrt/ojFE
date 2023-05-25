<template>
  <v-md-editor
    height="400px"
    v-model="value"
    :toolbar="toolBar"
    :disabled-menus="[]"
    @upload-image="handleUploadImage"
    left-toolbar="undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image code tip Katex"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { fetchApi } from "../utils/api";
import Message from "vue-m-message";

const toolBar = {
  Katex: {
    title: "Katex",
    icon: "mdi mdi-math-integral-box",
    action(editor: any) {
      editor.insert((selected: any) => {
        const prefix = "$";
        const suffix = "$";
        const placeholder = "Katex";
        const content = selected || placeholder;

        return {
          text: `${prefix}${content}${suffix}`,
          selected: content,
        };
      });
    },
  },
};

const handleUploadImage = async (
  event: Event,
  insertImage: (info: {
    url: string;
    desc: string;
    width: string;
    height: string;
  }) => void,
  files: FileList
) => {
  let formData = new FormData();
  formData.append("original_filename", files[0].name);
  formData.append("image", files[0]);
  const response = await fetchApi("/admin/upload_image", "post", {
    data: formData,
  });
  if (response.data.success) {
    Message.success("Uploaded");
    insertImage({
      url: response.data.file_path,
      desc: files[0].name,
      width: "auto",
      height: "auto",
    });
  }
};

const props = defineProps<{
  modelValue: string;
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
</script>
