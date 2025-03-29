declare module "vader-sentiment" {
    export const SentimentIntensityAnalyzer: {
        polarity_scores: (text: string) => {
            compound: number;
            pos: number;
            neu: number;
            neg: number;
        };
    };
}
