'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const PantryContext = createContext({
  pantryId: null,
  userRole: null,
  pantryDetails: null, 
  availablePantries: [], 
  switchPantry: async () => { }, 
  refreshPantry: async () => { }, // <--- NEW FUNCTION
  isLoading: true,
});

export function PantryProvider({ children }) {
  const [pantryId, setPantryId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [pantryDetails, setPantryDetails] = useState(null);
  const [availablePantries, setAvailablePantries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  // --- 1. THE REFRESH LOGIC (Now reusable) ---
  const refreshPantry = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      // A. Fetch Profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('current_pantry_id')
        .eq('user_id', user.id)
        .maybeSingle();

      // B. Fetch Memberships
      const { data: memberships } = await supabase
        .from('pantry_members')
        .select(`
          pantry_id,
          role,
          pantry:food_pantries (
            *,
            settings  
          )
        `) // ^ Added 'settings' and '*' to ensure we get everything
        .eq('user_id', user.id);

      // C. Determine Active Context
      let activePantryId = profile?.current_pantry_id;
      let activeRole = null;
      let activeDetails = null;

      if (memberships && memberships.length > 0) {
        // Try to find the preferred pantry
        const match = memberships.find(m => m.pantry_id === activePantryId);

        if (!activePantryId || !match) {
           // Default to first
           activePantryId = memberships[0].pantry_id;
           activeRole = memberships[0].role;
           activeDetails = memberships[0].pantry;
        } else {
           activeRole = match.role;
           activeDetails = match.pantry;
        }
      }

      setAvailablePantries(memberships || []);
      setPantryId(activePantryId || null);
      setUserRole(activeRole || null);
      setPantryDetails(activeDetails || null);

    } catch (err) {
      console.error('Error refreshing pantry:', err);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // --- 2. SWITCH PANTRY ---
  const switchPantry = async (newPantryId) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('user_profiles')
        .update({ current_pantry_id: newPantryId })
        .eq('user_id', user.id);

      // Just re-run the main refresh logic to ensure everything stays in sync
      await refreshPantry();

    } catch (error) {
      console.error("Failed to switch pantry:", error);
      setIsLoading(false);
    }
  };

  // --- 3. INITIAL LOAD ---
  useEffect(() => {
    refreshPantry();
  }, [refreshPantry]);

  return (
    <PantryContext.Provider value={{
      pantryId,
      userRole,
      pantryDetails,
      availablePantries,
      switchPantry,
      refreshPantry, // <--- EXPOSED HERE
      isLoading
    }}>
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);