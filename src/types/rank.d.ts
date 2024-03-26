interface RankUser {
  id: number;
  user: {
    id: number;
    username: string;
    real_name: string | null;
  };
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
        score: number;
      };
    };
    contest_problems: {
      [key: string]: {
        _id: string;
        status: number;
        score: number;
      };
    };
  };
  real_name: string | null;
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

interface ContestRankUser {
  id: number;
  user: {
    id: number;
    username: string;
    real_name: string | null;
  };
  submission_number: number;
  contest: number;
}

interface ContestOIRankUser extends ContestRankUser {
  total_score: number;
  submission_info: {
    [key: string]: number;
  };
}

interface ContestACMRankUser  extends ContestRankUser {
  accepted_number: number;
  total_time: number;
  submission_info: {
    [key: string]: {
      is_ac: boolean;
      ac_time: number;
      is_first_ac: boolean;
      error_number: number;
    };
  };
}
