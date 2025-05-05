
import { useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { checkIfUserIsAdmin, signIn, signOut, signUp, makeUserAdmin, createAdminUser } from './authActions';
import { AuthContextType } from './authTypes';

export function useAuthProvider(): AuthContextType {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Set up the auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (newSession?.user) {
          // Defer loading profile to prevent Supabase auth deadlock
          setTimeout(() => {
            checkIfUserIsAdmin(newSession.user.id).then(setIsAdmin);
          }, 0);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      
      if (initialSession?.user) {
        checkIfUserIsAdmin(initialSession.user.id).then(setIsAdmin);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    user,
    isLoading,
    isAdmin,
    signIn,
    signOut,
    signUp,
    makeUserAdmin,
    createAdminUser,
  };
}
