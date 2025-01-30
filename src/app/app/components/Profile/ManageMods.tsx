'use client';

import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../../../contexts/ProviderContext";
import ManageModsListItem from "./ManageModsListItem";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/components/ui/accordion"

const ManageMods:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()

    const [allMods, setAllMods] = useState<{ [mod: string]: number[] }>({})
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
    useEffect(() => {
        fetchAllMods()
        console.log(allMods)
    },[])

    return(
            <AccordionItem 
                value={"mod"}
            > 
                <AccordionTrigger>
                    Manage Mods
                </AccordionTrigger>
                <AccordionContent>
                    <ul className="manage-mods-list">
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
                            <p>
                                There are no mods
                            </p>
                        }
                    </ul>
                </AccordionContent>
            </AccordionItem>
    )
}

export default ManageMods;