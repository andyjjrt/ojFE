<template>
  <v-card class="pa-4">
    <div class="d-flex justify-space-between align-center">
      <v-card-title>Contests</v-card-title>
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
      :data="contests"
      :loading="loading"
      :total="total"
      :page="page"
      :rows-per-page="limit"
      @handleNavigate="handleNavigate"
      @handleChangeRowPerPage="handleChangeRowPerPage"
      v-else
    >
      <template v-slot="{ data }: { data: ManagementContest[] }">
        <v-list lines="one" density="compact">
          <template v-for="item in data">
            <v-list-item
              :to="{ name: 'AdminContest', params: { contestId: item.id } }"
            >
              <template v-slot:title>
                {{ item.title }}
              </template>

              <template v-slot:append>
                <div class="d-flex align-center" @click.stop.prevent>
                  <v-chip
                    class="mx-2"
                    size="small"
                    label
                    :color="contestStatusList[item.status].type"
                  >
                    {{ contestStatusList[item.status].name }}
                  </v-chip>
                  <Downloader
                    :link="`/admin/download_submissions?contest_id=${item.id}&exclude_admin=1`"
                    :title="`${item.id}_${item.title}_submissions`"
                  >
                    <template v-slot="{ handleDownload, loading }">
                      <v-tooltip text="Download Submissions" location="top">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            @click.stop.prevent="handleDownload"
                            :loading="loading"
                            v-bind="props"
                            variant="text"
                            icon
                            size="small"
                            class="mx-1"
                          >
                            <v-icon icon="mdi-download" />
                          </v-btn>
                        </template>
                      </v-tooltip>
                    </template>
                  </Downloader>
                  <div class="d-flex-inline mx-1">
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
                </div>
              </template>
            </v-list-item>
            <v-divider />
          </template>
        </v-list>
      </template>
      <template v-slot:footer>
        <v-btn color="primary" :to="{ name: 'AdminContestCreate' }"
          >Create</v-btn
        >
      </template>
    </Datagrid>
  </v-card>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useUserStore } from "../../store/user";
import { fetchApi } from "../../utils/api";
import Datagrid from "../../components/Datagrid.vue";
import Downloader from "../../components/Admin/Downloader.vue";
import ErrorMessage from "../../components/ErrorMessage.vue";
import useDate from "../../hooks/useDate";
import { contestStatusList } from "../../utils/status";
import Message from "vue-m-message";

const router = useRouter();
const routes = useRoute();
const user = useUserStore();
const { getDate } = useDate();

const contests = ref<ManagementContest[]>([]);
const page = ref(1);
const limit = ref(10);
const total = ref(0);
const loading = ref(false);
const error = ref<string | null>(null);
const keyword = ref("");

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
  const response = await fetchApi("/admin/contest", "get", {
    params: {
      offset: offset.value,
      limit: limit.value,
      keyword: keyword.value,
    },
  });
  loading.value = false;
  if (response.data.error) error.value = response.data.data;
  else {
    contests.value = response.data.data.results;
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

const handleChangeVisibility = async (contest: ManagementContest) => {
  loading.value = true;
  const response = await fetchApi("/admin/contest", "put", {
    data: contest,
  });
  loading.value = false;
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
