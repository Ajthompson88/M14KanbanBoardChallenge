import { api } from "./authAPI";

export async function retrieveUsers() {
  const { data } = await api.get("/users");
  return data;
}

export default { retrieveUsers };
