interface User {
  id: number;
  user: {
    id: number;
    username: string;
    email: string;
    admin_type: string;
    problem_permission: string;
    create_time: string;
    last_login: string;
    two_factor_auth: boolean;
    open_api: boolean;
    is_disabled: boolean;
  };
  real_name: string | null;
  acm_problems_status: {
    problems: {
      [key: string]: {
        _id: string;
        status: number;
      };
    };
  };
  oi_problems_status: {
    problems: {
      [key: string]: {
        _id: string;
        status: number;
      };
    };
    contest_problems: {
      [key: string]: {
        _id: string;
        status: number;
      };
    };
  };
  avatar: string;
  blog: string | null;
  mood: string | null;
  github: string | null;
  school: string | null;
  major: string | null;
  language: string | null;
  accepted_number: number;
  total_score: number;
  submission_number: number;
}
