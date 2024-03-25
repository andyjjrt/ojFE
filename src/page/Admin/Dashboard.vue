<template>
  <Loader v-if="loading" />
  <div v-else>
    <v-card class="pa-2 mb-4" v-if="dashboard">
      <v-row class="pa-4">
        <v-col cols="12" md="6" class="pa-0">
          <v-list density="compact" class="pa-0">
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-account" />
              </template>
              <v-list-item-title>{{ dashboard.user_count }}</v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-trophy" />
              </template>
              <v-list-item-title>
                {{ dashboard.recent_contest_count }}
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <template v-slot:prepend>
                <v-icon icon="mdi-chart-line" />
              </template>
              <v-list-item-title>
                {{ dashboard.today_submission_count }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
        <v-col cols="12" md="6" class="pa-0">
          <v-list density="compact" class="pa-0">
            <v-list-item>
              <v-list-item-title>
                <span>HTTP Status: </span>
                <v-chip
                  label
                  :color="isHTTPS ? 'success' : 'error'"
                  class="text-uppercase"
                >
                  {{ isHTTPS }}
                </v-chip>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <span>Force HTTPS: </span>
                <v-chip
                  label
                  :color="dashboard.env.FORCE_HTTPS ? 'success' : 'error'"
                  class="text-uppercase"
                >
                  {{ dashboard.env.FORCE_HTTPS }}
                </v-chip>
              </v-list-item-title>
            </v-list-item>
            <v-list-item>
              <v-list-item-title>
                <span>Static CDN: </span>
                <v-chip label color="warning">
                  {{
                    dashboard.env.STATIC_CDN_HOST === ""
                      ? "Not Used"
                      : dashboard.env.STATIC_CDN_HOST
                  }}
                </v-chip>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-col>
      </v-row>
    </v-card>
    <v-card v-if="versions">
      <v-expansion-panels variant="accordion" v-model="activateTab">
        <v-expansion-panel
          v-for="update, i in versions.update"
          :key="update.version"
          :title="update.version"
          :value="i"
        >
          <template v-slot:text>
            <li v-for="text in update.details" v-html="text"></li>
          </template>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { fetchApi } from "../../utils/api";
import Loader from "../../components/Loader.vue";

const loading = ref(false);
const activateTab = ref(0)
const dashboard = ref<DashboardInfo | null>(null);
const versions = ref<VersionInfo | null>(null);

const init = async () => {
  loading.value = true;
  const dashboardResponse = await fetchApi("/admin/dashboard_info", "get");
  const versionsResponse = await fetchApi("/admin/versions", "get");
  loading.value = false;
  dashboard.value = dashboardResponse.data.data;
  versions.value = versionsResponse.data.data;
};

const isHTTPS = computed(() => window.location.protocol == "https:");

onMounted(() => init());
</script>
