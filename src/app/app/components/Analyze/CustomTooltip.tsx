'use client';

import React from "react";

interface ICustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: SentimentScoresTimeseries }>;
  label?: string;
}

const CustomTooltip: React.FC<ICustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as SentimentScoresTimeseries;

    const date = new Date(data.time);
    const score = data.score !== undefined 
      ? `${(data.score * 100).toFixed(2)}%`
      : "N/A";

    return (
      <div className="bg-primary text-secondary p-2 rounded shadow font-light">
        <p>{`Date: ${date.toLocaleString()}`}</p>

        {/* Sentiment score */}
        {data.score !== undefined && <p>{`Score: ${score}`}</p>}

        {/* Market data */}
        {data.price !== undefined && <p>{`Price: $${data.price.toFixed(2)}`}</p>}
        {data.market_cap !== undefined && (
          <p>{`Market Cap: $${(data.market_cap / 1e9).toFixed(2)}B`}</p>
        )}
        {data.volume !== undefined && (
          <p>{`Volume: $${(data.volume / 1e9).toFixed(2)}B`}</p>
        )}

        {/* Message */}
        {data.message && (
          <>
            <p className="mt-1 italic">"{data.message.text}"</p>
            <p className="text-xs text-muted-foreground">
              by {data.message.account}
            </p>
          </>
        )}
      </div>
    );
  }
  return null;
};

export default CustomTooltip;
