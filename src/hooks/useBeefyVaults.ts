// hooks/useBeefyVaults.ts
import { 
  useState, 
  useEffect,
  useMemo,
  useRef 
} from 'react';
import { BeefyVault } from 'src/types/global';
import useUserChannels from './useUserChannels';

const useBeefyVaults = () => {
  const { userChannels } = useUserChannels()
  const [beefyVaults, setBeefyVaults] = useState<BeefyVault[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use ref to track if we've already fetched to prevent unnecessary re-fetches
  const hasFetched = useRef(false);

  useEffect(() => {
    const fetchBeefyVaults = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/beefyFinanceVaults');
        const vaultsArray = await response.json();
        // Filter to Arbitrum only to reduce size, also inactive vaults for legacy channels vaults
        const arbitrumVaults = await vaultsArray.filter((vault: BeefyVault) => 
          vault.chain === 'arbitrum'
        );
        setBeefyVaults(await arbitrumVaults);
        hasFetched.current = true;
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
        !hasFetched.current
    ){
      fetchBeefyVaults();
    }
  }, [userChannels]);

  const context = useMemo(() => ({
    beefyVaults,
    loading,
    error,
  }), [beefyVaults, loading, error]);

  return context;
};

export default useBeefyVaults;