interface DashboardInfo {
  user_count: number;
  recent_contest_count: number;
  today_submission_count: number;
  judge_server_count: number;
  env: {
    FORCE_HTTPS: boolean;
    STATIC_CDN_HOST: string;
  };
}

interface VersionInfo {
  update: {
    version: string;
    level: string;
    title: string;
    details: string[];
  }[];
  local_version: string;
}
