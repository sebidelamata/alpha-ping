import {
    useState,
    useEffect,
} from "react";
import averageScores from "src/lib/averageScores";

const useGetAllMessagesScore = (weights: number[], scores: SentimentScore[]) => {
    // get scores from filtered and weighted data
    // all messages
    const [allMessagesScore, setAllMessagesScore] = useState<SentimentScore | null>(null)
    useEffect(() => {
        const getAllMessagesScore = () => {
            const averagedScores = averageScores(weights, scores)
            setAllMessagesScore(averagedScores)
        }
        getAllMessagesScore()
    }, [scores, weights])

    return { allMessagesScore }
}

export default useGetAllMessagesScore;