interface BasicAnnouncement {
  id: number;
  created_by: {
    id: number;
    username: string;
    real_name: string | null;
  };
  title: string;
  content: string;
  visible: boolean;
  create_time: string;
}

interface Announcement extends BasicAnnouncement {
  last_update_time: string;
}

interface ContestAnnouncement extends BasicAnnouncement {
  contest: number;
}

interface ManagementAnnouncement extends Announcement {}
