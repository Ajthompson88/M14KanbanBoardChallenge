import  http  from './http.js';
import type { UserLogin } from '../interfaces/index.js';

interface LoginResponse { token: string }

export const login = async (userInfo: UserLogin): Promise<string> => {
  const { data } = await http.post<LoginResponse>('/auth/login', userInfo);
  const token = data.token;
  localStorage.setItem('auth_token', token); // single source of truth
  return token;
};
