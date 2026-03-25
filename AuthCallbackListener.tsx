import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { supabase } from './supabase';

export default function AuthCallbackListener() {
  useEffect(() => {
    const handleDeepLink = async ({ url }: { url: string }) => {
      if (!url) return;

      const parsed = Linking.parse(url);
      const queryParams = parsed.queryParams ?? {};

      const access_token = typeof queryParams.access_token === 'string'
        ? queryParams.access_token
        : undefined;
      const refresh_token = typeof queryParams.refresh_token === 'string'
        ? queryParams.refresh_token
        : undefined;

      if (access_token && refresh_token) {
        await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return null;
}
