import type { User } from '@/types/domain/user';
import type { ApiResponse } from './client';

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface SendOtpRequest {
  method: 'email' | 'sms' | 'whatsapp';
  destination: string;
}

export interface SendOtpResponse {
  expiresAt: string;
  cooldownSeconds: number;
}

export interface VerifyOtpRequest {
  method: 'email' | 'sms' | 'whatsapp';
  destination: string;
  code: string;
}

export interface VerifyOtpResponse {
  verified: boolean;
  token?: string;
}

export async function register(data: RegisterRequest): Promise<ApiResponse<RegisterResponse>> {
  const { post } = await import('./client');
  return post<RegisterResponse>('/auth/register', data);
}

export async function login(data: LoginRequest): Promise<ApiResponse<LoginResponse>> {
  const { post } = await import('./client');
  return post<LoginResponse>('/auth/login', data);
}

export async function sendOtp(data: SendOtpRequest): Promise<ApiResponse<SendOtpResponse>> {
  const { post } = await import('./client');
  return post<SendOtpResponse>('/auth/send-otp', data);
}

export async function verifyOtp(data: VerifyOtpRequest): Promise<ApiResponse<VerifyOtpResponse>> {
  const { post } = await import('./client');
  return post<VerifyOtpResponse>('/auth/verify-otp', data);
}

export async function logout(): Promise<ApiResponse<void>> {
  const { post } = await import('./client');
  return post<void>('/auth/logout');
}

export async function getMe(): Promise<ApiResponse<User>> {
  const { get } = await import('./client');
  return get<User>('/auth/me');
}

export async function saveOnboarding(): Promise<ApiResponse<User>> {
  const { put } = await import('./client');
  return put<User>('/auth/onboarding', {});
}
