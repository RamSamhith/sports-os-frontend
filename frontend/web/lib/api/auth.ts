import type { User, UserRole } from '@/types/domain/user';
import type { ApiResponse } from './client';

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface RegisterResponse {
  requiresVerification: boolean;
  email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  user: User;
  token: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ResendOtpResponse {
  message: string;
}

export interface OnboardingPayload {
  role?: UserRole;
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

export async function sendOtp(data: ResendOtpRequest): Promise<ApiResponse<ResendOtpResponse>> {
  const { post } = await import('./client');
  return post<ResendOtpResponse>('/auth/resend-otp', data);
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

// ─── OTP Login ───────────────────────────────────────────────

export interface LoginOtpRequest {
  email: string;
}

export interface LoginOtpResponse {
  message: string;
}

export async function sendLoginOtp(data: LoginOtpRequest): Promise<ApiResponse<LoginOtpResponse>> {
  const { post } = await import('./client');
  return post<LoginOtpResponse>('/auth/login-otp', data);
}

export interface VerifyLoginOtpRequest {
  email: string;
  otp: string;
}

export async function verifyLoginOtp(data: VerifyLoginOtpRequest): Promise<ApiResponse<LoginResponse>> {
  const { post } = await import('./client');
  return post<LoginResponse>('/auth/verify-login-otp', data);
}

// ─── OTP Password Reset ──────────────────────────────────────

export interface ForgotPasswordOtpRequest {
  email: string;
}

export interface ForgotPasswordOtpResponse {
  message: string;
}

export async function sendForgotPasswordOtp(data: ForgotPasswordOtpRequest): Promise<ApiResponse<ForgotPasswordOtpResponse>> {
  const { post } = await import('./client');
  return post<ForgotPasswordOtpResponse>('/auth/forgot-password-otp', data);
}

export interface VerifyResetOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyResetOtpResponse {
  resetToken: string;
}

export async function verifyResetOtp(data: VerifyResetOtpRequest): Promise<ApiResponse<VerifyResetOtpResponse>> {
  const { post } = await import('./client');
  return post<VerifyResetOtpResponse>('/auth/verify-reset-otp', data);
}

// ─── Provider Check ──────────────────────────────────────────

export interface ProviderCheckResponse {
  provider: string | null;
}

export async function checkProvider(email: string): Promise<ApiResponse<ProviderCheckResponse>> {
  const { get } = await import('./client');
  return get<ProviderCheckResponse>(`/auth/provider/${encodeURIComponent(email)}`);
}

// ─── Sessions ────────────────────────────────────────────────

export interface Session {
  id: string;
  userAgent: string;
  ipAddress: string;
  lastUsedAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export interface SessionsResponse {
  sessions: Session[];
}

export async function getSessions(): Promise<ApiResponse<SessionsResponse>> {
  const { get } = await import('./client');
  return get<SessionsResponse>('/auth/sessions');
}

export async function revokeSession(sessionId: string): Promise<ApiResponse<{ message: string }>> {
  const { del } = await import('./client');
  return del<{ message: string }>(`/auth/sessions/${sessionId}`);
}

export async function revokeAllSessions(): Promise<ApiResponse<{ message: string; count: number }>> {
  const { del } = await import('./client');
  return del<{ message: string; count: number }>('/auth/sessions');
}

// ─── Change Password ─────────────────────────────────────────

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(data: ChangePasswordRequest): Promise<ApiResponse<{ message: string }>> {
  const { put } = await import('./client');
  return put<{ message: string }>('/auth/change-password', data);
}

// ─── Change Email ────────────────────────────────────────────

export interface ChangeEmailRequest {
  newEmail: string;
  password: string;
}

export async function changeEmail(data: ChangeEmailRequest): Promise<ApiResponse<{ message: string; requiresVerification?: boolean }>> {
  const { put } = await import('./client');
  return put<{ message: string; requiresVerification?: boolean }>('/auth/change-email', data);
}

// ─── Change Phone ────────────────────────────────────────────

export interface ChangePhoneRequest {
  phone: string;
}

export async function changePhone(data: ChangePhoneRequest): Promise<ApiResponse<User>> {
  const { put } = await import('./client');
  return put<User>('/auth/change-phone', data);
}

// ─── Delete Account ──────────────────────────────────────────

export interface DeleteAccountRequest {
  password: string;
}

export async function deleteAccount(data: DeleteAccountRequest): Promise<ApiResponse<{ message: string }>> {
  const { del } = await import('./client');
  return del<{ message: string }>('/auth/account', data);
}

// ─── Preferences & Consent Sync ──────────────────────────────

export interface SyncPreferencesRequest {
  favoriteSports?: string[];
  city?: string;
  radius?: number;
  skillLevel?: string;
  goals?: string;
  notifications?: boolean;
  language?: string;
}

export async function syncPreferences(data: SyncPreferencesRequest): Promise<ApiResponse<User>> {
  const { patch } = await import('./client');
  return patch<User>('/auth/profile', { preferences: data });
}

export interface SyncConsentRequest {
  analytics?: boolean;
  marketing?: boolean;
  whatsapp?: boolean;
}

export async function syncConsent(data: SyncConsentRequest): Promise<ApiResponse<User>> {
  const { patch } = await import('./client');
  return patch<User>('/auth/profile', { consent: data });
}

// ─── OAuth (Google) ────────────────────────────────────────

export interface OAuthResponse {
  user: User;
  token: string;
}

export async function signInWithGoogle(idToken: string): Promise<ApiResponse<OAuthResponse>> {
  const { post } = await import('./client');
  return post<OAuthResponse>('/auth/google', { idToken });
}
