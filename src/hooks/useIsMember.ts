import {
    useState,
    useEffect,
} from "react";
import { useAppKitAccount } from "@reown/appkit/react";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useIsMember = (): {
    isMember: boolean, 
    setIsMember: React.Dispatch<React.SetStateAction<boolean>>,
    loading: boolean,
} => {

    const { isConnected } = useAppKitAccount()
    const { alphaPING, signer, isInitialized } = useEtherProviderContext()

    // is this user a member of the app
    const [isMember, setIsMember] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        const findIsMember = async () => {
        if (!signer || !alphaPING || !isInitialized) {
            console.log("Not ready to check membership:", { signer: !!signer, alphaPING: !!alphaPING, isInitialized });
            return;
        }
        try{
            setLoading(true)
            const isMember = await alphaPING?.isMember(signer)
            if(isMember){
            setIsMember(isMember)
            }
        } catch (error) {
            console.error("Error checking membership:", error);
        } finally{
            setLoading(false)
        }
        }
        findIsMember()
    }, [signer, isConnected, alphaPING, isInitialized])

    return {
        isMember,
        setIsMember,
        loading
    } 
}

export default useIsMember