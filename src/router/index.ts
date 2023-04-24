import { createRouter, createWebHistory } from "vue-router";
import Index from "../page/Index.vue";
import Problems from "../page/Problems.vue";
import Problem from "../page/Problem.vue";
import Submission from "../page/Submission.vue";
import Submissions from "../page/Submissions.vue";
import Contests from "../page/Contests.vue";
import Judger from "../page/Judger.vue";
import User from "../page/User.vue";
import DefaultLayout from "../layout/index.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { name: "Home", path: "", component: Index },
      { name: "Problems", path: "problem", component: Problems },
      { name: "Problem", path: "problem/:id", component: Problem },
      { name: "Submissions", path: "status", component: Submissions },
      { name: "Submission", path: "status/:id", component: Submission },
      { name: "Contests", path: "contest", component: Contests },
      { name: "Judger", path: "judger", component: Judger },
      { name: "User", path: "user", component: User },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
