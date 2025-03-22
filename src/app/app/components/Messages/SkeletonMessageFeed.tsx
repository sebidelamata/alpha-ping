'use client';

import React from "react";
import { 
    Card, 
    CardHeader, 
    CardTitle,
    CardContent, 
    CardDescription 
} from "@/components/components/ui/card";
import { Skeleton } from "@/components/components/ui/skeleton";

const SkeletonMessageFeed:React.FC = () => {

    const indexArray:null[] = new Array(8).fill(null);


    return(
        <ul>
            {
                indexArray.map((_, index) => {
                    return(
                        <li key={index}>
                            <Card 
                                className="flex flex-cols-2 bg-primary text-secondary w-full" 
                                key={index}
                            >
                                <CardHeader className='flex flex-col items-center'>
                                        <CardTitle className="relative left-[25%] top-[70%]">
                                            No Messages to Display.
                                        </CardTitle>
                                        <Skeleton className="h-12 w-12 rounded-full" />
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-6 w-16 rounded-md" />
                                </CardHeader>
                                <CardContent className="flex flex-col w-full gap-4">
                                    <CardDescription className='flex flex-col gap-4 flex-wrap'>
                                        <div className="flex justify-start items-center lg:gap-16 med:gap-8 sm:gap-4 flex-wrap">
                                            <Skeleton className="h-4 w-[500px]" />
                                            <Skeleton className="h-4 w-[500px]" />
                                            <Skeleton className="h-4 w-[500px]" />
                                        </div>
                                    </CardDescription>
                                    <div className='flex flex-col gap-8 justify-start w-full'>
                                        <Skeleton className="h-4 w-[500px]" />
                                        <Skeleton className="h-4 w-[500px]" />
                                        <Skeleton className="h-4 w-[500px]" />
                                    </div>
                                </CardContent>
                            </Card>
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default SkeletonMessageFeed;