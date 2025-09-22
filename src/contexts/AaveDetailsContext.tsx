'use client';

import React, {
  createContext,
  useContext,
  type ReactNode
} from 'react';
import useUserAaveDetails from 'src/hooks/useUserAaveDetails';

export type AaveDetailsContextType = {
    aaveAccount: AaveUserAccount | null;
};

const AaveDetailsContext = createContext<AaveDetailsContextType | undefined>(undefined);

export const useAaveDetailsContext = (): AaveDetailsContextType => {
  const context = useContext(AaveDetailsContext);
  if (!context) {
    throw new Error("useCMCPriceDataContext must be used within CMCPriceDataContextProvider");
  }
  return context;
};

export const AaveDetailsProvider = ({ children }: { children: ReactNode }) => {

    // set the user aave details
    const { aaveAccount } = useUserAaveDetails()

  return (
    <AaveDetailsContext.Provider value={{aaveAccount}}>
      {children}
    </AaveDetailsContext.Provider>
  );
};
