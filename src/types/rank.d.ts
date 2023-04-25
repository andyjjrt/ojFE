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
    }
    contest_problems: {
      [key: string]: {
        _id: string;
        status: number;
        score: number;
      };
    }
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
