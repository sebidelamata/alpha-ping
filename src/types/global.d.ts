// src/types/global.d.ts
import { 
  Address, 
  Hex, 
  Eip1193Provider 
} from "ethers";

declare global {

  interface Channel {
    id: number;
    tokenAddress: string;
    name: string;
    tokenType: string;
}
interface ExtendedEip1193Provider extends Eip1193Provider {
  on?: (event: string, listener: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, listener: (...args: unknown[]) => void) => void;
}
  interface Window {
    ethereum?: ethers.Eip1193Provider;
  }

  interface Message {
    _id: string; // Use string to align with MongoDB ObjectId type
    channel: string;
    account: string;
    text: string;
    timestamp: Date;
    messageTimestampTokenAmount: string;
    reactions: Record<string, string[]>; // Map of reaction types to lists of accounts
    replyId: string | null; // Use string to align with MongoDB ObjectId if necessary
  }

  interface SentimentScore {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
}

type SentimentScoresTimeseries = {
    time: number; // always numeric timestamp (ms)
    price?: number;
    market_cap?: number;
    volume?: number;
    score?: number;
    message?: Message; // full message object
};
interface tokenMetadataContract_address {
    contract_address: string;
    platform: {
        coin: {
            id: string;
            name: string;
            slug: string;
            symbol: string;
        };
        name: string;
    };
}

interface tokenMetadata {
    id: number;
    name: string;
    category: string;
    description: string;
    contract_address: tokenMetadataContract_address[];
    date_added: string;
    date_launched: string;
    infinite_supply: boolean;
    is_hidden: number;
    logo: string;
    notice: string;
    platform: {
      id: string;
      name: string;
      slug: string;
      symbol: string;
      token_address: string;
    };
    self_reported_market_circulating_supply: string;
    self_reported_market_cap: string;
    self_reported_tags: string;
    slug: string;
    subreddit: string;
    symbol: string;
    "tag-groups": string[];
    "tag-names": string[];
    tags: string[];
    twitter_username: string[];
    urls: {
        announcement: string[];
        chat: string[];
        explorer: string[];
        facebook: string[];
        message_board: string[];
        reddit: string[];
        source_code: string[];
        technical_doc: string[];
        twitter: string[];
        website: string[];
    };
    protocol?: string; // optional field to show if token is deposited in a protocol
}


interface CMCQuoteUSD {
    quote: {
        USD: {
            percent_change_24h: number;
            price: number;
            market_cap: number;
            percent_change_1h: number;
            percent_change_7d: number;
            percent_change_30d: number;
            percent_change_60d: number;
            volume_24h: number;
            volume_change_24h: number;
        };
    }
}
interface cmcPriceData{
    twentyFourHourChange: string;
    tokenUSDPrice: string;
    marketCap: string;
    percent_change_1h: string;
    percent_change_7d: string;
    percent_change_30d: string;
    percent_change_60d: string;
    volume_24h: string;
    volume_change_24h: string;
}

interface ChainInfo {
  name: string;
  explorer: string;
  icon: string;
  chainId?: number; // present only for EVM‑compatible chains
}

interface historicPriceData {
  time: number;       // timestamp in ms
  price: number;
  market_cap: number;
  volume: number;
}

// aave
interface AaveUserAccount {
  totalCollateral: string;
  totalDebt: string;
  availableBorrows: string;
  currentLiquidationThreshold: string;
  ltv: string;
  healthFactor: string;
}

interface AaveSupplyBorrowRate{
  supplyRate: string;
  borrowRate: borrowRate;
}

type Weighting = 'unweighted' | 'post' | 'current' | 'delta' | 'inverse';
type TimeFrame = 'all' | '1y' | '6m' | '3m' | '30d' | '7d' | '1d';

// token meta data for the trading interface
interface Token {
    address: string;
    chainId: number;
    decimals: number;
    symbol: string;
    name: string;
    logoURI: string | null;
  }
  
  interface TokenList {
    name: string;
    timestamp: string;
    version: {
      major: number;
      minor: number;
      patch: number;
    };
    keywords: string[];
    logoURI: string;
    tokens: Token[];
  }

  // This interface is subject to change as the API V2 endpoints aren't finalized.
interface PriceResponse {
    sellToken: string;
    buyToken: string;
    sellAmount: string;
    buyAmount: string;
    grossSellAmount: string;
    grossBuyAmount: string;
    allowanceTarget: Address;
    route: [];
    fees: {
      integratorFee: {
        amount: string;
        token: string;
        type: "volume" | "gas";
      } | null;
      zeroExFee: {
        billingType: "on-chain" | "off-chain";
        feeAmount: string;
        feeToken: Address;
        feeType: "volume" | "gas";
      };
      gasFee: null;
    } | null;
    issues: {
      allowance: {
        actual: string;
        spender: string;
      };
      balance: {
        token: string;
        actual: string;
        expected: string;
      };
      simulationIncomplete: boolean;
      invalidSourcesPassed: string[];
    }
    gas: string;
    gasPrice: string;
    auxiliaryChainData?: {
      l1GasEstimate?: number;
    };
  }
  
  // This interface is subject to change as the API V2 endpoints aren't finalized.
  interface QuoteResponse {
  blockNumber: string;
  buyAmount: string;
  buyToken: string;
  fees: {
      integratorFee: {
        amount: string;
        token: string;
        type: "volume" | "gas";
      } | null;
      zeroExFee: {
        billingType: "on-chain" | "off-chain";
        feeAmount: string;
        feeToken: Address;
        feeType: "volume" | "gas";
      };
      gasFee: null;
    } | null;
  issues: {
    allowance: {
      actual: string;
      spender: string;
    };
    balance: {
      token: string;
      actual: string;
      expected: string;
    };
    simulationIncomplete: boolean;
    invalidSourcesPassed: string[];
  };
  liquidityAvailable: boolean;
  minBuyAmount: string;
  permit2: {
    type: "Permit2";
    hash: string;
    eip712: {
      types: {
        PermitTransferFrom: {
          name: string;
          type: string;
        }[];
        TokenPermissions: {
          name: string;
          type: string;
        }[];
        EIP712Domain: {
          name: string;
          type: string;
        }[];
      };
      domain: {
        name: string;
        chainId: number;
        verifyingContract: string;
      };
      message: {
        permitted: {
          token: string;
          amount: string;
        };
        spender: string;
        nonce: string;
        deadline: string;
      };
      primaryType: "PermitTransferFrom";
    };
  };
  route: {
    fills: {
      from: string;
      to: string;
      source: string;
      proportionBps: string;
    }[];
    tokens: {
      address: string;
      symbol: string;
    }[];
  };
  sellAmount: string;
  sellToken: string;
  tokenMetadata: {
    buyToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
    sellToken: {
      buyTaxBps: string;
      sellTaxBps: string;
    };
  };
  totalNetworkFee: string;
  transaction: {
    to: string;
    data: string;
    gas: string;
    gasPrice: string;
    value: string;
  };
  zid: string;
}

  
  interface V2QuoteTransaction {
    data: Hex;
    gas: string | null;
    gasPrice: string;
    to: Address;
    value: string;
  }

  type SentimentScore = {
    compound: number;
    pos: number;
    neu: number;
    neg: number;
};

type TokenInfo = {
  address: string;
  symbol: string;
};

type ZeroExFee = {
  token: string;
  amount: string;
  amountUsd: string;
};

type Fees = {
  integratorFee: null | string; // could also be unknown type if not always null
  zeroExFee: ZeroExFee;
};

type AlphaPingSwapRecord = {
  appName: string;
  blockNumber: string;
  buyToken: string;
  buyAmount: string;
  chainId: number;
  chainName: string;
  fees: Fees;
  gasUsed: string;
  protocolVersion: string;
  sellToken: string;
  sellAmount: string;
  slippageBps: string;
  taker: string;
  timestamp: number;
  tokens: TokenInfo[];
  transactionHash: string;
  volumeUsd: string;
  zid: string;
  service: string;
};


}


