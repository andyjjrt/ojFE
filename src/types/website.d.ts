interface Website {
  website_base_url: string;
  website_name: string;
  website_name_shortcut: string;
  website_footer: string;
  allow_register: boolean;
  submission_list_show_all: boolean;
}

interface Config {
  tls: boolean;
  port: number;
  email: string;
  server: string;
  password: string;
}
