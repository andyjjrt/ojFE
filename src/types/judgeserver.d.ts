interface JudgeServerStatus {
  token: string;
  servers: {
    id: number;
    status: string;
    hostname: string;
    ip: string;
    judger_version: string;
    cpu_core: number;
    memory_usage: number;
    cpu_usage: number;
    last_heartbeat: string;
    create_time: string;
    task_number: number;
    service_url: string;
    is_disabled: boolean;
    [key: string]: number | boolean | string;
  }[];
}
