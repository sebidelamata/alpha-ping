'use client';

import React, {
    useEffect,
    useState
} from "react";
import vader from 'vader-sentiment'
import { useChannelProviderContext } from "src/contexts/ChannelContext";
import { useMessagesProviderContext } from "src/contexts/MessagesContext";
import { mockMessages } from "mocks/mockMessages";
import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent, 
    CardFooter 
} from "@/components/components/ui/card";

const Analyze:React.FC = () => {

    const { 
        selectedChannelMetadata, 
        currentChannel 
    } = useChannelProviderContext()
    const { messages } = useMessagesProviderContext()
    
    const [allMessagesScore, setallMessagesScore] = useState<null | number>(null)

    useEffect(() => {
        const getAllMessagesScore = () => {
            const input = mockMessages.map((message) => {
                return message.text
            })
            .join()
            console.log(input)
            const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
            setallMessagesScore(intensity.compound)
            console.log(intensity);
        }
        getAllMessagesScore()
    }, [messages])

    return(
        <Card
        className="flex flex-col w-full h-full bg-primary text-secondary overflow-clip"
        onWheel={(e) => {
        e.stopPropagation(); 
      }}
        >
            <CardHeader>
                <CardTitle>
                    Analyze
                </CardTitle>
            </CardHeader>
            <CardContent
                className='flex-1 h-full w-full'
            >
                {
                    allMessagesScore !== null &&
                    <p>{allMessagesScore}</p>
                }
            </CardContent>
        </Card>
    )
}

export default Analyze;