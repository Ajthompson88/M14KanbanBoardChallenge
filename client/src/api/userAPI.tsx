import { api } from './http';
import type { UserData } from '../interfaces/UserData';

export const retrieveUsers = async (): Promise<UserData[]> => {
  const { data } = await api.get('/api/users');
  return data as UserData[];
};
