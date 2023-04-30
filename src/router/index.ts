import { createRouter, createWebHistory } from "vue-router";
import Index from "../page/Index.vue";
import Problems from "../page/Problems.vue";
import Problem from "../page/Problem.vue";
import Submission from "../page/Submission.vue";
import Submissions from "../page/Submissions.vue";
import Contest from "../page/Contest.vue";
import ContestIndex from "../page/Contest/Index.vue";
import ContestProblem from "../page/Contest/Problem.vue";
import ContestProblems from "../page/Contest/Problems.vue";
import ContestSubmissions from "../page/Contest/Submissions.vue";
import ContestRank from "../page/Contest/Rank.vue";
import Contests from "../page/Contests.vue";
import ACMRank from "../page/RankACM.vue";
import OIRank from "../page/RankOI.vue";
import Judger from "../page/Judger.vue";
import Faq from "../page/Faq.vue";
import User from "../page/User.vue";
import Setting from "../page/Setting.vue";
import SettingIndex from "../page/Setting/Index.vue";
import SettingAccount from "../page/Setting/Account.vue";
import SettingSecurity from "../page/Setting/Security.vue";
import Admin from "../page/Admin.vue";
import AdminDashboard from "../page/Admin/Dashboard.vue";
import AdminUser from "../page/Admin/User.vue";
import DefaultLayout from "../layout/index.vue";

const routes = [
  {
    path: "/",
    component: DefaultLayout,
    children: [
      { name: "Home", path: "", component: Index },
      { name: "Problems", path: "problem", component: Problems },
      { name: "Problem", path: "problem/:problemId", component: Problem },
      { name: "Submissions", path: "status", component: Submissions },
      { name: "Submission", path: "status/:id", component: Submission },
      { name: "Contests", path: "contest", component: Contests },
      {
        path: "contest/:contestId",
        component: Contest,
        children: [
          { name: "Contest", path: "", component: ContestIndex },
          {
            name: "ContestProblems",
            path: "problem",
            component: ContestProblems,
          },
          {
            name: "ContestProblem",
            path: "problem/:problemId",
            component: ContestProblem,
          },
          {
            name: "ContestSubmissions",
            path: "status",
            component: ContestSubmissions,
          },
          {
            name: "ContestRank",
            path: "rank",
            component: ContestRank,
          },
        ],
      },
      { name: "ACMRank", path: "acm-rank", component: ACMRank },
      { name: "OIRank", path: "oi-rank", component: OIRank },
      { name: "Judger", path: "judger", component: Judger },
      { name: "FAQ", path: "faq", component: Faq },
      { name: "User", path: "user", component: User },
      {
        path: "setting",
        component: Setting,
        children: [
          { name: "Setting", path: "", component: SettingIndex },
          {
            name: "SettingAccount",
            path: "account",
            component: SettingAccount,
          },
          {
            name: "SettingSecurity",
            path: "security",
            component: SettingSecurity,
          },
        ],
      },
      {
        path: "/admin",
        component: Admin,
        children: [
          {
            name: "AdminDashboard",
            path: "",
            component: AdminDashboard,
            meta: {
              admin: true,
            },
          },
          {
            name: "AdminUser",
            path: "users",
            component: AdminUser,
            meta: {
              admin: true,
            },
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
