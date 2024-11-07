import React, {
    useState,
    FormEvent
} from "react";
import { useEtherProviderContext } from "../../contexts/ProviderContext";
import { useUserProviderContext } from "../../contexts/UserContext";
import UserRelations from "./UserRelations";

interface ErrorType {
    reason: string
}


const UsernameAndPFP:React.FC = () => {

    const { signer, alphaPING } = useEtherProviderContext()
    const { 
        account,
        userUsername,
        setUserUsername,
        userProfilePic,
        setUserProfilePic 
    } = useUserProviderContext()

    const [editPicOrName, setEditPicOrName] = useState<string>('picture')
    const [editProfileFormString, setEditProfileFormString] = useState<string>('')
    const [error, setError] = useState<string | null>(null)

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
                    setUserProfilePic(editProfileFormString)
                }
                if(editPicOrName === 'username'){
                    const tx = await alphaPING?.connect(signer).setUsername(editProfileFormString)
                    await tx?.wait()
                    setUserUsername(editProfileFormString)
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
        <div className="current-username-and-pic-container">
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
                            account !== null &&
                            <div className="current-username-value">
                                {`${account?.slice(0,4)}...${account?.slice(28,32)}`}
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
            <div className="following-block-container">
                <UserRelations/>
            </div>
        </div>
    )
}

export default UsernameAndPFP