<template>
  <v-row>
    <v-col cols="3" v-if="mdAndUp">
      <v-card>
        <v-list navcolor="primary">
          <AdminNav icon />
        </v-list>
      </v-card>
    </v-col>
    <v-col cols="12" md="9">
      <RouterView v-slot="{ Component }">
        <v-fade-transition mode="out-in">
          <component :is="Component" />
        </v-fade-transition>
      </RouterView>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import AdminNav from "../components/Admin/Nav.vue";

const { mdAndUp } = useDisplay();
</script>
