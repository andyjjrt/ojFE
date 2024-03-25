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
    routeName: "Rank",
    routes: [
      {
        routeName: "ACMRank",
        title: "rank.ACMTitle",
      },
      {
        routeName: "OIRank",
        title: "rank.OITitle",
      },
    ],
  },
  {
    title: "about.title",
    icon: "mdi-information-outline",
    routeName: "About",
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
    routeName: "Util",
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
    routeName: "Admin",
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
