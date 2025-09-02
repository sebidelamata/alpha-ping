'use client';

import React from "react";

interface ICustomTooltipProps {
  active?: boolean;
  payload?: unknown[];
  sellTokenObject?: Token;
}

const SellTokenUSDCustomTooltip: React.FC<ICustomTooltipProps> = ({ 
  active, 
  payload, 
  sellTokenObject 
}) => {
  if (active && payload && payload.length) {
    const data = (payload[0] as { payload: historicPriceData }).payload;

    const date = new Date(data.time);

    return (
      <div className="bg-primary text-secondary p-2 rounded shadow font-light">
        <p>{`Date: ${date.toLocaleString()}`}</p>

        {/* Market data */}
        {data.price !== undefined && <p>{`Price: ${data.price.toFixed(2)} ${sellTokenObject?.symbol}`}</p>}
        {data.market_cap !== undefined && (
          <p>{`Market Cap: ${(data.market_cap).toFixed(2)} of ${sellTokenObject?.symbol}`}</p>
        )}
        {data.volume !== undefined && (
          <p>{`Volume: ${(data.volume).toFixed(2)} of ${sellTokenObject?.symbol}`}</p>
        )}

      </div>
    );
  }
  return null;
};

export default SellTokenUSDCustomTooltip;
