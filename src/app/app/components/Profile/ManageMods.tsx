'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import ManageModsListItem from "./ManageModsListItem";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/components/ui/accordion"
import { ScrollArea } from "@/components/components/ui/scroll-area";
import {
    Card,
    CardHeader
  } from "@/components/components/ui/card"

const ManageMods:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()

    const [allMods, setAllMods] = useState<{ [mod: string]: number[] }>({})
    useEffect(() => {
        const fetchAllMods = async () => {
            try{
                const totalChannels = await alphaPING?.totalChannels() || 0
                const modsMap: { [mod: string]: number[] } = {}
                for(let i=1; i<=(totalChannels || 0); i++){
                    const result = await alphaPING?.mods(i)
                    if(result){
                        // first check if this address is already in the array
                        if (!modsMap[result]) {
                            modsMap[result] = []
                        }
                        modsMap[result].push(i)
                    }
                }
                setAllMods(modsMap)
            }catch(error){
                console.error(error)
            }
        }
        fetchAllMods()
    },[alphaPING])

    return(
            <AccordionItem 
                value={"mod"}
            > 
                <AccordionTrigger>
                    Manage Mods
                </AccordionTrigger>
                <AccordionContent 
                    className='max-h-64 overflow-y-auto' 
                    onWheel={(e) => {
                        e.stopPropagation(); 
                    }}>
                    <Card
                        className='max-h-64 overflow-y-auto bg-primary text-secondary' 
                        onWheel={(e) => {
                            e.stopPropagation(); 
                        }}
                    >
                        <ScrollArea className="h-64 rounded-md border">
                            <ul>
                                {   Object.entries(allMods).length > 0 &&
                                    Object.entries(allMods).map(([mod, channels], index) => {
                                        return(
                                            <li key={index}>
                                                <ManageModsListItem mod={{[mod]: channels}}/>
                                            </li>
                                        )
                                    })
                                }
                                {
                                    Object.entries(allMods).length <= 0 &&
                                    <CardHeader>
                                        There are no mods
                                    </CardHeader>
                                }
                            </ul>
                        </ScrollArea>
                    </Card>
                </AccordionContent>
            </AccordionItem>
    )
}

export default ManageMods;