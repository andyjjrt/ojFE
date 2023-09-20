<template>
  <div class="d-flex justify-center pa-6">
    <v-card
      :loading="loading"
      :disabled="loading"
      class="flex-grow-1"
      max-width="400px"
      tag="form"
      @submit.prevent="handleResetPassword"
      v-if="!resetSuccess"
    >
      <v-toolbar color="primary" title="Reset Password" />
      <v-card-text class="px-2">
        <v-text-field
          label="New Password"
          v-model="password"
          clearable
          hide-details="auto"
          type="password"
          class="mb-4"
        />
        <v-text-field
          label="Comfirm New Password"
          v-model="passwordAgain"
          clearable
          hide-details="auto"
          type="password"
          class="mb-4"
        />
        <div class="d-flex align-center mb-4">
          <v-text-field
            label="Captcha"
            v-model="captcha"
            clearable
            hide-details="auto"
            class="flex align-center"
          />
          <v-img
            :src="captchaImage"
            class="ms-4"
            @click="handleGetCaptchaImage"
          />
        </div>
        <v-alert
          v-if="errorMessage"
          color="error"
          :text="errorMessage"
        ></v-alert>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn type="submit" color="primary" variant="elevated">Reset</v-btn>
      </v-card-actions>
    </v-card>
    <v-alert
      v-else
      type="success"
      text="Successfully reset your password, you may close this page now."
    ></v-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import Message from "vue-m-message";
import { fetchApi } from "../utils/api";

const routes = useRoute();

const password = ref("");
const passwordAgain = ref("");
const captcha = ref("");
const captchaImage = ref("");
const errorMessage = ref("");

const loading = ref(false);
const resetSuccess = ref(false);

const handleGetCaptchaImage = async () => {
  captchaImage.value = "";
  const response = await fetchApi("/captcha", "get");
  captchaImage.value = response.data.data;
};

const handleResetPassword = async () => {
  if (password.value === "" || password.value !== passwordAgain.value) {
    errorMessage.value = "Password not matched";
    return;
  }
  errorMessage.value = "";
  loading.value = true;
  const data = await fetchApi("/reset_password", "post", {
    data: {
      captcha: captcha.value,
      password: password.value,
      passwordAgain: passwordAgain.value,
      token: routes.params.token,
    },
  });
  loading.value = false;
  if (data.data.error) {
    Message.error(`${data.data.error}: ${data.data.data}`);
    handleGetCaptchaImage();
  } else {
    resetSuccess.value = true;
  }
};

onMounted(() => {
  handleGetCaptchaImage();
});
</script>
