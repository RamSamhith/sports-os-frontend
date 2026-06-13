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

export interface OnboardingPayload {
  role?: string;
  age?: number;
  gender?: string;
  sportInterests?: string[];
  skillLevel?: string;
  goals?: string;
  location?: string;
  children?: Array<{
    name: string;
    age: number;
    gender?: string;
    sportInterests?: string[];
    skillLevel?: string;
  }>;
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

export async function refreshAccessToken(): Promise<ApiResponse<{ token: string }>> {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? '';
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });
  const json = await res.json();
  if (!res.ok) {
    return {
      ok: false,
      error: {
        code: json.error?.code ?? 'UNAUTHORIZED',
        message: json.error?.message ?? 'Refresh failed',
      },
    };
  }
  return { ok: true, data: json.data };
}

export async function logout(): Promise<ApiResponse<void>> {
  const { post } = await import('./client');
  return post<void>('/auth/logout');
}

export async function getMe(): Promise<ApiResponse<User>> {
  const { get } = await import('./client');
  return get<User>('/auth/me');
}

export async function saveOnboarding(data?: OnboardingPayload): Promise<ApiResponse<User>> {
  const { put } = await import('./client');
  return put<User>('/auth/onboarding', data || {});
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
}

export async function updateProfile(data: UpdateProfileRequest): Promise<ApiResponse<User>> {
  const { patch } = await import('./client');
  return patch<User>('/auth/profile', data);
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export async function forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse<ForgotPasswordResponse>> {
  const { post } = await import('./client');
  return post<ForgotPasswordResponse>('/auth/forgot-password', data);
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export async function resetPassword(data: ResetPasswordRequest): Promise<ApiResponse<ResetPasswordResponse>> {
  const { post } = await import('./client');
  return post<ResetPasswordResponse>('/auth/reset-password', data);
}
