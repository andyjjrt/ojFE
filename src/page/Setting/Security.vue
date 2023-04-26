<template>
  <v-card class="pa-4">
    <v-card-title>Sessions</v-card-title>
    <Datagrid
      :data="sessions"
      :loading="loading"
      :total="sessions.length"
      :page="1"
      :rows-per-page="1"
      hidePagination
    >
      <template v-slot="{ data }: { data: Session[] }">
        <v-list lines="two" density="compact">
          <template v-for="item in data">
            <v-list-item v-if="item.current_session">
              <v-list-item-title>
                <v-chip color="success" density="compact" label>{{
                  item.ip
                }}</v-chip>
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ ua(item.user_agent) }}
              </v-list-item-subtitle>
              <template v-slot:append>
                {{ getDate(item.last_activity, mobile) }}
              </template>
            </v-list-item>
            <v-dialog width="auto" :disabled="revokeLoading" v-else>
              <template v-slot:activator="{ props }">
                <v-list-item v-bind="props">
                  <v-list-item-title>
                    {{ item.ip }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ ua(item.user_agent) }}
                  </v-list-item-subtitle>
                  <template v-slot:append>
                    {{ getDate(item.last_activity, mobile) }}
                  </template>
                </v-list-item>
              </template>
              <template v-slot:default="{ isActive }">
                <v-card :loading="revokeLoading" :disabled="revokeLoading">
                  <v-toolbar color="warning" title="Warning" />
                  <v-card-text>
                    Are you sure to revoke the session?
                  </v-card-text>
                  <v-card-actions class="justify-end">
                    <v-btn variant="text" @click="isActive.value = false">
                      Close
                    </v-btn>
                    <v-btn
                      variant="elevated"
                      color="warning"
                      @click="() => handleRevoke(isActive, item.session_key)"
                    >
                      Revoke
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </template>
            </v-dialog>
          </template>
        </v-list>
      </template>
    </Datagrid>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import Datagrid from "../../components/Datagrid.vue";
import { fetchApi } from "../../utils/api";
import useDate from "../../hooks/useDate";
import { useDisplay } from "vuetify";
import parser from "ua-parser-js";
import { Ref } from "vue";

const { getDate } = useDate();
const { mobile } = useDisplay();

const sessions = ref<Session[]>([]);
const loading = ref(false);
const revokeLoading = ref(false);

const init = async () => {
  loading.value = true;
  const response = await fetchApi("/sessions", "get");
  loading.value = false;
  if (response.data.error) {
    // error handling
  }
  sessions.value = response.data.data.sort((a: Session, b: Session) => {
    return (
      new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
    );
  });
};

const handleRevoke = async (isActive: Ref<boolean>, sessionId: string) => {
  revokeLoading.value = true;
  const response = await fetchApi("/sessions", "delete", {
    params: {
      session_key: sessionId,
    },
  });
  revokeLoading.value = false;
  isActive.value = false;
  if (response.data.error) {
    // error handling
  } else {
    init();
  }
};

const ua = computed(() => {
  return (uaString: string) => {
    const browser = parser(uaString).browser;
    return `${browser.name} ${browser.version}`;
  };
});

onMounted(() => init());
</script>
