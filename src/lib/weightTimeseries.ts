import { SentimentScore } from "src/types/global"

const weightTimeseries = (weights: number[], scores: SentimentScore[]):SentimentScore[] => {
    if(weights.length > 0 && scores.length > 0){
        // get weighted scores
        const weightedScores:SentimentScore[] = weights.map((weight, index) => {
            return {
                "compound": weight * scores[index].compound,
                "pos": weight * scores[index].pos,
                "neu": weight * scores[index].neu,
                "neg": weight * scores[index].neg
            }
        })
        return weightedScores
    } else {
        return []
    }
}

export default weightTimeseries;