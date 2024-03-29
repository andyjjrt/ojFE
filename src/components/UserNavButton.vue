<template>
  <template v-if="user.profile === null">
    <v-btn color="primary" @click="open"> {{ t("login") }} </v-btn>
    <ThemeButton />
  </template>
  <v-menu v-else>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar color="surface-variant">
          <v-img :src="user.profile.avatar" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-subheader>{{ user.profile.user.username }}</v-list-subheader>
      <v-list-item
        :to="{
          name: 'User',
        }"
      >
        <v-list-item-title>{{ t("userHome.title") }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        :to="{
          name: 'Submissions',
          query: {
            myself: 1,
          },
        }"
      >
        <v-list-item-title>{{ t("submission.title") }}</v-list-item-title>
      </v-list-item>
      <v-list-item
        :to="{
          name: 'Setting',
        }"
      >
        <v-list-item-title>{{ t("setting.title") }}</v-list-item-title>
      </v-list-item>
      <ThemeButton>
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <v-list-item-title>{{ t("theme.title") }}</v-list-item-title>
          </v-list-item>
        </template>
      </ThemeButton>
      <v-divider />
      <v-list-item @click="handleLogout">
        <v-list-item-title>{{ t("logout") }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-dialog max-width="400" :persistent="loading" v-model="dialog">
    <v-card :loading="loading" :disabled="loading">
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="Login">{{ t("login") }}</v-tab>
        <v-tab value="Register">{{ t("register") }}</v-tab>
      </v-tabs>
      <v-card-text class="px-2">
        <v-window v-model="tab">
          <v-window-item value="Login">
            <form class="pa-2" @submit.prevent="handleSubmit">
              <v-text-field
                :label="t('userNavigationButton.username')"
                v-model="username"
                clearable
                hide-details="auto"
                class="mb-4"
                @blur="handleDetect2FA"
              />
              <v-text-field
                :label="t('userNavigationButton.password')"
                v-model="password"
                clearable
                hide-details="auto"
                type="password"
                class="mb-4"
              />
              <v-text-field
                :label="t('userNavigationButton.2fa')"
                v-model="twoFA"
                clearable
                hide-details="auto"
                class="mb-4"
                v-if="twoFARequired"
              />
              <v-alert
                v-if="errorMessage"
                class="mb-4"
                color="error"
                :text="errorMessage"
              ></v-alert>
              <div class="d-flex justify-space-between align-center">
                <a
                  role="button"
                  class="text-primary"
                  @click="tab = 'ResetPassword'"
                >
                  {{ t("userNavigationButton.forgetPassword") }}?
                </a>
                <v-btn
                  :loading="loading"
                  color="primary"
                  variant="elevated"
                  type="submit"
                >
                  {{ t("login") }}
                </v-btn>
              </div>
            </form>
          </v-window-item>
          <v-window-item value="Register">
            <form class="pa-2" @submit.prevent="handleRegister">
              <v-text-field
                :label="t('userNavigationButton.username')"
                v-model="registerUsername"
                clearable
                hide-details="auto"
                class="mb-4"
              />
              <v-text-field
                :label="t('userNavigationButton.email')"
                v-model="registerEmail"
                clearable
                hide-details="auto"
                class="mb-4"
              />
              <v-text-field
                :label="t('userNavigationButton.password')"
                v-model="registerPassword"
                clearable
                hide-details="auto"
                type="password"
                class="mb-4"
              />
              <v-text-field
                :label="t('userNavigationButton.comfirmPassword')"
                v-model="registerPasswordComfirm"
                clearable
                hide-details="auto"
                type="password"
                class="mb-4"
              />
              <div class="d-flex align-center">
                <v-text-field
                  :label="t('userNavigationButton.captcha')"
                  v-model="registerCaptcha"
                  clearable
                  hide-details="auto"
                  class="mb-4 flex align-center"
                />
                <v-img :src="captchaImage" class="ms-4" />
              </div>
              <v-alert
                v-if="errorMessage"
                class="mb-4"
                color="error"
                :text="errorMessage"
              ></v-alert>
              <div class="d-flex justify-end">
                <v-btn
                  :loading="loading"
                  color="primary"
                  variant="elevated"
                  type="submit"
                >
                  {{ t("register") }}
                </v-btn>
              </div>
            </form>
          </v-window-item>
          <v-window-item value="ResetPassword">
            <form class="pa-2" @submit.prevent="handleResetPassword">
              <v-text-field
                :label="t('userNavigationButton.email')"
                v-model="resetPasswordEmail"
                clearable
                hide-details="auto"
                class="mb-4"
              />
              <div class="d-flex align-center">
                <v-text-field
                  :label="t('userNavigationButton.captcha')"
                  v-model="resetPasswordCaptcha"
                  clearable
                  hide-details="auto"
                  class="mb-4 flex align-center"
                />
                <v-img :src="captchaImage" class="ms-4" />
              </div>
              <v-alert
                v-if="errorMessage"
                class="mb-4"
                color="error"
                :text="errorMessage"
              ></v-alert>
              <div class="d-flex justify-space-between align-center">
                <a role="button" class="text-primary" @click="tab = 'Login'">
                  {{ t("userNavigationButton.gotPassword") }}?
                </a>
                <v-btn
                  :loading="loading"
                  color="primary"
                  variant="elevated"
                  type="submit"
                >
                  {{ t("userNavigationButton.sendEmail") }}
                </v-btn>
              </div>
            </form>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "../store/user";
import { useI18n } from "vue-i18n";
import ThemeButton from "./ThemeButton.vue";
import { fetchApi } from "../utils/api";
import Message from "vue-m-message";
import { useRouter } from "vue-router";

const router = useRouter();
const user = useUserStore();
const { t } = useI18n();

const tab = ref("Login");
const dialog = ref(false);
const username = ref("");
const password = ref("");
const twoFA = ref("");
const twoFARequired = ref(false);

const registerUsername = ref("");
const registerEmail = ref("");
const registerPassword = ref("");
const registerPasswordComfirm = ref("");
const registerCaptcha = ref("");

const resetPasswordEmail = ref("");
const resetPasswordCaptcha = ref("");

const captchaImage = ref("");

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const open = () => (dialog.value = true);

const handleSubmit = async () => {
  errorMessage.value = null;
  loading.value = true;
  try {
    await user.login(
      username.value,
      password.value,
      twoFA.value === "" ? undefined : twoFA.value
    );
    loading.value = false;
    dialog.value = false;
  } catch (e: any) {
    loading.value = false;
    errorMessage.value = e.message;
  }
};

const handleRegister = async () => {
  if (
    registerPassword.value === "" ||
    registerPassword.value !== registerPasswordComfirm.value
  ) {
    errorMessage.value = "Password not matched";
    return;
  }
  errorMessage.value = null;
  loading.value = true;
  try {
    await user.register(
      registerUsername.value,
      registerEmail.value,
      registerPassword.value,
      registerCaptcha.value
    );
    loading.value = false;
    Message.success("Success!");
    dialog.value = false;
  } catch (e: any) {
    loading.value = false;
    errorMessage.value = e.message;
    handleGetCaptchaImage();
  }
};

const handleResetPassword = async () => {
  loading.value = true;
  const response = await fetchApi("/apply_reset_password", "post", {
    data: {
      email: resetPasswordEmail.value,
      captcha: resetPasswordCaptcha.value,
    },
  });
  loading.value = false;
  if (response.data.error) {
    errorMessage.value = response.data.data;
  } else {
    Message.success("Mail sent");
    dialog.value = false;
  }
};

const handleGetCaptchaImage = async () => {
  captchaImage.value = "";
  const response = await fetchApi("/captcha", "get");
  captchaImage.value = response.data.data;
};

const handleDetect2FA = async () => {
  const response = await fetchApi("/tfa_required", "post", {
    data: {
      username: username.value,
    },
  });
  twoFARequired.value = response.data.data.result;
  twoFA.value = "";
};

const handleLogout = () => {
  router.push({ name: "Home" });
  user.logout()
}

watch(dialog, (newVal) => {
  if (!newVal) {
    errorMessage.value = null;
    loading.value = false;
    tab.value = "Login";
    username.value = "";
    password.value = "";
    twoFA.value = "";
    twoFARequired.value = false;
    registerUsername.value = "";
    registerEmail.value = "";
    registerPassword.value = "";
    registerPasswordComfirm.value = "";
    registerCaptcha.value = "";
    resetPasswordCaptcha.value = "";
    resetPasswordEmail.value = "";
  }
});
watch(tab, (newVal) => {
  errorMessage.value = null;
  if (newVal !== "Login") {
    handleGetCaptchaImage();
  } else {
    captchaImage.value = "";
  }
});
</script>
