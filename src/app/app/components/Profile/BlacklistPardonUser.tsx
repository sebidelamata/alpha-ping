import React, {
    useState,
    FormEvent
} from 'react'
import Loading from '../Loading'
import { useEtherProviderContext } from 'src/contexts/ProviderContext'
import { 
    Dialog, 
    DialogTrigger, 
    DialogContent, 
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter 
} from '@/components/components/ui/dialog'
import { 
    Button 
} from '@/components/components/ui/button'
import { 
    Avatar, 
    AvatarImage, 
    AvatarFallback 
} from '@/components/components/ui/avatar'
import Link from 'next/link'

interface BlacklistPardonUserProps{
    user: string;
    userPFP: string | null;
    username: string | null;
}

interface ErrorType{
    message: string;
}


const BlacklistPardonUser:React.FC<BlacklistPardonUserProps> = ({
    user, 
    userPFP, 
    username 
}) => {

    const { alphaPING, signer } = useEtherProviderContext()

    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const handleCancel = (e:MouseEvent) => {
        e.preventDefault()
        setOpen(false)
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        setError(null)
        // setTxMessageUnblacklist(null)
        setLoading(true)
        try{
            if(user && user !== undefined){
                const tx = await alphaPING?.connect(signer).unBlacklistUser(user)
                await tx?.wait()
                // setTxMessageUnblacklist(tx?.hash)
            }
        }catch(error: unknown){
            if((error as ErrorType).message)
            setError((error as ErrorType).message)
        }finally{
            setLoading(false)
        }

    }

    return(
        <Dialog
                open={open} 
                onOpenChange={setOpen}
            >
                <DialogTrigger>
                    <Button
                        variant={"secondary"}
                        className="w-[200px]"
                    >
                        Pardon User
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <span className="flex flex-row gap-1 items-center justify-center">
                                <span className="text-2xl">
                                    Pardon 
                                </span>
                                {
                                    (userPFP !== null && userPFP !== '') ?
                                    <Avatar>
                                        <AvatarImage
                                            src={userPFP} 
                                            alt="User Icon" 
                                            loading="lazy"
                                        />
                                        <AvatarFallback>
                                            {user.slice(0,2)}
                                        </AvatarFallback>
                                    </Avatar> :
                                    <Avatar>
                                        <AvatarImage
                                            src='/monkey.svg' 
                                            alt="User Icon" 
                                            loading="lazy"
                                        />
                                    </Avatar>
                                }
                                <Link
                                    href={`https://arbiscan.io/address/${user}`} 
                                    target="_blank"
                                    className="text-accent text-3xl"
                                >
                                    {
                                        (username !== null && username !== '') ?
                                        username :
                                        user.slice(0, 6) + '...' + user.slice(38, 42)
                                    }
                                </Link>
                                <span className="text-2xl">
                                    ?
                                </span>
                            </span>
                        </DialogTitle>
                        <DialogDescription className="flex flex-row items-center justify-center">
                            This will allow the blacklisted user to use AlphaPING again.
                        </DialogDescription>
                        <form
                            onSubmit={(e) => handleSubmit(e)}
                            className="flex flex-col items-center justify-center gap-4"
                        >
                            <Button 
                                type="submit"
                                variant="secondary" 
                                className="w-[200px]"
                            >
                                Pardon
                            </Button>
                            <Button
                                variant="outline"
                                className="w-[200px]"
                                onClick={(e) => handleCancel(e)} 
                            >
                                Cancel
                            </Button>
                        </form>
                    </DialogHeader>
                    {
                        loading === true &&
                            <Loading/>
                    }
                    {
                        error !== null &&
                        <DialogFooter className="relative right-3 flex w-full flex-row items-center justify-center pr-16 text-sm text-accent">
                            {
                                error.length > 50 ?
                                `${error.slice(0,50)}...` :
                                error
                            }
                        </DialogFooter>
                    }
                </DialogContent>
            </Dialog>
    )
}

export default BlacklistPardonUser