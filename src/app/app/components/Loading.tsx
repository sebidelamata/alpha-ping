'use client';

import React, {
    useState,
    useEffect
} from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/components/ui/dialog"
  import { Progress } from "@/components/components/ui/progress"

interface LoadingProps {
    text?: string;
}

const Loading:React.FC<LoadingProps> = ({text="NA"}) => {

    const [progress, setProgress] = useState<number>(13);

	useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 100 ? 0 : prev + 10));
        }, 500);

        return () => clearInterval(timer);
    }, []);

    return(
        <Dialog open={true}>
            <DialogContent className="items-center justify-center align-middle">
                <DialogHeader className="items-center justify-center align-middle">
                    {
                        text !== "NA" ? (
                            <DialogTitle className="items-center justify-center align-middle">
                                {text}
                            </DialogTitle>
                        ) : (
                            <DialogTitle className="items-center justify-center align-middle">
                                Waiting for transaction confirmation...
                            </DialogTitle>
                        )
                    }
                    <DialogDescription className="flex flex-col items-center justify-center space-y-4">
                        <img
                            src="/bananaPeeled.svg"
                            alt="Banana Peeled"
                            className="w-[70%] max-w-[500px] items-center justify-center object-contain"
                            loading="lazy"
                        />
                        <Progress 
                            value={progress} 
                            className="w-3/5 items-center justify-center bg-primary align-middle [&>div]:bg-accent"
                        />
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default Loading