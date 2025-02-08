'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import BlacklistListItem from "./BlacklistListItem";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/components/ui/accordion"
import { ScrollArea } from "@/components/components/ui/scroll-area";

const BlacklistList:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()

    const [allUsers, setAllUsers] = useState<string[]>([])
    useEffect(() => {
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
        fetchAllUsers()
    }, [alphaPING])

    const [blacklistedUsers, setBlacklistedUsers] = useState<string[]>([])
    useEffect(() => {
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
        fetchBlacklistedUsers()
    },[allUsers, alphaPING])

    return(
        <AccordionItem 
            value={"blacklist"}
        >
            <AccordionTrigger>
                Blacklisted Users
            </AccordionTrigger>
            <AccordionContent
                className='max-h-64 overflow-y-auto' 
                onWheel={(e) => {
                    e.stopPropagation(); 
                }}
            >
            <ScrollArea className="h-64 rounded-md border">
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
                                />
                            </li>
                        ))
                    }
                </ul>
                </ScrollArea>
            </AccordionContent>
        </AccordionItem>
    )
}

export default BlacklistList