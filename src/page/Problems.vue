<template>
  <v-row>
    <v-col md="8" lg="9"><Problems /></v-col>
    <v-col md="4" lg="3" v-if="mdAndUp"><Tags /></v-col>
  </v-row>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import Problems from "../components/Problems.vue";
import Tags from "../components/Tags.vue";

const { mdAndUp } = useDisplay();
</script>
