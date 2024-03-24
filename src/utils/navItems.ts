/*
<v-list-item
  :title="t('home')"
  to="/"
  :active="routes.name === 'Home'"
  prepend-icon="mdi-home-variant"
/>
*/

interface NavItem {
  title: string;
  icon: string;
  routes?: {
    routeName: string;
    title: string;
  }[];
  routeName?: string;
}

export const navItems: NavItem[] = [
  {
    routeName: "Home",
    title: "home",
    icon: "mdi-home-variant",
  },
  {
    routeName: "Problems",
    title: "problem.title",
    icon: "mdi-view-grid-outline",
  },
  {
    routeName: "Contests",
    title: "contest.title",
    icon: "mdi-trophy",
  },
  {
    routeName: "Submissions",
    title: "submission.title",
    icon: "mdi-chart-line",
  },
  {
    title: "rank.title",
    icon: "mdi-chart-bar",
    routes: [
      {
        routeName: "ACMRank",
        title: "rank.title",
      },
      {
        routeName: "OIRank",
        title: "rank.title",
      },
    ],
  },
  {
    title: "about.title",
    icon: "mdi-information-outline",
    routes: [
      {
        routeName: "Judger",
        title: "judger.title",
      },
      {
        routeName: "FAQ",
        title: "faq.title",
      },
    ],
  },
  {
    title: "util.title",
    icon: "mdi-package-variant",
    routes: [
      {
        routeName: "Timer",
        title: "timer.title",
      },
    ],
  },
];

export const adminNavItem: NavItem[] = [
  {
    routeName: "AdminDashboard",
    title: "Dashboard",
    icon: "mdi-monitor-dashboard",
  },
  {
    routeName: "AdminConfig",
    title: "Config",
    icon: "mdi-wrench",
  },
  {
    routeName: "AdminJudgeServer",
    title: "JudgeServer",
    icon: "mdi-server",
  },
  {
    routeName: "AdminTestcase",
    title: "Testcase",
    icon: "mdi-treasure-chest",
  },
  {
    routeName: "AdminUser",
    title: "User",
    icon: "mdi-account-group",
  },
  {
    routeName: "AdminAnnouncement",
    title: "Announcement",
    icon: "mdi-bullhorn",
  },
  {
    routeName: "AdminProblems",
    title: "Problem",
    icon: "mdi-view-grid-outline",
  },
  {
    routeName: "AdminContests",
    title: "Contest",
    icon: "mdi-trophy",
  },
];

export default navItems;
