<template>
  <v-layout>
    <v-main>
      <v-container>
        <form>
          <v-text-field
            label="Password"
            v-model="password"
            clearable
            hide-details="auto"
            type="password"
            class="mb-4"
          />
          <v-text-field
            label="Comfirm Password"
            v-model="passwordComfirm"
            clearable
            hide-details="auto"
            type="password"
            class="mb-4"
          />
          <div class="d-flex align-center">
            <v-text-field
              label="Captcha"
              v-model="captcha"
              clearable
              hide-details="auto"
              class="mb-4 flex align-center"
            />
            <v-img :src="captchaImage" lazy-src="/vite.svg" class="ms-4" />
          </div>
          <v-alert
            v-if="errorMessage"
            class="mb-4"
            color="error"
            :text="errorMessage"
          ></v-alert>
          <div class="d-flex justify-space-between align-center">
            <a role="button" class="text-primary" @click="tab = 'Login'">
              Got Password?
            </a>
            <v-btn
              :loading="loading"
              color="primary"
              variant="elevated"
              @click="handleResetPassword"
            >
              Send email
            </v-btn>
          </div>
        </form>
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup></script>
