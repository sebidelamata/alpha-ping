import { 
    useState, 
    useEffect,
} from "react";
import vader from 'vader-sentiment'

const useGetScores = (timeFilteredData: Message[] | null) => {

     // get message scores
    // all channels
    const [scores, setScores] = useState<SentimentScore[]>([])
    useEffect(() => {
        const getScores = ():void => {
            if(timeFilteredData !== null){
                const scores: SentimentScore[] = []
                timeFilteredData.forEach((message) => {
                    if (typeof message.text === 'string') {
                        const score = vader.SentimentIntensityAnalyzer.polarity_scores(message.text)
                        if (score && typeof score.compound !== 'undefined') {
                            scores.push(score)
                        }
                    }
                })
                setScores(scores)
            }
        }
        getScores()
    }, [timeFilteredData])

    return {
        scores
    }
}

export default useGetScores;
