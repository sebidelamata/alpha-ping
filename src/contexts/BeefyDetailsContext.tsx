'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import useBeefyVaults from 'src/hooks/useBeefyVaults';
import useBeefyLPsBreakdown from 'src/hooks/useBeefyLPsBreakdown';

export type BeefyDetailsContextType = {
    beefyVaults: ReturnType<typeof useBeefyVaults>['beefyVaults'];
    beefyLPs: ReturnType<typeof useBeefyLPsBreakdown>['beefyLPs'];
};

const BeefyDetailsContext = createContext<BeefyDetailsContextType | undefined>(undefined);

export const useBeefyDetailsContext = (): BeefyDetailsContextType => {
  const context = useContext(BeefyDetailsContext);
  if (!context) {
    throw new Error("useBeefyDetailsContext must be used within BeefyDetailsContextProvider");
  }
  return context;
};

export const BeefyDetailsProvider = ({ children }: { children: ReactNode }) => {
    // user beefy details
    // grab our beefy vaults to check against
    const { beefyVaults } = useBeefyVaults()
    console.log("Beefy Vaults: ", beefyVaults)
    const vaultIds = useMemo(() => 
        beefyVaults.map(vault => vault.id), 
        [beefyVaults]
    );
    const { beefyLPs } = useBeefyLPsBreakdown(vaultIds)

    const contextValue = useMemo(() => ({
        beefyVaults,
        beefyLPs
    }), [beefyVaults, beefyLPs]);

  return (
    <BeefyDetailsContext.Provider value={contextValue}>
      {children}
    </BeefyDetailsContext.Provider>
  );
};
