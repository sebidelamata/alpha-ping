'use client';

import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode
} from 'react';

export type TokenMetadataContextType = {
  tokenMetaData: tokenMetadata[];
  setTokenMetaData: React.Dispatch<React.SetStateAction<tokenMetadata[]>>;
  tokenMetadataLoading: boolean;
  setTokenMetadataLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

const TokenMetadataContext = createContext<TokenMetadataContextType | undefined>(undefined);

export const useTokenMetadataContext = (): TokenMetadataContextType => {
  const context = useContext(TokenMetadataContext);
  if (!context) {
    throw new Error("useTokenMetadataContext must be used within TokenMetadataProvider");
  }
  return context;
};

export const TokenMetadataProvider = ({ children }: { children: ReactNode }) => {
  const [tokenMetaData, setTokenMetaData] = useState<tokenMetadata[]>([]);
  // token metadata loading state
    const [tokenMetadataLoading, setTokenMetadataLoading] = useState<boolean>(false)

    const contextValue = useMemo(() => ({
      tokenMetaData,
      setTokenMetaData,
      tokenMetadataLoading,
      setTokenMetadataLoading
    }), [tokenMetaData, tokenMetadataLoading]);

  return (
    <TokenMetadataContext.Provider value={contextValue}>
      {children}
    </TokenMetadataContext.Provider>
  );
};
