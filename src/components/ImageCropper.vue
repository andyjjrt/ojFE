<template>
  <v-sheet class="position-relative">
    <v-overlay
      contained
      persistent
      class="align-center justify-center"
      :modelValue="loading"
    >
      <v-progress-circular indeterminate color="primary" />
    </v-overlay>
    <v-file-input
      clearable
      show-size
      hide-details
      :label="t('imageCropper.selectFile')"
      variant="solo"
      accept="image/png, image/jpeg, image/bmp"
      v-model="file"
    />
    <div class="cut" v-if="file.length > 0">
      <VueCropper ref="cropper" :img="image" autoCrop fixed centerBox />
    </div>
    <v-btn
      @click="handleUpload"
      block
      v-if="file.length > 0"
      variant="elevated"
      color="info"
    >
      {{ t("imageCropper.upload") }}
    </v-btn>
  </v-sheet>
</template>

<script setup lang="ts">
import "vue-cropper/dist/index.css";
import { VueCropper } from "vue-cropper";
import { ref, watch } from "vue";
import { useUserStore } from "../store/user";
import { fetchApi } from "../utils/api";
import { useI18n } from "vue-i18n";
import Message from "vue-m-message";

const user = useUserStore();
const { t } = useI18n();

const file = ref<File[]>([]);
const image = ref();
const loading = ref(false);
const cropper = ref<InstanceType<typeof VueCropper>>();

const handleUpload = async () => {
  await cropper.value.getCropBlob(async (data: any) => {
    console.log(data);
    const form = new window.FormData();
    form.append("image", new window.File([data], "avatar.png"));
    loading.value = true;
    const response = await fetchApi("/upload_avatar", "post", {
      data: form,
    });
    loading.value = false;
    if (response.data.error) {
      Message.error(response.data.data);
    } else {
      Message.success(response.data.data);
      user.getProfile();
      file.value = [];
    }
  });
};

watch(file, (files) => {
  console.log(files);
  if (files.length > 0) {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = function () {
      image.value = reader.result;
    };
  }
});
</script>

<style scoped>
.cut {
  width: 100%;
  height: 300px;
  margin: 10px auto;
}
</style>
