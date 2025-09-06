'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode
} from 'react';

export type CMCPriceDataContextType = {
    cmcFetch: cmcPriceData;
    setCmcFetch: React.Dispatch<React.SetStateAction<cmcPriceData>>;
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
    // channel price from cmc
    const [cmcFetch, setCmcFetch] = useState<cmcPriceData>({
                twentyFourHourChange: "",
                tokenUSDPrice: "",
                marketCap: "",
                percent_change_1h: "",
                percent_change_7d: "",
                percent_change_30d: "",
                percent_change_60d: "",
                volume_24h: "",
                volume_change_24h: ""
    } as cmcPriceData);

    const contextValues = useMemo(() => ({
        cmcFetch,
        setCmcFetch
    }), [cmcFetch]);

  return (
    <CMCPriceDataContext.Provider value={contextValues}>
      {children}
    </CMCPriceDataContext.Provider>
  );
};
