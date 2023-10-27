<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Users</v-card-title>
      <div class="d-flex align-center w-50" v-if="!error">
        <form class="flex-grow-1" @submit.prevent="() => handleAction(true)">
          <v-text-field
            v-model="keyword"
            density="compact"
            variant="solo"
            label="keyword..."
            append-inner-icon="mdi-magnify"
            single-line
            hide-details
            @click:append-inner="() => handleAction(true)"
          ></v-text-field>
        </form>
      </div>
    </div>
    <ErrorMessage :message="error" v-if="error" class="mx-4" />
    <Datagrid
      :data="users"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
      v-else
    >
      <template v-slot="{ data }: { data: ManagementUser[] }">
        <v-list lines="one" density="compact">
          <template v-for="item in data">
            <v-list-item
              :title="item.username"
              @click="() => handleOpenDialog(item)"
            >
              <template v-slot:append>
                {{ getDate(item.create_time, false) }}
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
    </Datagrid>
    <v-dialog
      scrollable
      max-width="900"
      v-model="dialog"
      :persistent="dialogLoading"
    >
      <v-card
        :loading="dialogLoading"
        :disabled="dialogLoading"
        tag="form"
        @submit.prevent="handleUpdateUser"
      >
        <v-toolbar color="primary" title="User" />
        <v-card-text class="pa-0">
          <v-container fluid>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-details
                  label="Username"
                  v-model="updateUser.username"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-details
                  label="Email"
                  v-model="updateUser.email"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-details
                  label="Real Name"
                  v-model="updateUser.real_name"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  hide-details
                  label="Password"
                  v-model="password"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  hide-details
                  label="User Type"
                  v-model="updateUser.admin_type"
                  :items="['Regular User', 'Admin', 'Super Admin']"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" v-if="updateUser.admin_type === 'Admin'">
                <v-select
                  hide-details
                  label="Problem Permission"
                  v-model="updateUser.problem_permission"
                  :items="['None', 'Own', 'All']"
                ></v-select>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="4" class="py-0">
                <v-switch
                  hide-details
                  label="TFA"
                  density="compact"
                  v-model="updateUser.two_factor_auth"
                ></v-switch>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <v-switch
                  hide-details
                  label="Open API"
                  density="compact"
                  v-model="updateUser.open_api"
                ></v-switch>
              </v-col>
              <v-col cols="12" sm="4" class="py-0">
                <v-switch
                  hide-details
                  label="Disabled"
                  density="compact"
                  v-model="updateUser.is_disabled"
                ></v-switch>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="dialog = false"> Close </v-btn>
          <v-dialog max-width="600">
            <template v-slot:activator="{ props }">
              <v-btn variant="elevated" color="warning" v-bind="props">
                Delete
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="error" title="Comfirm" />
                <v-card-text>
                  Sure to delete the user? The associated resources created by
                  this user will be deleted as well, like problem, contest,
                  announcement, etc.
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn variant="text" @click="isActive.value = false">
                    Close
                  </v-btn>
                  <v-btn
                    color="error"
                    variant="elevated"
                    @click="() => handleDeleteUser(isActive)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-btn color="primary" variant="elevated" type="submit">
            Update
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";
import Datagrid from "../../components/Datagrid.vue";
import ErrorMessage from "../../components/ErrorMessage.vue";
import useDate from "../../hooks/useDate";
import { Ref } from "vue";
import Message from "vue-m-message";

const router = useRouter();
const routes = useRoute();
const user = useUserStore();
const { getDate } = useDate();

const users = ref<ManagementUser[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const keyword = ref("");

const dialog = ref(false);
const dialogLoading = ref(false);
const updateUser = reactive<ManagementUser>({
  id: -1,
  username: "",
  email: "",
  admin_type: "Regular User",
  problem_permission: "None",
  real_name: null,
  create_time: "",
  last_login: "",
  two_factor_auth: false,
  open_api: false,
  is_disabled: false,
});
const password = ref("");

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  keyword.value = (routes.query.keyword as string) || "";
  error.value = null;
  loading.value = true;
  const response = await fetchApi("/admin/user", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    users.value = response.data.data.results;
    total.value = response.data.data.total;
  }
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (keyword.value !== "") params.keyword = keyword.value;
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (limit.value !== 10) params.limit = limit.value;
  if (routes.query.tag) params.tag = routes.query.tag;
  router.push({
    path: routes.path,
    query: params,
  });
};

const handleOpenDialog = (user: ManagementUser) => {
  dialog.value = true;
  Object.assign(updateUser, user);
};

const handleUpdateUser = async () => {
  dialogLoading.value = true;
  const response = await fetchApi("/admin/user", "put", {
    data: {
      ...updateUser,
      problem_permission:
        updateUser.admin_type === "Super Admin"
          ? "All"
          : updateUser.admin_type === "Regular User"
          ? "None"
          : updateUser.problem_permission,
      real_name: updateUser.real_name === "" ? null : updateUser.real_name,
    },
  });
  dialogLoading.value = false;
  dialog.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
    return;
  } else {
    Message.success("Success");
    init();
  }
};

const handleDeleteUser = async (isActive: Ref<boolean>) => {
  isActive.value = false;
  dialogLoading.value = true;
  const response = await fetchApi("/admin/user", "delete", {
    params: {
      id: updateUser.id,
    },
  });
  dialogLoading.value = false;
  dialog.value = false;
  if (response.data.error) {
    Message.error(response.data.data);
    return;
  } else {
    Message.success("Success");
    init();
  }
};

onMounted(() => {
  init();
});

watch(page, () => handleAction());
watch(limit, () => handleAction(true));
watch(
  () => routes.query,
  () => init()
);
watch(
  () => user.profile,
  () => init()
);
</script>
