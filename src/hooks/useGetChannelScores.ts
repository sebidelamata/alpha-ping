import {
    useState,
    useEffect,
    useMemo
} from "react";
import vader from 'vader-sentiment'

const useGetChannelScores = (currentChanneltimeFilteredData: Message[]) => {

    // current channel
    const [channelScores, setChannelScores] = useState<SentimentScore[]>([])
    useEffect(() => {
        const getChannelScores = ():void => {
            const scores: SentimentScore[] = []
            currentChanneltimeFilteredData.forEach((message) => {
                if (typeof message.text === 'string') {
                    const score = vader.SentimentIntensityAnalyzer.polarity_scores(message.text)
                    if (score && typeof score.compound !== 'undefined') {
                        scores.push(score)
                    }
                }
            })
            setChannelScores(scores)
        }
        getChannelScores()
    }, [currentChanneltimeFilteredData])

    return useMemo(() => ({ channelScores }), [channelScores])
}

export default useGetChannelScores;