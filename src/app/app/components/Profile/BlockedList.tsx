'use client';

import React, {
    useState,
    useEffect
}  from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import BlockedListItem from "./BlockedListItem";

const BlockedList:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()
    const { txMessageBlock, account } = useUserProviderContext()

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

    const [blocks, setBlocks] = useState<string[]>([])
    const fetchBlocks = async () => {
        try{
            const followList = []
            for(let i=0; i<(allUsers?.length || 0); i++){
                const result = await alphaPING?.personalBlockList(account, allUsers[i]) || false
                if(result === true){
                    followList.push(allUsers[i])
                }
            }
            setBlocks(followList)
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchBlocks()
    },[allUsers, txMessageBlock])


    return(
        <div className="blocked-list-container">
            {
                blocks &&
                blocks.length === 0 &&
                <p>You haven't blocked anybody.</p>
            }
            <ul className="blocked-list">
                {
                    blocks &&
                    blocks.length > 0 &&
                    blocks.map((block) => {
                        return(
                            <li key={block}>
                                <BlockedListItem block={block}/>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default BlockedList;