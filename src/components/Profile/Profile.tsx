import React, {
    useState,
    useEffect,
    FormEvent
} from "react";
import { type Signer } from 'ethers'
import { useEtherProviderContext } from "../../contexts/ProviderContext";

interface ErrorType {
    reason: string
}

const Profile: React.FC = () => {

    const { signer, alphaPING } = useEtherProviderContext()

    const [editPicOrName, setEditPicOrName] = useState<string>('picture')
    const [editProfileFormString, setEditProfileFormString] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

    const [userAddress, setUserAddress] = useState<string | null>(null)
    const getUserAddress = async(signer: Signer | null) => {
        if(signer !== null){
            setUserAddress(await signer.getAddress())
        }
    }
    useEffect(() => {
        getUserAddress(signer)
    }, [signer])

    // grab user picture
    const [userProfilePic, setUserProfilePic] = useState<string | null>(null)
    const fetchUserProfilePic = async (userAddress: string | null) => {
        if(userAddress !== null){
            const profilePic = await alphaPING?.profilePic(userAddress)
            if(profilePic === undefined){
                setUserProfilePic(null)
            } else {
                setUserProfilePic(profilePic)
            }
            console.log(userProfilePic)
        }
    }
    useEffect(() => {
        fetchUserProfilePic(userAddress)
    }, [userAddress])

    // grab username
    const [userUsername, setUserUsername] = useState<string | null>(null)
    const fetchUserUsername = async (userAddress: string | null) => {
        if(userAddress !== null){
            const username = await alphaPING?.username(userAddress)
            if(username === undefined){
                setUserUsername(null)
            } else {
                setUserUsername(username)
            }
        }
    }
    useEffect(() => {
        fetchUserUsername(userAddress)
    }, [userAddress])

    const handleProfileEditFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setEditProfileFormString(value)
    }

    const handleEditProfileSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null);
        try{
            if(signer !== null){
                if(editPicOrName === 'picture'){
                    // Validate image URL
                    const isValidImageURL = /\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i.test(editProfileFormString)
                    if (!isValidImageURL) {
                        setError(
                            "Invalid image URL. Please enter a URL ending with .jpg, .jpeg, .png, .gif., or .webp"
                        )
                        return
                    }
                    const tx = await alphaPING?.connect(signer).setProfilePic(editProfileFormString)
                    await tx?.wait()
                    fetchUserProfilePic(userAddress)
                }
                if(editPicOrName === 'username'){
                    const tx = await alphaPING?.connect(signer).setUsername(editProfileFormString)
                    await tx?.wait()
                    fetchUserUsername(userAddress)
                }
            }
        }catch(error: unknown){
            if((error as ErrorType).reason){
                setError((error as ErrorType).reason)
            }
            if(error){
                console.log(error)
            }
        }
    }

    return(
        <div className="edit-profile-container">
            <h2 className="edit-profile-header">
                Edit Profile
            </h2>
            <div className="current-username-and-pic">
                <div className="current-profile-pic">
                    {
                        (
                            userProfilePic !== null &&
                            userProfilePic !== undefined &&
                            userProfilePic !== ''
                        )
                        ?
                        <img 
                            src={userProfilePic} 
                            alt="default profile" 
                            className="edit-profile-image"
                        /> :
                        <img 
                            src="/monkey.svg" 
                            alt="default profile" 
                            className="edit-profile-image"
                        />
                    }
                </div>
                <div className="current-username">
                    {
                        userUsername ?
                            <div className="current-username-value">
                                {userUsername}
                            </div> :
                            userAddress !== null &&
                            <div className="current-username-value">
                                {`${userAddress?.slice(0,4)}...${userAddress?.slice(28,32)}`}
                            </div>
                    }
                </div>
            </div>
            <div className="edit-profile-row-two">
                <div className="edit-profile-pic-container">
                    <button
                        type="button"
                        className={
                            editPicOrName !== 'picture'?
                            "edit-button" :
                            "edit-button edit-button-selected"
                        }
                        onClick={() => setEditPicOrName("picture")}
                    >
                        Edit Profile Picture
                    </button>
                </div>
                <div className="edit-username-container">
                    <button
                        type="button"
                        className={
                            editPicOrName !== 'username'?
                            "edit-button" :
                            "edit-button edit-button-selected"
                        }
                        onClick={() => setEditPicOrName('username')}
                    >
                        Edit Username
                    </button>
                </div>
            </div>
            <form 
                action="" 
                className="edit-profile-form"
                onSubmit={(e) => handleEditProfileSubmit(e)}
            >
                <div className="edit-profile-form-row-two">
                    <input 
                        type="text" 
                        placeholder={
                            editPicOrName === "picture" ?
                            "Enter Image URL..." :
                            "Enter New Username"
                        }
                        value={editProfileFormString}
                        onChange={(e) => handleProfileEditFormChange(e)}
                    />
                    <button 
                        className="edit-profile-form-submit-button"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
                {
                    error && 
                    <div className="error-message">
                        {error}
                    </div>
                }
            </form>
        </div>   
    )
}

export default Profile