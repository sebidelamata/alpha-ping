'use client';

import React, {
  createContext,
  useContext,
  useState,
  type ReactNode
} from 'react';

export type AaveDetailsContextType = {
    aaveAccount: AaveUserAccount | null;
    setAaveAccount: React.Dispatch<React.SetStateAction<AaveUserAccount | null>>;
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
    // user aave details
    // we need to find the user account details for aave if the user has any aave tokens
    const [aaveAccount, setAaveAccount] = useState<null | AaveUserAccount>(null)

  return (
    <AaveDetailsContext.Provider value={{
        aaveAccount,
        setAaveAccount
    }}>
      {children}
    </AaveDetailsContext.Provider>
  );
};
