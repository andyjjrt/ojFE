<template>
  <v-card class="pa-4" :loading="loading" :disabled="loading">
    <v-row>
      <v-col cols="12">
        <v-text-field label="Title" v-model="contest.title" hide-details />
      </v-col>
      <v-col cols="12">
        <MDEditor v-model="description" />
      </v-col>
      <v-col cols="12" sm="4">
        <DatePicker mode="dateTime" :is-dark="true" v-model="startTime">
          <template #default="{ inputValue, inputEvents }">
            <v-text-field
              label="Start Time"
              hide-details
              :modelValue="inputValue"
              v-on="inputEvents"
            />
          </template>
        </DatePicker>
      </v-col>
      <v-col cols="12" sm="4">
        <DatePicker mode="dateTime" :is-dark="true" v-model="endTime">
          <template #default="{ inputValue, inputEvents }">
            <v-text-field
              label="End Time"
              hide-details
              :modelValue="inputValue"
              v-on="inputEvents"
            />
          </template>
        </DatePicker>
      </v-col>
      <v-col cols="12" sm="4">
        <v-text-field
          label="Password"
          hide-details
          v-model="contest.password"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-select
          label="Rule Type"
          :items="['ACM', 'OI']"
          hide-details
          v-model="contest.rule_type"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-switch
          label="Real Time Rank"
          hide-details
          v-model="contest.real_time_rank"
        />
      </v-col>
      <v-col cols="12" sm="4">
        <v-switch label="Visible" hide-details v-model="contest.visible" />
      </v-col>
      <v-col cols="12">
        <v-combobox
          v-model="contest.allowed_ip_ranges"
          label="Allow IP Ranges"
          multiple
          chips
        ></v-combobox>
      </v-col>
    </v-row>
    <v-card-actions class="d-flex justify-end">
      <v-btn color="primary" variant="elevated" @click="handleSave">Save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, reactive, inject } from "vue";
import { useRoute, useRouter } from "vue-router";
import { DatePicker } from "v-calendar";
import MDEditor from "../MDEditor.vue";
import "v-calendar/style.css";
import { fetchApi } from "../../utils/api";

const props = defineProps<{
  create?: boolean;
}>();

const emits = defineEmits(["handleInit"]);

const routes = useRoute();
const router = useRouter();

const contest = reactive<ManagementContest>(
  inject("contest", {
    id: -1,
    created_by: {
      id: -1,
      username: "",
      real_name: null,
    },
    status: "",
    contest_type: "",
    title: "",
    description: "",
    real_time_rank: true,
    rule_type: "OI",
    start_time: "",
    end_time: "",
    create_time: "",
    last_update_time: "",
    password: "",
    visible: true,
    allowed_ip_ranges: [],
  })
);
const loading = ref(false);
const error = ref<string | null>(null);
const contestId = routes.params.contestId;

const handleSave = async () => {
  error.value = null;
  loading.value = true;
  const response = await fetchApi(
    "/admin/contest",
    props.create ? "post" : "put",
    {
      data: contest,
    }
  );
  loading.value = false;
  if (response.data.error) {
    error.value = response.data.data;
    return;
  }
  if (props.create) {
    router.push({ name: "AdminContests" });
  }
  Object.assign(contest, response.data.data);
  emits("handleInit", response.data.data);
};

const description = computed({
  get: () => decodeURI(contest.description),
  set: (val) => {
    contest.description = encodeURI(val);
  },
});

const startTime = computed({
  get: () => new Date(contest.start_time),
  set: (val) => (contest.start_time = val.toISOString()),
});

const endTime = computed({
  get: () => new Date(contest.end_time),
  set: (val) => (contest.end_time = val.toISOString()),
});
</script>
