interface Status {
  id: string;
  create_time: string;
  user_id: number;
  username: string;
  code: string;
  result: number;
  info: {
    err?: string | null;
    data?: {
      error: number;
      score: number;
      memory: number;
      output: any;
      result: number;
      signal: number;
      cpu_time: number;
      exit_code: number;
      real_time: number;
      test_case: string;
      output_md5: string;
    }[];
  };
  language: string;
  shared: boolean;
  statistic_info: {
    score: number;
    time_cost?: number;
    memory_cost?: number;
    err_info?: string;
  };
  ip: string;
  contest: number | null;
  problem: number;
  can_unshare: boolean;
}
