'use client';

import React, {
    useState,
    useEffect,
    MouseEvent
} from "react";
import Link from "next/link";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import OwnerBanner from "./OwnerBanner";
import ModBanner from "./ModBanner";
import UsernameAndPFP from "./UsernameAndPFP";
import { DrawerContent, DrawerHeader, DrawerTitle } from "@/components/components/ui/drawer";
import {
    Avatar,
    AvatarImage
} from "@/components/components/ui/avatar"
import { 
    Tabs, 
    TabsContent, 
    TabsList, 
    TabsTrigger 
} from "@/components/components/ui/tabs"


const Profile: React.FC = () => {

    const { signer } = useEtherProviderContext()
    const { 
        owner, 
        mod,
        userProfilePic, 
        userUsername,
        account  
    } = useUserProviderContext()

    // pass tx message state to transferOwner
    const [txMessageOwner, setTxMessageOwner] = useState<string | null | undefined>(null)
    const [txMessageMod, setTxMessageMod] = useState<string | null | undefined>(null)

    // our options for tab in the profile section
    const [availableProfileTabs, setAvailableProfileTabs] = useState<string[]>([])
    // tabs only appear based on user role
    useEffect(() => {
        const setProfileTabs = () => {
            const tabsArray = ['edit']
            if(mod && mod.length > 0){
                tabsArray.push('mod')
            }
            if(owner === true){
                tabsArray.push('owner')
            }
            setAvailableProfileTabs(tabsArray)
        }
        setProfileTabs()
    }, [owner, mod, signer])

    return(
        <div className="mx-auto w-full max-w-sm">
            <DrawerContent className="">
                <DrawerHeader>
                    <DrawerTitle>
                        <Link
                            href={`https://arbiscan.io/address/${account}`}
                            target="_blank"
                            className="flex flex-row gap-4"
                        >
                            {
                                (
                                    userProfilePic !== null &&
                                    userProfilePic !== "" &&
                                    userProfilePic !== undefined
                                ) ?
                                <Avatar className=" justify-center object-contain">
                                    <AvatarImage 
                                    src={userProfilePic} 
                                    alt="user profile picture" 
                                    loading="lazy"
                                    />
                                </Avatar> :
                                <Avatar className="justify-center object-contain">
                                    <AvatarImage 
                                    src="/monkey.svg" 
                                    alt="default profile picture" 
                                    loading="lazy"
                                    />
                                </Avatar>
                            }
                            <h2
                                className="text-4xl"
                            >
                                {
                                    userUsername ?
                                    userUsername :
                                    `${account.slice(0,4)}...${account.slice(37,41)}`
                                }
                            </h2>
                        </Link>
                    </DrawerTitle>
                </DrawerHeader>
                <Tabs 
                    defaultValue="edit"
                >
                    <TabsList
                        className={`grid w-full grid-cols-3`}
                    >
                        {
                            availableProfileTabs &&
                            availableProfileTabs.length > 0 &&
                            availableProfileTabs.map((tab) => (
                                <TabsTrigger
                                    key={tab.toLowerCase()}
                                    value={tab.toLowerCase()}
                                >
                                    {tab}
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    <TabsContent value="edit">
                        <UsernameAndPFP/>
                    </TabsContent>
                    <TabsContent value="mod">
                        Mod
                    </TabsContent>
                    <TabsContent value="owner">
                        Owner
                    </TabsContent>
                </Tabs>
            </DrawerContent>
            {/* <ul className="profile-tabs">
                {
                    availableProfileTabs.map((tab) => {
                        return (
                            <li 
                                key={tab} 
                                id={tab}
                                onClick={(e) => handleTabClick(e)}
                                className={profileTabSelect === tab ? 'active' : ''}
                            >
                                {
                                    tab === 'edit' &&
                                    'Edit'
                                }
                                {
                                    tab === 'mod' &&
                                    'Mod'
                                }
                                {
                                    tab === 'owner' &&
                                    'Owner'
                                }
                            </li>
                        )
                    })
                }
            </ul>
            {
                profileTabSelect === 'owner' &&
                owner === true &&
                <OwnerBanner 
                    txMessageOwner={txMessageOwner} 
                    setTxMessageOwner={setTxMessageOwner}
                />
            }
            {
                profileTabSelect === 'owner' &&
                txMessageOwner !== null &&
                txMessageOwner !== undefined &&
                <p>
                    Ownership Transfer Confirmed!
                    <a 
                        href={`https://arbiscan.io/tx/${txMessageOwner}`}
                        target="_blank"
                    >
                        <strong>Transaction Link</strong>
                    </a>
                </p>
            }
            {
                profileTabSelect === 'mod' &&
                (
                    (mod && mod.length > 0) ||
                    owner === true
                ) &&
                <ModBanner
                    txMessageMod={txMessageMod}
                    setTxMessageMod={setTxMessageMod}
                />
            }
            {
                profileTabSelect === 'mod' &&
                txMessageMod !== null &&
                txMessageMod !== undefined &&
                <p>
                    Moderator Transfer Confirmed!
                    <a 
                        href={`https://arbiscan.io/tx/${txMessageMod}`}
                        target="_blank"
                    >
                        <strong>Transaction Link</strong>
                    </a>
                </p>
            } */}
            {/* {
                banned === true &&
                <div>
                    {
                        `You are currently Banned from ${currentChannel?.name.toString()}`
                    }
                </div>
            }
            {
                blacklisted === true &&
                <div>
                    {
                        `You are currently Blacklisted from AlphaPING`
                    }
                </div>
            } */}
            {/* {
                profileTabSelect === 'edit' &&
                <UsernameAndPFP/>
            } */}
        </div>   
    )
}

export default Profile