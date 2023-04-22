import { createRouter, createWebHistory } from "vue-router";
import Index from "../page/Index.vue";
import Problems from "../page/Problems.vue";
import Problem from "../page/Problem.vue";
import Submission from "../page/Submission.vue";
import Submissions from "../page/Submissions.vue"
import DefaultLayout from "../layout/index.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { name: "Home", path: "", component: Index },
      { name: "Problems", path: "problem", component: Problems },
      { name: "Problem", path: "problem/:id", component: Problem},
      { name: "Submissions", path: "status", component: Submissions},
      { name: "Submission", path: "status/:id", component: Submission}
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
