<template>
  <v-btn color="primary" @click="open" v-if="user.profile === null"
    >login</v-btn
  >
  <v-menu v-else>
    <template v-slot:activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar>
          <v-img :src="user.profile.avatar" alt="John"></v-img>
        </v-avatar>
      </v-btn>
    </template>
    <v-list>
      <v-list-item @click="user.logout()">
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>

  <v-dialog width="auto" v-model="dialog">
    <v-card width="400px">
      <v-tabs v-model="tab" bg-color="primary">
        <v-tab value="Login">Login</v-tab>
        <v-tab value="Register">Register</v-tab>
      </v-tabs>
      <v-card-text>
        <v-window v-model="tab">
          <v-window-item value="Login">
            <v-form @submit.prevent="handleSubmit" class="pa-2">
              <v-text-field
                label="username"
                v-model="username"
                clearable
                hide-details="auto"
                class="mb-4"
              />
              <v-text-field
                label="password"
                v-model="password"
                clearable
                hide-details="auto"
                type="password"
                class="mb-4"
              />
              <v-alert
                v-if="errorMessage"
                class="mb-4"
                color="error"
                :text="errorMessage"
              ></v-alert>
              <div class="d-flex justify-end">
                <v-btn :loading="loading" @click="handleSubmit">Login</v-btn>
              </div>
            </v-form>
          </v-window-item>
          <v-window-item value="Register"> Register </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useUserStore } from "../store/user";

const user = useUserStore();
const tab = ref("one");
const dialog = ref(false);

const username = ref("");
const password = ref("");

const loading = ref(false);
const errorMessage = ref<string | null>(null);

const open = () => (dialog.value = true);

const handleSubmit = async () => {
  errorMessage.value = null;
  loading.value = true;
  await user
    .login(username.value, password.value)
    .then(() => (dialog.value = false))
    .catch((err) => {
      errorMessage.value = err.message;
      console.log(err);
    });
  loading.value = false;
};

watch(dialog, () => (errorMessage.value = null));
</script>
