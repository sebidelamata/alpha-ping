'use client';

import React, {
    useState,
    useEffect,
} from "react";
import Link from "next/link";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import { useUserProviderContext } from "../../../../contexts/UserContext";
import OwnerBanner from "./OwnerBanner";
import ModBanner from "./ModBanner";
import UsernameAndPFP from "./UsernameAndPFP";
import UserRelations from "./UserRelations";
import { 
    DrawerContent, 
    DrawerHeader, 
    DrawerTitle 
} from "@/components/components/ui/drawer";
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
            <DrawerContent>
                <DrawerHeader>
                    <div className="flex items-center justify-center space-x-2">
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
                                    <Avatar className="justify-center object-contain">
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
                    </div>
                </DrawerHeader>
                <div className="flex items-center justify-center space-x-2">
                    <Tabs 
                        defaultValue="edit"
                        className="w-[400px]"
                    >
                        <TabsList
                            className="grid w-full grid-cols-3 bg-primary text-accent"
                        >
                            {
                                availableProfileTabs &&
                                availableProfileTabs.length > 0 &&
                                availableProfileTabs.map((tab) => (
                                    <TabsTrigger
                                        key={tab.toLowerCase()}
                                        value={tab.toLowerCase()}
                                        className="text-lg"
                                    >
                                        {String(tab).charAt(0).toUpperCase() + String(tab).slice(1)}
                                    </TabsTrigger>
                                ))
                            }
                        </TabsList>
                        <TabsContent value="edit">
                            <UsernameAndPFP/>
                            <UserRelations/>
                        </TabsContent>
                        <TabsContent value="mod">
                            <ModBanner/>
                        </TabsContent>
                        <TabsContent value="owner">
                            <OwnerBanner/>
                        </TabsContent>
                    </Tabs>
                </div>
            </DrawerContent>
        </div>   
    )
}

export default Profile