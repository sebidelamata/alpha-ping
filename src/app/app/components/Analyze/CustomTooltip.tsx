'use client';

import React from "react";

interface ICustomTooltipProps {
    active?: boolean;
    payload?: Array<{ payload: SentimentScoresTimeseries }>;
}

// Custom Tooltip Component for timeseries chart
const CustomTooltip:React.FC = ({ active, payload }: ICustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as SentimentScoresTimeseries; // Full data object
        const date = data.message.timestamp instanceof Date ? data.message.timestamp : new Date(data.message.timestamp);
        const score = `${(data.score * 100).toFixed(2).toString()}%`;
        return (
            <div className="bg-primary text-secondary p-2 rounded shadow font-light">
                <p>{`Date: ${date.toLocaleDateString()}`}</p>
                <p>{`Score: ${score}`}</p>
            </div>
        );
    }
    return null;
};

export default CustomTooltip;