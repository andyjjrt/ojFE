<template>
  <v-dialog v-model="open" scrollable max-width="900" :persistent="loading">
    <template v-slot:activator="dialog">
      <v-tooltip text="Make Problem Public" location="top">
        <template v-slot:activator="{ props }">
          <v-btn
            @click.stop.prevent=""
            v-bind="{ ...props, ...dialog.props }"
            :class="class"
            variant="text"
            icon
            size="small"
          >
            <v-icon icon="mdi-monitor-share" />
          </v-btn>
        </template>
      </v-tooltip>
    </template>
    <v-card :disabled="loading">
      <v-toolbar color="primary" title="Make Problem Public" />
      <v-card-text>
        <v-text-field
          label="Display ID for the problem"
          hide-details
          v-model="displayId"
        />
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn variant="text" @click="open = false"> Close </v-btn>
        <v-btn variant="elevated" color="primary" @click="handleAdd">
          Add
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, inject, computed, onMounted, watch } from "vue";
import { fetchApi } from "../../utils/api";
import Datagrid from "../Datagrid.vue";
import Message from "vue-m-message";
import { emit } from "process";

const props = withDefaults(
  defineProps<{
    class: string;
    problemId: number;
  }>(),
  { class: "" }
);

const emits = defineEmits(["handleAdded"]);

const open = ref(false);
const contest = inject<ManagementContest>("contest", {
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
});
const loading = ref(false);
const error = ref<string | null>(null);
const displayId = ref("");

const handleAdd = async () => {
  loading.value = true;
  const response = await fetchApi(
    "/admin/contest_problem/make_public",
    "post",
    {
      data: {
        id: props.problemId,
        display_id: displayId.value,
      },
    }
  );
  loading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  } else {
    Message.success("Success");
    open.value = false;
    emits("handleAdded");
  }
};

watch(open, () => {
  displayId.value = "";
});
</script>
