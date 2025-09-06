import {
    useState,
    useEffect,
    useMemo
} from "react";
import weightTimeseries from "src/lib/weightTimeseries";

type Timeseries = {
    score: number;
    message: Message; // full message object
};

const useGetScoreTimeseries = (
    channelWeights: number[], 
    channelScores: SentimentScore[], 
    currentChanneltimeFilteredData: Message[],
    historicPriceData: historicPriceData[],
) => {

    // grab score time series plus message
    const [scoreTimeseries, setScoreTimeseries] = useState<null | SentimentScoresTimeseries[]>(null)
    useEffect(() => {
        const getChannelScoreTimeseries = () => {
            if(
                channelScores.length > 0 &&
                channelWeights.length > 0 &&
                currentChanneltimeFilteredData !== null &&
                historicPriceData.length > 0
            ){
                const timeseriesWeightedScores = weightTimeseries(channelWeights, channelScores)
                const timeseries: Timeseries[] = channelScores.map((_, index) => {
                    const message = currentChanneltimeFilteredData[index];
                    const weighted = timeseriesWeightedScores[index];
                    if (message && weighted && typeof weighted.compound === 'number') {
                      return {
                        message,
                        score: weighted.compound,
                      };
                    }
                  }).filter((item): item is Timeseries => item !== undefined);
                  console.log("timeseries", timeseries);
                    // merge the two timeseries, sort by time, and remove duplicates
                    const mergedAll: SentimentScoresTimeseries[] = [
                    // Sentiment data — derive `time` directly from message object
                    ...timeseries.map(s => ({
                        time: new Date(s.message.timestamp).getTime(),
                        message: s.message,
                        score: s.score
                    })),
                    // Market data already has time
                    ...historicPriceData
                    ]
                    .sort((a, b) => a.time - b.time)
                    .reduce<SentimentScoresTimeseries[]>((acc, point) => {
                    const last = acc[acc.length - 1];
                    if (last && last.time === point.time) {
                        acc[acc.length - 1] = { ...last, ...point };
                    } else {
                        acc.push(point);
                    }
                    return acc;
                    }, []);
                    console.log("mergedAll", mergedAll);
                setScoreTimeseries(mergedAll)
            } else {
                return null
            }
        }
        getChannelScoreTimeseries()
    }, [channelWeights, channelScores, currentChanneltimeFilteredData, historicPriceData])

    return useMemo(() => ({
        scoreTimeseries
    }), [scoreTimeseries]);
}

export default useGetScoreTimeseries;