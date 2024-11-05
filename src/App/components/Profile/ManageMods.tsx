import React, {
    useState,
    useEffect
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import ManageModsListItem from "./ManageModsListItem";

const ManageMods:React.FC = () => {

    const { alphaPING } = useEtherProviderContext()

    const [allMods, setAllMods] = useState<(string | undefined)[]>([])
    const fetchAllMods = async () => {
        try{
            const totalChannels = await alphaPING?.totalChannels() || 0
            const mods = new Set<string | undefined>()
            for(let i=1; i<=(totalChannels || 0); i++){
                const result = await alphaPING?.mods(i)
                mods.add(result)
            }
            setAllMods([...mods])
        }catch(error){
            console.error(error)
        }
    }
    useEffect(() => {
        fetchAllMods()
    },[])

    return(
        <div className="manage-mods">
            <h3>Manage Mods</h3>
            <ul className="manage-mods-list">
                {
                    allMods.map((mod, index) => {
                        return(
                            <li key={index}>
                                <ManageModsListItem mod={mod}/>
                            </li>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default ManageMods;