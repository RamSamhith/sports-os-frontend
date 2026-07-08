/**
 * Shared Google Identity Services (GIS) type declarations.
 * Extended by both use-social-auth.ts (id tokens) and use-gmail-token.ts (access tokens).
 */

interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface GoogleTokenClient {
  requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
}

interface GoogleOAuth2 {
  initTokenClient: (config: {
    client_id: string;
    scope: string;
    callback: (tokenResponse: { access_token?: string; error?: string }) => void;
  }) => GoogleTokenClient;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: GoogleCredentialResponse) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: string;
              size?: string;
              text?: string;
              shape?: string;
              width?: number;
            },
          ) => void;
          prompt: () => void;
        };
        oauth2: GoogleOAuth2;
      };
    };
  }
}

export {};
