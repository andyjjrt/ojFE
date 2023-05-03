<template>
  <v-card>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field label="Title" v-model="title" hide-details />
        </v-col>
        <v-col cols="12">
          <v-md-editor height="400px" v-model="description" />
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
          <v-text-field label="Password" hide-details v-model="password" />
        </v-col>
        <v-col cols="12" sm="4">
          <v-select
            label="Rule Type"
            :items="['ACM', 'OI']"
            hide-details
            v-model="ruleType"
          />
        </v-col>
        <v-col cols="12" sm="4">
          <v-switch label="Real Time Rank" hide-details v-model="realTimeRank" />
        </v-col>
        <v-col cols="12" sm="4">
          <v-switch label="Visible" hide-details v-model="visible" />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { DatePicker } from "v-calendar";
import "v-calendar/style.css";

const props = defineProps<{
  contest: ManagementContest;
}>();
const emits = defineEmits(["handleUpdate"]);

const _contest = computed({
  get: () => props.contest,
  set: (val: ManagementContest) => {
    emits("handleUpdate", val);
  },
});

const title = computed({
  get: () => _contest.value.title,
  set: (val) => (_contest.value = { ..._contest.value, title: val }),
});

const description = computed({
  get: () => decodeURI(_contest.value.description),
  set: (val) => {
    _contest.value = { ..._contest.value, description: encodeURI(val) };
  },
});

const startTime = computed({
  get: () => new Date(_contest.value.start_time),
  set: (val) => (_contest.value = { ..._contest.value, start_time: val.toISOString() }),
});

const endTime = computed({
  get: () => new Date(_contest.value.end_time),
  set: (val) => (_contest.value = { ..._contest.value, end_time: val.toISOString() }),
});

const password = computed({
  get: () => _contest.value.password,
  set: (val) => (_contest.value = { ..._contest.value, password: val }),
});

const ruleType = computed({
  get: () => _contest.value.rule_type,
  set: (val) => (_contest.value = { ..._contest.value, rule_type: val }),
});

const realTimeRank = computed({
  get: () => _contest.value.real_time_rank,
  set: (val) => (_contest.value = { ..._contest.value, real_time_rank: val }),
});

const visible = computed({
  get: () => _contest.value.visible,
  set: (val) => (_contest.value = { ..._contest.value, visible: val }),
});
</script>
