import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { i18n } from "../plugins/vuetify";
import { useRouter } from "vue-router";
import { fetchApi } from "../utils/api";

export const useUserStore = defineStore("user", () => {
  const profile = ref<User | null>(null);
  const isReady = ref(false);

  const isAdmin = computed(
    () => profile.value?.user.admin_type.includes("Admin") || false
  );

  const getProfile = async () => {
    const response = await fetchApi("/profile", "get");
    profile.value = response.data.data;
    i18n.global.locale.value =
      (profile.value?.language as "en" | "zh-TW") || "en";
    isReady.value = true;
  };

  const login = async (
    username: string,
    password: string,
    tfa_code?: string
  ) => {
    const response = await fetchApi("/login", "post", {
      data: {
        username,
        password,
        tfa_code,
      },
    });
    if (response.data.error) throw new Error(response.data.data);
    await getProfile();
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    captcha: string
  ) => {
    const response = await fetchApi("/register", "post", {
      data: {
        username,
        email,
        password,
        captcha,
      },
    });
    if (response.data.error) throw new Error(response.data.data);
  };

  const logout = async () => {
    const response = await fetchApi("/logout", "get");
    if (response.data.error) throw new Error(response.data.data);
    profile.value = null;
    // router.push({ name: "Home" });
    await getProfile();
  };

  return { profile, isReady, isAdmin, getProfile, login, register, logout };
});
