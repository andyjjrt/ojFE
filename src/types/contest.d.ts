interface Contest {
  id: number;
  created_by: {
    id: number;
    username: string;
    real_name: string | null;
  };
  status: string;
  contest_type: string;
  title: string;
  description: string;
  real_time_rank: boolean;
  rule_type: string;
  start_time: string;
  end_time: string;
  create_time: string;
  last_update_time: string;
}
