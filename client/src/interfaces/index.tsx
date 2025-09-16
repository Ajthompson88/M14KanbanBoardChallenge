// src/interfaces/index.ts

export interface ApiMessage {
    message: string;
  }
  
  export interface UserData {
    id: number | null;
    username: string | null;
  }
  
  export interface TicketData {
    id: number | null;
    name: string | null;
    description: string | null;
    status: string | null;
    assignedUserId: number | null;
    assignedUser: UserData | null;
  }
  
  export interface UserLogin {
    username: string | null;
    password: string | null;
  }
  