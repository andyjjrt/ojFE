<template>
  <div class="d-flex flex-column align-center" v-if="profile">
    <v-avatar :image="profile.avatar" size="80" class="elevation-3 ma-1" />
    <h3 class="ma-1">{{ profile.user.username }}</h3>
    <p v-if="profile.school" class="ma-1">{{ profile.school }}</p>
    <p v-if="profile.mood" class="ma-1">{{ profile.mood }}</p>
    <v-sheet color="primary" rounded="pill" class="px-6 py-4 ma-1">
      <v-row>
        <v-col class="d-flex flex-column text-center">
          <span class="text-caption">Solved</span>
          <span>{{ profile.accepted_number }}</span>
        </v-col>
        <v-col class="d-flex flex-column text-center">
          <span class="text-caption">Subnissions</span>
          <span>{{ profile.submission_number }}</span>
        </v-col>
        <v-col class="d-flex flex-column text-center">
          <span class="text-caption">Score</span>
          <span>{{ profile.total_score }}</span>
        </v-col>
      </v-row>
    </v-sheet>
    <v-btn-group variant="outlined" divided class="mt-4">
      <v-btn icon="mdi-email" :href="'mailto:' + profile.user.email" />
      <v-btn icon="mdi-web" :href="profile.blog || undefined" target="_blank" />
      <v-btn
        icon="mdi-github"
        :href="profile.github || undefined"
        target="_blank"
      />
    </v-btn-group>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUserStore } from "../store/user";
import { fetchApi } from "../utils/api";

const user = useUserStore();
const routes = useRoute();

const otherUser = ref<User | null>(null);
const loading = ref(false);

const init = async () => {
  if (routes.query.username === undefined) return;
  loading.value = true;
  const response = await fetchApi("/profile", "get", {
    params: {
      username: routes.query.username,
    },
  });
  loading.value = false;
  otherUser.value = response.data.data;
};

const profile = computed(() =>
  !routes.query.username ? user.profile : otherUser.value
);

onMounted(() => init());
</script>
