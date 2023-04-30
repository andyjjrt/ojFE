interface Session {
  ip: string;
  user_agent: string;
  last_activity: string;
  session_key: string;
  current_session?: boolean;
}
