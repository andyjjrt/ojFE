import { defineStore } from "pinia";
import { ref } from "vue";
import { fetchApi } from "../utils/api";
import { computed } from "vue";

export const useConstantsStore = defineStore("constants", () => {
  const website = ref<Website | null>(null);
  const languages = ref<Language[] | null>(null);

  const isReady = computed(
    () => website.value !== null && languages.value !== null
  );

  const fetchWebsite = async () => {
    const response = await fetchApi("/website", "get");
    website.value = response.data.data as Website;
  };

  const fetchLanguages = async () => {
    const response = await fetchApi("/languages", "get");
    languages.value = response.data.data.languages as Language[];
  };

  const init = async () => {
    await fetchWebsite();
    await fetchLanguages();
  };

  return { website, languages, isReady, init };
});
