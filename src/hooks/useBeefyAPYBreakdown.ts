// hooks/useBeefyLPsBreakdown.ts
import { 
  useState, 
  useEffect,
  useMemo,
  useRef 
} from 'react';
import { BeefyAPYBreakdown } from 'src/types/global';
import useUserChannels from './useUserChannels';

const useBeefyAPYBreakdown = (userVaults:string[]) => {
  const { userChannels } = useUserChannels()
  const [beefyAPYs, setBeefyAPYs] = useState<BeefyAPYBreakdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Track previous vault IDs to prevent unnecessary re-fetches
  const prevVaultIds = useRef<string>();
  
  // Create stable reference for userVaults comparison
  const vaultIdsString = useMemo(() => {
    return userVaults.sort().join(',');
  }, [userVaults]);

  useEffect(() => {
    const fetchBeefyAPY = async () => {
      if (prevVaultIds.current === vaultIdsString) return;
      setLoading(true);
      try {
        const response = await fetch('/api/beefyAPYBreakdown');
        const APYArray = await response.json();
        // Filter to only the user's vaults
        const userAPYBreakdowns = Object.entries(APYArray).filter(([tokenId]) => 
          userVaults.includes(tokenId)
        )
        setBeefyAPYs(userAPYBreakdowns as unknown as BeefyAPYBreakdown[]);
        prevVaultIds.current = vaultIdsString;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if(
        (userChannels !== undefined) && 
        (userChannels !== null) && 
        userChannels.length > 0 &&
        (userVaults !== undefined) && 
        (userVaults !== null) && 
        userVaults.length > 0 &&
        prevVaultIds.current !== vaultIdsString
    ){
      fetchBeefyAPY();
    }
  }, [userChannels, userVaults, vaultIdsString]);

  const context = {
    beefyAPYs,
    loading,
    error,
  }

  return context;
};

export default useBeefyAPYBreakdown;