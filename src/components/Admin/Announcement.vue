<template>
  <v-card class="pa-4">
    <v-card-title>Announcement</v-card-title>
    <ErrorMessage :message="error" v-if="error" class="mx-4" />
    <Datagrid
      :data="announcements"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      :hide-pagination="contestId !== undefined"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
      v-else
    >
      <template v-slot="{ data }: { data: ManagementAnnouncement[] }">
        <v-list lines="one">
          <template v-for="item in data">
            <v-list-item
              :title="item.title"
              @click="() => handleOpenDialog(item)"
            >
              <template v-slot:append>
                <div class="d-flex-inline ms-1">
                  <v-switch
                    color="primary"
                    hide-details
                    density="compact"
                    v-model="item.visible"
                    @click.native.stop
                    @update:modelValue="() => handleChangeVisibility(item)"
                  >
                    <template v-slot:label>
                      <v-icon
                        :icon="item.visible ? 'mdi-eye' : 'mdi-eye-off'"
                      />
                    </template>
                  </v-switch>
                </div>
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
      <template v-slot:footer>
        <v-btn
          color="primary"
          variant="elevated"
          @click="() => handleOpenDialog()"
        >
          Create
        </v-btn>
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
        @submit.prevent="handleSaveAnnouncement"
      >
        <v-toolbar color="primary" title="Announcement" />
        <v-card-text class="pa-0">
          <v-container fluid>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  hide-details
                  label="Title"
                  v-model="updateAnnounce.title"
                />
              </v-col>
              <v-col cols="12">
                <MDEditor v-model="content" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn @click="dialog = false"> Close </v-btn>
          <v-dialog max-width="600">
            <template v-slot:activator="{ props }">
              <v-btn
                variant="elevated"
                color="warning"
                v-bind="props"
                v-if="updateAnnounce.id !== -1"
              >
                Delete
              </v-btn>
            </template>
            <template v-slot:default="{ isActive }">
              <v-card>
                <v-toolbar color="error" title="Comfirm" />
                <v-card-text>
                  Are you sure you want to delete this announcement?
                </v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn variant="text" @click="isActive.value = false">
                    Close
                  </v-btn>
                  <v-btn
                    variant="elevated"
                    color="error"
                    @click="() => handleDeleteAnnouncement(isActive)"
                  >
                    Delete
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
          <v-btn color="primary" variant="elevated" type="submit"> Save </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch, Ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";
import Datagrid from "../Datagrid.vue";
import ErrorMessage from "../ErrorMessage.vue";
import useDate from "../../hooks/useDate";
import MDEditor from "../MDEditor.vue";

const router = useRouter();
const routes = useRoute();
const user = useUserStore();
const { getDate } = useDate();

const props = defineProps<{
  contestId?: string;
}>();

const announcements = ref<ManagementUser[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);

const dialog = ref(false);
const dialogLoading = ref(false);
const updateAnnounce = reactive<ManagementAnnouncement>({
  id: -1,
  created_by: {
    id: 0,
    username: "",
    real_name: null,
  },
  title: "",
  content: "",
  visible: false,
  create_time: "",
  last_update_time: "",
});

const offset = computed(() => (page.value - 1) * limit.value);

const handleNavigate = (newPage: number) => (page.value = newPage);
const handleChangeRowPerPage = (newRowPerPage: number) =>
  (limit.value = newRowPerPage);

const init = async () => {
  page.value = parseInt((routes.query.page as string) || "1");
  limit.value = parseInt((routes.query.limit as string) || "10");
  error.value = null;
  loading.value = true;
  const response = await fetchApi(
    `/admin/${props.contestId ? "contest/" : ""}announcement`,
    "get",
    {
      params: {
        offset: offset.value,
        limit: limit.value,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    announcements.value = props.contestId
      ? response.data.data
      : response.data.data.results;
    total.value = props.contestId
      ? response.data.data.length
      : response.data.data.total;
  }
};

const handleAction = (resetPage: boolean = false) => {
  let params: { [key: string]: any } = {};
  if (!resetPage) if (page.value !== 1) params.page = page.value;
  if (limit.value !== 10) params.limit = limit.value;
  if (routes.query.tag) params.tag = routes.query.tag;
  router.push({
    path: routes.path,
    query: params,
  });
};

const handleOpenDialog = (announcement?: ManagementAnnouncement) => {
  dialog.value = true;
  if (announcement) {
    Object.assign(updateAnnounce, announcement);
  } else {
    Object.assign(updateAnnounce, {
      id: -1,
      created_by: {
        id: 0,
        username: "",
        real_name: null,
      },
      title: "",
      content: "",
      visible: false,
      create_time: "",
      last_update_time: "",
    });
  }
};

const handleChangeVisibility = async (announcement: ManagementAnnouncement) => {
  loading.value = true;
  const response = await fetchApi(
    `/admin/${props.contestId ? "contest/" : ""}announcement`,
    "put",
    {
      data: {
        ...announcement,
        contest_id: props.contestId,
      },
    }
  );
  loading.value = false;
  init();
};

const content = computed({
  get: () => decodeURI(updateAnnounce.content),
  set: (val) => {
    updateAnnounce.content = encodeURI(val);
  },
});

const handleSaveAnnouncement = async () => {
  dialogLoading.value = true;
  const response = await fetchApi(
    `/admin/${props.contestId ? "contest/" : ""}announcement`,
    updateAnnounce.id === -1 ? "post" : "put",
    {
      data: updateAnnounce,
    }
  );
  dialogLoading.value = false;
  dialog.value = false;
  init();
};

const handleDeleteAnnouncement = async (isActive: Ref<boolean>) => {
  isActive.value = false;
  dialogLoading.value = true;
  const response = await fetchApi(
    `/admin/${props.contestId ? "contest/" : ""}announcement`,
    "delete",
    {
      params: {
        id: updateAnnounce.id,
      },
    }
  );
  dialogLoading.value = false;
  dialog.value = false;
  init();
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
