import React from "react";
import { useUserProviderContext } from "../../contexts/UserContext";
import ModBannerListItem from "./ModBannerListItem";

interface ModBannerProps{
    txMessageMod: string | null | undefined; 
    setTxMessageMod: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const ModBanner:React.FC<ModBannerProps> = ({txMessageMod, setTxMessageMod}) => {

    const { mod } = useUserProviderContext()

    return(
        <div className="mod-banner">
            {
                mod &&
                mod.length > 0 &&
                <h3 className="mod-banner-header">
                    {
                        `You currently have Moderator admin role for:`
                    }
                </h3>
            }
            {
                mod &&
                mod.length > 0 &&
                <ul className="mod-ban-list">
                    {
                        mod.map((channel) => {
                            return(
                                <li key={channel.id}>
                                    <ModBannerListItem 
                                        channel={channel}
                                        txMessageMod={txMessageMod}
                                        setTxMessageMod={setTxMessageMod}
                                    />
                                </li>
                            )
                        })
                    }
                </ul>
            }
        </div>
    )
}

export default ModBanner;