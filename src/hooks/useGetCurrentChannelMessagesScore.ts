import {
    useState,
    useEffect,
    useMemo
} from "react";
import averageScores from "src/lib/averageScores";

const useGetCurrentChannelMessagesScore = (channelWeights: number[], channelScores: SentimentScore[]) => {

     // get the overall current channel score
    const [currentChannelMessagesScore, setcurrentChannelMessagesScore] = useState<SentimentScore | null>(null)
    useEffect(() => {
        const getCurrentChannelMessagesScore = () => {
            const averagedScores = averageScores(channelWeights, channelScores)
            setcurrentChannelMessagesScore(averagedScores)
        }
        getCurrentChannelMessagesScore()
    }, [channelWeights, channelScores])

    return useMemo(() => ({
        currentChannelMessagesScore
    }), [currentChannelMessagesScore]);

}

export default useGetCurrentChannelMessagesScore;