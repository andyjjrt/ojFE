<template>
  <v-card class="pa-4" :loading="loading" :disabled="loading">
    <v-card-title>Avatar</v-card-title>
    <v-card-text>
      <ImageCropper />
    </v-card-text>
    <v-card-title>Profile</v-card-title>
    <v-row class="mb-1">
      <v-col cols="12" sm="6">
        <v-text-field
          label="Real name"
          class="mx-2"
          v-model="realName"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field label="Mood" class="mx-2" v-model="mood" hide-details />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="School"
          class="mx-2"
          v-model="school"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field label="Blog" class="mx-2" v-model="blog" hide-details />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field label="Major" class="mx-2" v-model="major" hide-details />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="Github"
          class="mx-2"
          v-model="github"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-select
          label="Language"
          class="mx-2"
          v-model="language"
          :items="availableLocales"
          hide-details
        />
      </v-col>
    </v-row>
    <v-card-actions class="justify-end">
      <v-btn
        color="primary"
        variant="elevated"
        :loading="loading"
        @click="handleUpdate"
      >
        Save
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import Message from "vue-m-message";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";
import ImageCropper from "../../components/ImageCropper.vue";

const user = useUserStore();
const profile = computed(() => user.profile);
const { t, availableLocales } = useI18n({ useScope: "global" });

const loading = ref(false);

const realName = ref(profile.value?.real_name || "");
const mood = ref(profile.value?.mood || "");
const school = ref(profile.value?.school || "");
const blog = ref(profile.value?.blog || "");
const major = ref(profile.value?.major || "");
const github = ref(profile.value?.github || "");
const language = ref(profile.value?.language);

const handleUpdate = async () => {
  loading.value = true;
  const response = await fetchApi("/profile", "put", {
    data: {
      real_name: realName.value === "" ? undefined : realName.value,
      mood: mood.value === "" ? undefined : mood.value,
      school: school.value === "" ? undefined : school.value,
      blog: blog.value === "" ? undefined : blog.value,
      major: major.value === "" ? undefined : major.value,
      github: github.value === "" ? undefined : github.value,
      language: language.value === null ? undefined : language.value,
    },
  });
  loading.value = false;
  if (response.data.error) {
    // error handling
  } else {
    Message.success("Success");
    user.getProfile();
  }
};
</script>
