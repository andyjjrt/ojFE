<template>
  <Announcement :contestId="contestId" />
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import Announcement from "../../../components/Admin/Announcement.vue";

const routes = useRoute();
const contestId = routes.params.contestId as string;
</script>
