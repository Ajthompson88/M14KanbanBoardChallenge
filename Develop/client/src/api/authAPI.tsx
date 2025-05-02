import axios from 'axios';
import { UserLogin } from "../interfaces/UserLogin";

const login = async (userInfo: UserLogin) => {
  const response = await axios.post('/auth/login', userInfo);
  const  token  = response.data;
  console.log(response);
  console.log(typeof response.data);
  localStorage.setItem('token', token as string);
  return token;
};

export { login };
