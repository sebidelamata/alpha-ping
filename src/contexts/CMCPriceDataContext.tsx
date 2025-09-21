'use client';

import React, {
  createContext,
  useContext,
  type ReactNode
} from 'react';
import useCMCPriceData from 'src/hooks/useCMCPriceData';

export type CMCPriceDataContextType = {
    cmcFetch: cmcPriceData;
    cmcLoading: boolean;
    cmcError: string | null;
};

const CMCPriceDataContext = createContext<CMCPriceDataContextType | undefined>(undefined);

export const useCMCPriceDataContext = (): CMCPriceDataContextType => {
  const context = useContext(CMCPriceDataContext);
  if (!context) {
    throw new Error("useCMCPriceDataContext must be used within CMCPriceDataContextProvider");
  }
  return context;
};

export const CMCPriceDataProvider = ({ children }: { children: ReactNode }) => {
    
    // get cmc price data
    const { cmcFetch, cmcLoading, cmcError } = useCMCPriceData();
  
  

  return (
    <CMCPriceDataContext.Provider value={{
      cmcFetch, 
      cmcLoading, 
      cmcError
    }}>
      {children}
    </CMCPriceDataContext.Provider>
  );
};
