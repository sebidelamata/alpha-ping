'use client';

import React from "react";
import vader from 'vader-sentiment'

const input = 'VADER is very smart, handsome, and funny';
const intensity = vader.SentimentIntensityAnalyzer.polarity_scores(input);
console.log(intensity);

const Analyze:React.FC = () => {
    return(
        <div>
            Analyze
        </div>
    )
}

export default Analyze;