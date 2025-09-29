import { 
    useState, 
    useEffect,
} from "react";
import { useEtherProviderContext } from "src/contexts/ProviderContext";

const useReplyUsernameAndPFP = (reply: Message | null) => {

    const { alphaPING } = useEtherProviderContext()

    const [replyPFP, setReplyPFP] = useState<string | null>(null)
    const [replyUsername, setReplyUsername] = useState<string | null>(null)

    // if there is a reply get username and profile pic to original post
    useEffect(() => {
      const fetchReplyPFP = async () => {
        if(reply && reply !== null){
          const replyPFP = await alphaPING?.profilePic(reply.account) || null
          setReplyPFP(replyPFP)
        }
      }
      fetchReplyPFP()
      const fetchReplyUsername = async () => {
        if(reply && reply !== null){
          const replyUsername = await alphaPING?.username(reply.account) || null
          setReplyUsername(replyUsername)
        }
      }
      fetchReplyUsername()
    }, [alphaPING, reply])

    return {
        replyPFP,
        replyUsername
    }

}

export default useReplyUsernameAndPFP;