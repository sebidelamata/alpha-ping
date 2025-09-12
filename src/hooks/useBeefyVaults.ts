// hooks/useBeefyVaults.ts
import { 
  useState, 
  useEffect,
  useMemo 
} from 'react';
import { BeefyVault } from 'src/types/global';
import useUserChannels from './useUserChannels';

const useBeefyVaults = () => {
  const { userChannels } = useUserChannels()
  const [beefyVaults, setBeefyVaults] = useState<BeefyVault[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeefyVaults = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/beefyFinanceVaults');
        const vaultsArray = await response.json();
        // Filter to Arbitrum only to reduce size, also only active vaults
        const arbitrumVaults = vaultsArray.filter((vault: BeefyVault) => 
          vault.chain === 'arbitrum' && vault.status === 'active'
        );
        setBeefyVaults(arbitrumVaults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if(
        (userChannels !== undefined) && 
        (userChannels !== null) && 
        userChannels.length > 0
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