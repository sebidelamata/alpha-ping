import {
    useState,
    useEffect
} from "react";
import weightTimeseries from "src/lib/weightTimeseries";

const useGetScoreTimeseries = (
    channelWeights: number[], 
    channelScores: SentimentScore[], 
    currentChanneltimeFilteredData: Message[]
) => {

    // grab score time series plus message
    const [scoreTimeseries, setScoreTimeseries] = useState<null | SentimentScoresTimeseries[]>(null)
    useEffect(() => {
        const getChannelScoreTimeseries = () => {
            if(
                channelScores.length > 0 &&
                channelWeights.length > 0 &&
                currentChanneltimeFilteredData !== null
            ){
                const timeseriesWeightedScores = weightTimeseries(channelWeights, channelScores)
                const timeseries: SentimentScoresTimeseries[] = channelScores.map((_, index) => {
                    const message = currentChanneltimeFilteredData[index];
                    const weighted = timeseriesWeightedScores[index];
                    if (message && weighted && typeof weighted.compound === 'number') {
                      return {
                        message,
                        score: weighted.compound,
                      };
                    }
                  }).filter((item): item is SentimentScoresTimeseries => item !== undefined);
                setScoreTimeseries(timeseries)
            } else {
                return null
            }
        }
        getChannelScoreTimeseries()
    }, [channelWeights, channelScores, currentChanneltimeFilteredData])

    return { scoreTimeseries }
}

export default useGetScoreTimeseries;