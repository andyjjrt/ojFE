import { defineStore } from "pinia";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { fetchApi } from "../utils/api";

export const useUserStore = defineStore("user", () => {
  const profile = ref<User | null>(null);
  const router = useRouter();

  const getProfile = async () => {
    const response = await fetchApi("/profile", "get");
    profile.value = response.data.data;
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

  const logout = async () => {
    const response = await fetchApi("/logout", "get");
    if (response.data.error) throw new Error(response.data.data);
    profile.value = null;
    router.push({ name: "Home" });
    await getProfile();
  };

  return { profile, getProfile, login, logout };
});
