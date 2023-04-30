<template>
  <v-card class="pa-4" :loading="loading" :disabled="loading">
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
import Message from "vue-m-message";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";

const user = useUserStore();
const profile = computed(() => user.profile);

const loading = ref(false);

const realName = ref(profile.value?.real_name || "");
const mood = ref(profile.value?.mood || "");
const school = ref(profile.value?.school || "");
const blog = ref(profile.value?.blog || "");
const major = ref(profile.value?.major || "");
const github = ref(profile.value?.github || "");

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
