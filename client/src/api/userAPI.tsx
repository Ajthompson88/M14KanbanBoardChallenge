// src/api/userAPI.tsx
import axios from "axios";
import { api } from "./http";

export type UserDTO = { id: number; email: string; username: string };

export async function retrieveUsers(): Promise<UserDTO[]> {
  try {
    const { data } = await api.get<UserDTO[]>("/users"); // baseURL adds /api
    return data ?? [];
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      const status = e.response?.status;
      const msg =
        status === 401
          ? "You are not authorized. Please log in again."
          : e.message || "Failed to load users";
      throw new Error(msg);
    }
    throw e instanceof Error ? e : new Error("Failed to load users");
  }
}
