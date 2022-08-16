export interface Group {
  admins: string[];
  groupName: string | null;
  groupImage: string | null;
}

export interface Conversation {
  users: string[];
  group?: Group;
  seen: {
    [key: string]: string;
  };
  updatedAt: {
    seconds: number;
    nanoseconds: number;
  };
  theme: string;
}
