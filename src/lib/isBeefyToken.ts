import { BeefyVault } from 'src/types/global';

// simple function to check if a token address is a beefy vault
export const isBeefyToken = (tokenAddress: string, beefyVaults: BeefyVault[]) => {
  if (!tokenAddress || beefyVaults.length === 0) return false;
  console.log('Checking if token is a Beefy vault:', tokenAddress);
  console.log( beefyVaults.some(vault =>
    vault.earnedTokenAddress?.toLowerCase() === tokenAddress.toLowerCase()
  ))
  return beefyVaults.some(vault =>
    vault.earnedTokenAddress?.toLowerCase() === tokenAddress.toLowerCase()
  );
};