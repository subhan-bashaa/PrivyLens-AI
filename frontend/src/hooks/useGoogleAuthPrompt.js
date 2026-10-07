import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const useGoogleAuthPrompt = () => {
  const { loginWithGoogle } = useAuth();
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [googleError, setGoogleError] = useState(null);

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const triggerGoogleSignIn = useCallback(
    ({ role = 'student' } = {}) => {
      return new Promise((resolve, reject) => {
        setGoogleError(null);

        // 1. Check if Client ID is configured
        if (
          !googleClientId ||
          googleClientId.includes('your_google_client_id') ||
          googleClientId.trim() === ''
        ) {
          const err = new Error(
            'Google OAuth Client ID is not configured. Please set VITE_GOOGLE_CLIENT_ID in your frontend .env and GOOGLE_CLIENT_ID in your backend .env.'
          );
          setGoogleError(err.message);
          return reject(err);
        }

        // 2. Check if Google Identity Services script is available
        if (!window.google?.accounts?.oauth2) {
          const err = new Error(
            'Google Identity Services SDK is not loaded. Please check your internet connection and refresh.'
          );
          setGoogleError(err.message);
          return reject(err);
        }

        setIsGoogleLoading(true);

        try {
          const tokenClient = window.google.accounts.oauth2.initTokenClient({
            client_id: googleClientId,
            scope: 'openid email profile',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                setIsGoogleLoading(false);
                const errMsg = tokenResponse.error_description || tokenResponse.error;
                setGoogleError(errMsg);
                return reject(new Error(errMsg));
              }

              try {
                const loggedUser = await loginWithGoogle({
                  accessToken: tokenResponse.access_token,
                  role,
                });
                setIsGoogleLoading(false);
                resolve(loggedUser);
              } catch (authErr) {
                setIsGoogleLoading(false);
                const msg =
                  authErr?.response?.data?.message ||
                  authErr.message ||
                  'Google authentication failed on server.';
                setGoogleError(msg);
                reject(new Error(msg));
              }
            },
            error_callback: (err) => {
              setIsGoogleLoading(false);
              const msg = err?.message || 'Google Sign-In popup was closed or blocked.';
              setGoogleError(msg);
              reject(new Error(msg));
            },
          });

          tokenClient.requestAccessToken({ prompt: 'consent' });
        } catch (err) {
          setIsGoogleLoading(false);
          setGoogleError(err.message);
          reject(err);
        }
      });
    },
    [googleClientId, loginWithGoogle]
  );

  return {
    triggerGoogleSignIn,
    isGoogleLoading,
    googleError,
    isConfigured: Boolean(
      googleClientId && !googleClientId.includes('your_google_client_id')
    ),
  };
};

export default useGoogleAuthPrompt;
