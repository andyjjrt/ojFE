<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-card
        class="pa-4"
        :loading="passwordLoading"
        :disabled="passwordLoading"
      >
        <v-card-title>Change Password</v-card-title>
        <v-row class="mb-1">
          <v-col cols="12">
            <v-text-field
              label="Old Password"
              class="mx-2"
              type="password"
              v-model="oldPassword"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="New Password"
              class="mx-2"
              type="password"
              v-model="newPassword"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Comfirm Password"
              class="mx-2"
              type="password"
              v-model="comfirmPassword"
              hide-details
            />
          </v-col>
        </v-row>
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            variant="elevated"
            :loading="passwordLoading"
            @click="handleChangePassword"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
    <v-col cols="12" md="6">
      <v-card class="pa-4" :loading="emailLoading" :disabled="emailLoading">
        <v-card-title>Change email</v-card-title>
        <v-row class="mb-1">
          <v-col cols="12">
            <v-text-field
              label="Old Email"
              class="mx-2"
              disabled
              v-model="oldEmail"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="New Email"
              class="mx-2"
              v-model="newEmail"
              hide-details
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              label="Password"
              class="mx-2"
              type="password"
              v-model="emailPassword"
              hide-details
            />
          </v-col>
        </v-row>
        <v-card-actions class="justify-end">
          <v-btn
            color="primary"
            variant="elevated"
            :loading="emailLoading"
            @click="handleChangeEmail"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Message from "vue-m-message";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";

const user = useUserStore();
const profile = computed(() => user.profile);

const passwordLoading = ref(false);
const emailLoading = ref(false);

const oldPassword = ref("");
const newPassword = ref("");
const comfirmPassword = ref("");

const emailPassword = ref("");
const oldEmail = computed(() => profile.value?.user.email || "");
const newEmail = ref("");

const handleChangePassword = async () => {
  if (newPassword.value !== comfirmPassword.value) {
    Message.error("Password not matched");
    return;
  }
  passwordLoading.value = true;
  const response = await fetchApi("/change_password", "post", {
    data: {
      new_password: newPassword.value,
      old_password: oldPassword.value,
    },
  });
  passwordLoading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  } else {
    Message.success("Success, logout soon...");
    user.logout();
  }
};

const handleChangeEmail = async () => {
  emailLoading.value = true;
  const response = await fetchApi("/change_email", "post", {
    data: {
      password: emailPassword.value,
      old_email: oldEmail.value,
      new_email: newEmail.value,
    },
  });
  emailLoading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  } else {
    Message.success("Success, logout soon...");
    user.logout();
  }
};
</script>
