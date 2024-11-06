import React, {
    useState,
    useEffect
}  from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import FollowingListItem from "./FollowingListItem";

const FollowingList:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()
    const { txMessageFollow, account } = useUserProviderContext()

    const [allUsers, setAllUsers] = useState<string[]>([])
    const fetchAllUsers = async() => {
        try{
            const totalUsers = await alphaPING?.totalSupply() || 0
            const allUsers = []
            for(let i=1; i<=totalUsers; i++){
                const address = await alphaPING?.ownerOf(i)
                if(address !== undefined){
                    allUsers.push(address)
                }
            }
            setAllUsers(allUsers)
        }catch(error){
            console.error(error)
        }
        
    }
    useEffect(() => {
        fetchAllUsers()
    }, [])

    const [follows, setFollows] = useState<string[]>([])
    const fetchFollows = async () => {
        try{
            const followList = []
            for(let i=0; i<(allUsers?.length || 0); i++){
                const result = await alphaPING?.personalFollowList(account, allUsers[i])
                if(result === true){
                    followList.push(allUsers[i])
                }
            }
            setFollows(followList)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchFollows()
    },[allUsers, txMessageFollow])

    return(
        <div className="following-list-container">
            <h4 className="following-list-title">
                Following:
            </h4>
            {
                follows &&
                follows.length === 0 &&
                <p>
                    You are not following anyone.
                </p>
            }
            {
                follows &&
                follows.length > 0 &&
                <ul className="following-list">
                    {
                        follows.map((follow) => {
                            return(
                                <li key={follow}>
                                    <FollowingListItem follow={follow}/>
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}

export default FollowingList;