/// <reference types="vite/client" />

interface Channel {
    id: number; // or uint256 if necessary
    tokenAddress: string; // Assuming the token address is represented as a string
    name: string;
    tokenType: string;
}

interface Window {
    ethereum?: any; // You can provide a more specific type if available
}

interface Message {
    id: number;
    channel: string;
    account: string;
    text: string;
    timestamp: Date;
    messageTimestampTokenAmount: number;
    reactions: Record<string, string[]>;
  }

  interface tokenMetadataContract_address{
    contract_address: string;
    platform: {
        coin: {
            id: string;
            name: string;
            slug: string;
            symbol: string;
        }
        name: string;
    }
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
        coin: {
            id: string;
            name: string;
            slug: string;
            symbol: string;
        }
        name: string;
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
    }
}