interface Language {
  spj?: {
    config: {
      command: string;
      exe_name: string;
      seccomp_rule: string;
    };
    compile: {
      exe_name: string;
      src_name: string;
      max_memory: number;
      max_cpu_time: number;
      max_real_time: number;
      compile_command: string;
    };
  };
  name: string;
  config: {
    run: {
      env: string[];
      command: string;
      seccomp_rule: any;
    };
    compile: {
      exe_name: string;
      src_name: string;
      max_memory: number;
      max_cpu_time: number;
      max_real_time: number;
      compile_command: string;
    };
    template: string;
  };
  description: string;
  content_type: string;
}
