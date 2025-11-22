'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const PantryContext = createContext({
  pantryId: null,
  userRole: null,
  isLoading: true,
});

export function PantryProvider({ children }) {
  const [pantryId, setPantryId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // FIX 1: Initialize client once (Stops the infinite loop)
  const [supabase] = useState(() => 
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  useEffect(() => {
    const fetchPantryData = async () => {
      try {
        // FIX 2: Use getUser() instead of getSession() for security
        // This verifies the token with the server
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setIsLoading(false);
          return;
        }

        // 3. Fetch profile using the verified user ID
        const { data: profile, error } = await supabase
          .from('user_profiles')
          .select('pantry_id, role')
          .eq('user_id', user.id) // Use 'user.id', not 'session.user.id'
          .single();

        if (error) {
          console.error('Error fetching profile:', error);
        } else if (profile) {
          console.log("✅ Pantry Context Loaded:", profile.pantry_id);
          setPantryId(profile.pantry_id);
          setUserRole(profile.role);
        }
      } catch (err) {
        console.error('Unexpected error in PantryProvider:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPantryData();
  }, [supabase]);

  return (
    <PantryContext.Provider value={{ pantryId, userRole, isLoading }}>
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);