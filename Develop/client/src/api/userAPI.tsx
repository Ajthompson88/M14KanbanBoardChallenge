import axios from 'axios';
import { UserData } from '../interfaces/UserData';

export const retrieveUsers = async (): Promise<UserData[]> => {
  try {
    const response = await axios.get<UserData[]>('/api/users'); // Replace with your backend endpoint
    return response.data;
  } catch (error) {
    console.error('Error retrieving users:', error);
    throw error;
  }
};
