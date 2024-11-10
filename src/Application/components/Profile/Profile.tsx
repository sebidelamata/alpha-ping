import React, {
    useState,
    useEffect,
    MouseEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import OwnerBanner from "./OwnerBanner";
import ModBanner from "./ModBanner";
import UsernameAndPFP from "./UsernameAndPFP";

const Profile: React.FC = () => {

    const { signer } = useEtherProviderContext()
    const { owner, mod } = useUserProviderContext()

    // pass tx message state to transferOwner
    const [txMessageOwner, setTxMessageOwner] = useState<string | null | undefined>(null)
    const [txMessageMod, setTxMessageMod] = useState<string | null | undefined>(null)

    // our options for tab in the profile section
    const [availableProfileTabs, setAvailableProfileTabs] = useState<string[]>([])
    // tabs only appear based on user role
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
    useEffect(() => {
        setProfileTabs()
    }, [owner, mod, signer])

    const [profileTabSelect, setProfileTabSelect] = useState<string>('edit')
    const handleTabClick = (e:MouseEvent) => {
        if(e !== null && e.target !== null){
            e.preventDefault()
            const value = e.target.id
            setProfileTabSelect(value)
            console.log(value)
        }
    }

    return(
        <div className="edit-profile-container">
            <h2 className="edit-profile-header">
                Profile
            </h2>
            <ul className="profile-tabs">
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
            }
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
            {
                profileTabSelect === 'edit' &&
                <UsernameAndPFP/>
            }
        </div>   
    )
}

export default Profile