'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const PantryContext = createContext({
  pantryId: null,
  userRole: null,
  pantryDetails: null, // Store details like subscription_tier
  availablePantries: [], // List of all pantries user can access
  switchPantry: async () => { }, // Function to change location
  isLoading: true,
});

export function PantryProvider({ children }) {
  const [pantryId, setPantryId] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [pantryDetails, setPantryDetails] = useState(null);
  const [availablePantries, setAvailablePantries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Supabase Client
  const [supabase] = useState(() =>
    createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    )
  );

  // --- HELPER: Switch Pantry Function ---
  const switchPantry = async (newPantryId) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Update DB Profile preference
      await supabase
        .from('user_profiles')
        .update({ current_pantry_id: newPantryId })
        .eq('user_id', user.id);

      // 2. Update Local State
      setPantryId(newPantryId);

      // 3. Find new role from the already loaded list
      const selectedMembership = availablePantries.find(p => p.pantry_id === newPantryId);
      if (selectedMembership) {
        setUserRole(selectedMembership.role);
        setPantryDetails(selectedMembership.pantry); // The joined pantry data
      }
    } catch (error) {
      console.error("Failed to switch pantry:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inside src/components/providers/PantryProvider.js

  useEffect(() => {
    const fetchPantryData = async () => {
      try {
        // 1. Verify Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          setIsLoading(false);
          return;
        }

        // 2. Fetch User Profile 
        // CHANGE: Use .maybeSingle() instead of .single()
        // This prevents the error when a new user is on the Onboarding page
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('current_pantry_id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profileError) throw profileError;

        // 3. Fetch ALL Memberships
        const { data: memberships, error: memberError } = await supabase
          .from('pantry_members')
          .select(`
          pantry_id,
          role,
          pantry:food_pantries (
            name,
            address,
            join_code,
            subscription_tier,
            max_items_limit
          )
        `)
          .eq('user_id', user.id);

        if (memberError) throw memberError;

        // 4. Determine Active Context
        let activePantryId = profile?.current_pantry_id;
        let activeRole = null;
        let activeDetails = null;

        // If we have memberships but no preference set (or preference is invalid)
        if (memberships && memberships.length > 0) {
          const match = memberships.find(m => m.pantry_id === activePantryId);

          if (!activePantryId || !match) {
            // Default to the first pantry found
            activePantryId = memberships[0].pantry_id;
            activeRole = memberships[0].role;
            activeDetails = memberships[0].pantry;

            // Update the preference in background (if profile exists)
            if (profile) {
              await supabase.from('user_profiles')
                .update({ current_pantry_id: activePantryId })
                .eq('user_id', user.id);
            }
          } else {
            activeRole = match.role;
            activeDetails = match.pantry;
          }
        }

        // 5. Set State
        setAvailablePantries(memberships || []);
        setPantryId(activePantryId || null);
        setUserRole(activeRole || null);
        setPantryDetails(activeDetails || null);

      } catch (err) {
        // Improved Error Logging
        console.error('Error loading pantry context:', err.message || err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPantryData();
  }, [supabase]);

  return (
    <PantryContext.Provider value={{
      pantryId,
      userRole,
      pantryDetails,
      availablePantries,
      switchPantry,
      isLoading
    }}>
      {children}
    </PantryContext.Provider>
  );
}

export const usePantry = () => useContext(PantryContext);