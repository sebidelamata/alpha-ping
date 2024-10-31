import React from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import { useChannelProviderContext } from "../../contexts/ChannelContext";
import ModBannerListItem from "./ModBannerListItem";

interface ModBannerProps{
    txMessageMod: string | null | undefined; 
    setTxMessageMod: React.Dispatch<React.SetStateAction<string | null | undefined>>;
}

const ModBanner:React.FC<ModBannerProps> = ({txMessageMod, setTxMessageMod}) => {

    const { alphaPING, signer } = useEtherProviderContext()
    const { mod, setMod } = useUserProviderContext()
    const { currentChannel } = useChannelProviderContext()

    return(
        <div className="mod-banner">
            {
                mod &&
                mod.length > 0 &&
                <h3 className="mod-banner-header">
                    {
                        `You are currently have Moderator admin role for:`
                    }
                </h3>
            }
            {
                mod &&
                mod.length > 0 &&
                <ul>
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