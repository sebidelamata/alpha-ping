'use client';

import React, {
  createContext,
  useContext,
  useMemo,
  type ReactNode
} from 'react';
import useTokenMetadata from 'src/hooks/useTokenMetadata';
import useSetInitialCurrentChannel from 'src/hooks/useSetInitialCurrentChannel';

export type TokenMetadataContextType = {
  tokenMetaData: tokenMetadata[];
  tokenMetadataLoading: boolean;
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
  // fetch channel metadata
  const { tokenMetaData, tokenMetadataLoading }= useTokenMetadata()
   // set the default channel to the first in the list if one hasn't been selected yet
    useSetInitialCurrentChannel(tokenMetaData)

    const contextValue = useMemo(() => ({
      tokenMetaData,
      tokenMetadataLoading,
    }), [tokenMetaData, tokenMetadataLoading]);

  return (
    <TokenMetadataContext.Provider value={contextValue}>
      {children}
    </TokenMetadataContext.Provider>
  );
};
