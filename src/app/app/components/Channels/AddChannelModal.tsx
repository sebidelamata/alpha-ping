import React, {
    useState
} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/components/ui/dialog"

const AddChannelModal:React.FC = () => {
    const[error, setError] = useState<string | null>(null)

    return(
        <Dialog open={true}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Add Channel
                    </DialogTitle>
                    <DialogDescription>
                        Enter the address of any token (ERC-20) or NFT (ERC-721).
                        {
                            error !== null &&
                            <h2>{error}</h2>
                        }
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default AddChannelModal;