// hooks/useBeefyLPsBreakdown.ts
import { 
  useState, 
  useEffect,
  useMemo 
} from 'react';
import { BeefyLPBreakdown } from 'src/types/global';
import useUserChannels from './useUserChannels';

const useBeefyLPsBreakdown = (userVaults:string[]) => {
  const { userChannels } = useUserChannels()
  const [beefyLPs, setBeefyLPs] = useState<BeefyLPBreakdown[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBeefyVaults = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/beefyLPBreakdown');
        const LPsArray = await response.json();
        // Filter to only the user's vaults
        const userLPsBreakdowns = Object.entries(LPsArray).filter(([tokenId]) => 
          userVaults.includes(tokenId)
        );
        setBeefyLPs(userLPsBreakdowns as unknown as BeefyLPBreakdown[]);
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
        userVaults.length > 0
    ){
      fetchBeefyVaults();
    }
  }, [userChannels, userVaults]);

  const context = useMemo(() => ({
    beefyLPs,
    loading,
    error,
  }), [beefyLPs, loading, error]);

  return context;
};

export default useBeefyLPsBreakdown;