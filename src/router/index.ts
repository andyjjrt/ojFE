import { createRouter, createWebHistory } from "vue-router";
import Index from "../page/Index.vue";
import Problems from "../page/Problems.vue";
import DefaultLayout from "../layout/index.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { name: "Home", path: "", component: Index },
      { name: "Problem", path: "problem", component: Problems },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
