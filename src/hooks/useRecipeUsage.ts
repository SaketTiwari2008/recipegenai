import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface UsageStatus {
  usedToday: number;
  remaining: number;
  limit: number;
  canGenerate: boolean;
  isLoading: boolean;
}

export function useRecipeUsage() {
  const { user, session, subscription } = useAuth();
  const [usage, setUsage] = useState<UsageStatus>({
    usedToday: 0,
    remaining: 5,
    limit: 5,
    canGenerate: true,
    isLoading: false,
  });

  const checkUsage = useCallback(async () => {
    if (!session) {
      // Non-authenticated users get unlimited for now (tracked differently)
      setUsage({
        usedToday: 0,
        remaining: 5,
        limit: 5,
        canGenerate: true,
        isLoading: false,
      });
      return;
    }

    // Premium users have unlimited
    if (subscription.subscribed) {
      setUsage({
        usedToday: 0,
        remaining: Infinity,
        limit: Infinity,
        canGenerate: true,
        isLoading: false,
      });
      return;
    }

    setUsage(prev => ({ ...prev, isLoading: true }));

    try {
      const { data, error } = await supabase.functions.invoke('track-usage', {
        body: { action: 'check' }
      });

      if (error) {
        console.error('Error checking usage:', error);
        setUsage(prev => ({ ...prev, isLoading: false }));
        return;
      }

      setUsage({
        usedToday: data.used_today,
        remaining: data.remaining,
        limit: data.limit,
        canGenerate: data.can_generate,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking usage:', error);
      setUsage(prev => ({ ...prev, isLoading: false }));
    }
  }, [session, subscription.subscribed]);

  const recordUsage = useCallback(async (recipeName?: string) => {
    if (!session || subscription.subscribed) {
      // Premium users don't need to record
      return true;
    }

    try {
      const { error } = await supabase.functions.invoke('track-usage', {
        body: { action: 'record', recipe_name: recipeName }
      });

      if (error) {
        console.error('Error recording usage:', error);
        return false;
      }

      // Refresh usage after recording
      await checkUsage();
      return true;
    } catch (error) {
      console.error('Error recording usage:', error);
      return false;
    }
  }, [session, subscription.subscribed, checkUsage]);

  useEffect(() => {
    if (user) {
      checkUsage();
    }
  }, [user, checkUsage]);

  return {
    usage,
    checkUsage,
    recordUsage,
    isPremium: subscription.subscribed,
  };
}
