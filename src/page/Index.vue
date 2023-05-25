<template>
  <div>
    <v-card class="mb-4" v-if="contests.length > 0">
      <v-window v-model="window" show-arrows>
        <v-window-item v-for="contest in contests" :key="contest.id">
          <RouterLink
            :to="`/contest/${contest.id}`"
            class="text-decoration-none"
          >
            <v-sheet class="pa-6">
              <h2 class="mb-1 mx-2">
                {{ contest.title }}
              </h2>
              <v-chip color="primary" class="me-1">
                <v-icon icon="mdi-calendar-blank" class="me-1" />
                {{ getDate(contest.start_time, mobile) }}
              </v-chip>
              <v-chip color="warning">
                <v-icon icon="mdi-trophy" class="me-1" />
                {{ contest.rule_type }}
              </v-chip>
            </v-sheet>
          </RouterLink>
        </v-window-item>
      </v-window>
    </v-card>
    <Announcements />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import useDate from "../hooks/useDate";
import { useDisplay } from "vuetify";
import Announcements from "../components/Announcements.vue";
import { fetchApi } from "../utils/api";

const { getDate } = useDate();
const { mobile } = useDisplay();

const window = ref(0);
const loading = ref(false);
const contests = ref<Contest[]>([]);

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/contests", "get", {
    params: {
      offset: 0,
      limit: 5,
      status: 1,
    },
  });
  loading.value = false;
  contests.value = response.data.data.results;
};

onMounted(() => {
  init();
});
</script>
