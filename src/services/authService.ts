import axiosInstance from '../api/axiosInstance';
import {
  CreateNewAccount,
  CreateNewAccountResponse,
  SignInUser,
  SignInUserResponse,
} from '../types/public.types';

export const login = async (data: SignInUser) => {
  const response: SignInUserResponse = await axiosInstance.post('/login', data);
  return response.data;
};

export const signup = async (data: CreateNewAccount) => {
  const response: CreateNewAccountResponse = await axiosInstance.post(
    '/signup',
    data,
  );
  return response.data;
};
