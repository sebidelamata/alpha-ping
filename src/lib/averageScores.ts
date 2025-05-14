
const averageScores = (weights: number[], scores: SentimentScore[]):SentimentScore | null => {
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
        // sum them to find avgs
        const sumScores = weightedScores.reduce(
            (acc, curr) => {
              return {
                "compound": acc.compound + curr.compound,
                "pos": acc.pos + curr.pos,
                "neu": acc.neu + curr.neu,
                "neg": acc.neg + curr.neg,
              };
            },
            { 
                "compound": 0, 
                "pos": 0, 
                "neu": 0, 
                "neg": 0 
            }
        )
        const averagedScores = {
            "compound": Number(
                (sumScores.compound / weightedScores.length)
                .toFixed(2)
            ),
            "pos": Number(
                (sumScores.pos / weightedScores.length)
                .toFixed(2)
            ),
            "neu": Number(
                (sumScores.neu / weightedScores.length)
                .toFixed(2)
            ),
            "neg": Number(
                (sumScores.neg / weightedScores.length)
                .toFixed(2)
            )
        }
        return averagedScores
    } else {
        return null
    }
}

export default averageScores;