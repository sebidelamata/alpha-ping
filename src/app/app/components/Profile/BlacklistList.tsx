'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import BlacklistListItem from "./BlacklistListItem";

const BlacklistList:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()
    const { txMessageBlacklist } = useUserProviderContext()

    //hold tx message for a ban
    const [txMessageUnblacklist, setTxMessageUnblacklist] = useState<string | null | undefined>(null)

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

    const [blacklistedUsers, setBlacklistedUsers] = useState<string[]>([])
    const fetchBlacklistedUsers = async () => {
        try{
            const blacklist = []
            for(let i=0; i<(allUsers?.length || 0); i++){
                const result = await alphaPING?.isBlackListed(allUsers[i])
                if(result === true){
                    blacklist.push(allUsers[i])
                }
            }
            setBlacklistedUsers(blacklist)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchBlacklistedUsers()
    },[allUsers, txMessageUnblacklist, txMessageBlacklist])

    return(
        <div className="blacklist-list">
            <h3 className="blacklist-list-header">
                Blacklisted Users
            </h3>
            {
                blacklistedUsers &&
                blacklistedUsers.length === 0 &&
                <div>
                    There are currently no Blacklisted Users on AlphaPING
                </div>
            }
            <ul className="blacklist-list-list">
                {
                    blacklistedUsers &&
                    blacklistedUsers.length > 0 &&
                    blacklistedUsers.map((user) => (
                        <li key={user} className="blacklist-list-item">
                            <BlacklistListItem 
                                user={user}
                                setTxMessageUnblacklist={setTxMessageUnblacklist}
                            />
                        </li>
                    ))
                }
            </ul>
            {
                txMessageUnblacklist !== null &&
                <a 
                    href={`https://arbiscan.io/tx/${txMessageUnblacklist}`}
                    target="_blank"
                    className="unblacklist-tx-msg"
                >
                    Pardon Succesful. View tx.
                </a>
            }
        </div>
    )
}

export default BlacklistList