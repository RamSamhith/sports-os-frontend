// components/GmailLogin.jsx
'use client';
import { useGoogleLogin } from '@react-oauth/google';

export default function GmailLogin({ onSuccess, onError }) {
  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/gmail.readonly',
    onSuccess: (tokenResponse) => {
      onSuccess?.(tokenResponse.access_token);
    },
    onError: (err) => {
      console.error('Google login failed:', err);
      onError?.(err);
    },
  });

  return (
    <button
      onClick={() => login()}
      style={{
        padding: '10px 18px',
        borderRadius: 8,
        border: '1px solid #dadce0',
        background: '#fff',
        cursor: 'pointer',
        fontWeight: 600,
      }}
    >
      Sign in with Google
    </button>
  );
}
