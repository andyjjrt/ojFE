<template>
  <div>
    <v-card class="pa-4 mb-4" :loading="smtpLoading" :disabled="smtpLoading">
      <v-card-title>SMTP Setting</v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field hideDetails v-model="smtp.server" label="Server" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field hideDetails v-model="smtp.port" label="Port" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field hideDetails v-model="smtp.email" label="Email" />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              hideDetails
              v-model="smtp.password"
              label="Password"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-switch hideDetails v-model="smtp.tls" label="TLS" />
          </v-col>
          <v-col cols="12">
            <v-text-field
              hideDetails
              v-model="email"
              label="Test Email"
              appendInnerIcon="mdi-send"
              @click:append-inner="handleSendTestEmail"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" variant="elevated" @click="handleSaveSmtp"
          >Save</v-btn
        >
      </v-card-actions>
    </v-card>
    <v-card class="pa-4" :loading="websiteLoading" :disabled="websiteLoading">
      <v-card-title>Website Setting</v-card-title>
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <v-text-field
              hideDetails
              v-model="website.website_base_url"
              label="Base Url"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              hideDetails
              v-model="website.website_name"
              label="Name"
            />
          </v-col>
          <v-col cols="12" sm="4">
            <v-text-field
              hideDetails
              v-model="website.website_name_shortcut"
              label="Short Name"
            />
          </v-col>
          <v-col cols="12">
            <v-textarea
              hideDetails
              v-model="website.website_footer"
              label="Footer"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-switch
              hideDetails
              v-model="website.allow_register"
              label="Allow Register"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-switch
              hideDetails
              v-model="website.submission_list_show_all"
              label="Allow Register"
            />
          </v-col>
        </v-row>
      </v-container>
      <v-card-actions class="d-flex justify-end">
        <v-btn color="primary" variant="elevated" @click="handleSaveWebsite">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from "vue";
import { fetchApi } from "../../utils/api";
import Message from "vue-m-message";

const smtp = reactive({
  tls: false,
  port: 587,
  email: "",
  server: "",
  password: "",
});
const website = reactive({
  website_base_url: "",
  website_name: "OnlineJudge",
  website_name_shortcut: "OJ",
  website_footer: "",
  allow_register: true,
  submission_list_show_all: true,
});
const smtpLoading = ref(false);
const websiteLoading = ref(false);
const email = ref("");

const initSmtp = async () => {
  smtpLoading.value = true;
  const response = await fetchApi("/admin/smtp", "get");
  smtpLoading.value = false;
  Object.assign(smtp, { ...response.data.data, password: "" });
};

const handleSaveSmtp = async () => {
  smtpLoading.value = true;
  const response = await fetchApi("/admin/smtp", "post", { data: smtp });
  smtpLoading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  } else {
    Message.success("Success");
    initSmtp();
  }
};

const initWebsite = async () => {
  websiteLoading.value = true;
  const response = await fetchApi("/admin/website", "get");
  websiteLoading.value = false;
  Object.assign(website, response.data.data);
};

const handleSaveWebsite = async () => {
  websiteLoading.value = true;
  const response = await fetchApi("/admin/website", "post", { data: website });
  websiteLoading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  } else {
    Message.success("Success");
    initWebsite();
  }
};

const handleSendTestEmail = async () => {
  smtpLoading.value = true;
  const response = await fetchApi("/admin/smtp_test", "post", {
    data: { email: email.value },
  });
  smtpLoading.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
  }else {
    Message.success("Test mail sent")
  }
};

onMounted(() => {
  initSmtp();
  initWebsite();
});
</script>
