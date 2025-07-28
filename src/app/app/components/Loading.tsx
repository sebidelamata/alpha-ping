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
            <DialogContent className="items-center justify-center align-middle h-68 sm:h-84 md:h-100 lg:h-[400px]">
                <DialogHeader className="backdrop-blur-md bg-secondary/20 dark:bg-primary/20 rounded-lg p-6 border border-secondary/30 shadow-lg z-10 relative">
                    <img
                        src="/bananaPeeled.svg"
                        alt="Banana Peeled"
                        className="absolute opacity-20 h-64 sm:h-80 md:h-96 lg:h-[400px] object-contain
                                    top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                                    sm:left-1/4 sm:translate-x-0 md:left-1/6 lg:left-1/8
                                    z-0" 
                        loading="lazy"
                    />
                            {
                                text !== "NA" ? (
                                    <DialogTitle className="items-center justify-center align-middle text-3xl">
                                        {text}
                                    </DialogTitle>
                                ) : (
                                    <DialogTitle className="items-center justify-center align-middle text-3xl">
                                        Waiting for transaction confirmation...
                                    </DialogTitle>
                                )
                            }
                    <DialogDescription className="flex flex-col items-center justify-center space-y-4">
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