interface Problem {
  id: number;
  tags: string[];
  created_by: {
    id: number;
    username: string;
    real_name: string | null;
  };
  template: any;
  _id: string;
  title: string;
  description: string;
  input_description: string;
  output_description: string;
  samples: {
    input: string;
    output: string;
  }[];
  hint: string;
  languages: string[];
  create_time: string;
  last_update_time: string | null;
  time_limit: number;
  memory_limit: number;
  io_mode: {
    input: string;
    output: string;
    io_mode: string;
  };
  spj: boolean;
  spj_language: string[] | null;
  rule_type: string;
  difficulty: string;
  source: string;
  total_score: number;
  submission_number: number;
  accepted_number: number;
  statistic_info: { [key: string]: number };
  share_submission: boolean;
  contest: number | null;
  my_status: number | null;
}
