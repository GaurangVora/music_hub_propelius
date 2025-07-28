import httpClient from './httpClient';
import { SignUpData, SignInData, AuthResponse } from '../types';

export type { AuthResponse };
export const authService = {
  signUp: async (data: SignUpData): Promise<AuthResponse> => {
    const response = await httpClient.post('/auth/signup', data);
    return response.data;
  },

  signIn: async (data: SignInData): Promise<AuthResponse> => {
    const response = await httpClient.post('/auth/signin', data);
    return response.data;
  },
}; 