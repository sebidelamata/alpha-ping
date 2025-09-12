import { BeefyVault } from 'src/types/global';

// simple function to check if a token address is a beefy vault
export const isBeefyToken = (tokenAddress: string, beefyVaults: BeefyVault[]) => {
  if (!tokenAddress || beefyVaults.length === 0) return false;
  return beefyVaults.some(vault =>
    vault.tokenAddress?.toLowerCase() === tokenAddress.toLowerCase()
  );
};