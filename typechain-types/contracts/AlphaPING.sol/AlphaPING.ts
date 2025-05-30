/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  AddressLike,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "../../common";

export declare namespace AlphaPING {
  export type ChannelStruct = {
    id: BigNumberish;
    tokenAddress: AddressLike;
    name: string;
    tokenType: string;
  };

  export type ChannelStructOutput = [
    id: bigint,
    tokenAddress: string,
    name: string,
    tokenType: string
  ] & { id: bigint; tokenAddress: string; name: string; tokenType: string };
}

export interface AlphaPINGInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "addToPersonalBlockList"
      | "addToPersonalFollowList"
      | "approve"
      | "balanceOf"
      | "banMod"
      | "blacklistUser"
      | "channelBan"
      | "channelBans"
      | "channelExistsForToken"
      | "channelUnban"
      | "channels"
      | "createChannel"
      | "getApproved"
      | "getChannel"
      | "hasJoinedChannel"
      | "isApprovedForAll"
      | "isBlackListed"
      | "isMember"
      | "isSubscriptionActive"
      | "joinChannel"
      | "leaveChannel"
      | "mint"
      | "mods"
      | "monthDuration"
      | "name"
      | "owner"
      | "ownerOf"
      | "personalBlockList"
      | "personalFollowList"
      | "premiumMembershipExpiry"
      | "profilePic"
      | "promoPeriod"
      | "purchaseMonthlySubscription"
      | "removeFromPersonalBlockList"
      | "removeFromPersonalFollowList"
      | "safeTransferFrom(address,address,uint256)"
      | "safeTransferFrom(address,address,uint256,bytes)"
      | "setApprovalForAll"
      | "setProfilePic"
      | "setSubscriptionCurrency"
      | "setSubscriptionPriceMonthly"
      | "setUsername"
      | "subscriptionCurrency"
      | "subscriptionPriceMonthly"
      | "supportsInterface"
      | "symbol"
      | "togglePromoPeriod"
      | "tokenURI"
      | "totalChannels"
      | "totalSupply"
      | "transferFrom"
      | "transferMod"
      | "transferOwner"
      | "unBlacklistUser"
      | "username"
      | "withdraw"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic: "Approval" | "ApprovalForAll" | "Transfer"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "addToPersonalBlockList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "addToPersonalFollowList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "approve",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "balanceOf",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "banMod",
    values: [AddressLike, BigNumberish[]]
  ): string;
  encodeFunctionData(
    functionFragment: "blacklistUser",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "channelBan",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "channelBans",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "channelExistsForToken",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "channelUnban",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "channels",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "createChannel",
    values: [AddressLike, string]
  ): string;
  encodeFunctionData(
    functionFragment: "getApproved",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "getChannel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "hasJoinedChannel",
    values: [BigNumberish, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isApprovedForAll",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isBlackListed",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isMember",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "isSubscriptionActive",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "joinChannel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "leaveChannel",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "mint", values?: undefined): string;
  encodeFunctionData(functionFragment: "mods", values: [BigNumberish]): string;
  encodeFunctionData(
    functionFragment: "monthDuration",
    values?: undefined
  ): string;
  encodeFunctionData(functionFragment: "name", values?: undefined): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "ownerOf",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "personalBlockList",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "personalFollowList",
    values: [AddressLike, AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "premiumMembershipExpiry",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "profilePic",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "promoPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "purchaseMonthlySubscription",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "removeFromPersonalBlockList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "removeFromPersonalFollowList",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    values: [AddressLike, AddressLike, BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setApprovalForAll",
    values: [AddressLike, boolean]
  ): string;
  encodeFunctionData(
    functionFragment: "setProfilePic",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setSubscriptionCurrency",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "setSubscriptionPriceMonthly",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(functionFragment: "setUsername", values: [string]): string;
  encodeFunctionData(
    functionFragment: "subscriptionCurrency",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "subscriptionPriceMonthly",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "supportsInterface",
    values: [BytesLike]
  ): string;
  encodeFunctionData(functionFragment: "symbol", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "togglePromoPeriod",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "tokenURI",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "totalChannels",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "totalSupply",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "transferFrom",
    values: [AddressLike, AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferMod",
    values: [AddressLike, BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwner",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "unBlacklistUser",
    values: [AddressLike]
  ): string;
  encodeFunctionData(
    functionFragment: "username",
    values: [AddressLike]
  ): string;
  encodeFunctionData(functionFragment: "withdraw", values?: undefined): string;

  decodeFunctionResult(
    functionFragment: "addToPersonalBlockList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "addToPersonalFollowList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "approve", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "balanceOf", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "banMod", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "blacklistUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "channelBan", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "channelBans",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "channelExistsForToken",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "channelUnban",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "channels", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "createChannel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getApproved",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "getChannel", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "hasJoinedChannel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isApprovedForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isBlackListed",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "isMember", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "isSubscriptionActive",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "joinChannel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "leaveChannel",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "mint", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "mods", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "monthDuration",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "name", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "ownerOf", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "personalBlockList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "personalFollowList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "premiumMembershipExpiry",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "profilePic", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "promoPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "purchaseMonthlySubscription",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeFromPersonalBlockList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "removeFromPersonalFollowList",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "safeTransferFrom(address,address,uint256,bytes)",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setApprovalForAll",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setProfilePic",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSubscriptionCurrency",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setSubscriptionPriceMonthly",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setUsername",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subscriptionCurrency",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "subscriptionPriceMonthly",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "supportsInterface",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "symbol", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "togglePromoPeriod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "tokenURI", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "totalChannels",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "totalSupply",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferFrom",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferMod",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwner",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unBlacklistUser",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "username", data: BytesLike): Result;
  decodeFunctionResult(functionFragment: "withdraw", data: BytesLike): Result;
}

export namespace ApprovalEvent {
  export type InputTuple = [
    owner: AddressLike,
    approved: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [owner: string, approved: string, tokenId: bigint];
  export interface OutputObject {
    owner: string;
    approved: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace ApprovalForAllEvent {
  export type InputTuple = [
    owner: AddressLike,
    operator: AddressLike,
    approved: boolean
  ];
  export type OutputTuple = [
    owner: string,
    operator: string,
    approved: boolean
  ];
  export interface OutputObject {
    owner: string;
    operator: string;
    approved: boolean;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace TransferEvent {
  export type InputTuple = [
    from: AddressLike,
    to: AddressLike,
    tokenId: BigNumberish
  ];
  export type OutputTuple = [from: string, to: string, tokenId: bigint];
  export interface OutputObject {
    from: string;
    to: string;
    tokenId: bigint;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface AlphaPING extends BaseContract {
  connect(runner?: ContractRunner | null): AlphaPING;
  waitForDeployment(): Promise<this>;

  interface: AlphaPINGInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  addToPersonalBlockList: TypedContractMethod<
    [_blockedAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  addToPersonalFollowList: TypedContractMethod<
    [_followedAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  approve: TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  balanceOf: TypedContractMethod<[owner: AddressLike], [bigint], "view">;

  banMod: TypedContractMethod<
    [_bannedMod: AddressLike, _channelIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;

  blacklistUser: TypedContractMethod<
    [_blacklistedUser: AddressLike],
    [void],
    "nonpayable"
  >;

  channelBan: TypedContractMethod<
    [_bannedAccount: AddressLike, _channelId: BigNumberish],
    [void],
    "nonpayable"
  >;

  channelBans: TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;

  channelExistsForToken: TypedContractMethod<
    [arg0: AddressLike],
    [boolean],
    "view"
  >;

  channelUnban: TypedContractMethod<
    [_bannedAccount: AddressLike, _channelId: BigNumberish],
    [void],
    "nonpayable"
  >;

  channels: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, string, string, string] & {
        id: bigint;
        tokenAddress: string;
        name: string;
        tokenType: string;
      }
    ],
    "view"
  >;

  createChannel: TypedContractMethod<
    [_tokenAddress: AddressLike, _tokenType: string],
    [void],
    "nonpayable"
  >;

  getApproved: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  getChannel: TypedContractMethod<
    [_channelId: BigNumberish],
    [AlphaPING.ChannelStructOutput],
    "view"
  >;

  hasJoinedChannel: TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;

  isApprovedForAll: TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;

  isBlackListed: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isMember: TypedContractMethod<[arg0: AddressLike], [boolean], "view">;

  isSubscriptionActive: TypedContractMethod<
    [_subscriber: AddressLike],
    [boolean],
    "view"
  >;

  joinChannel: TypedContractMethod<
    [_channelId: BigNumberish],
    [void],
    "nonpayable"
  >;

  leaveChannel: TypedContractMethod<
    [_channelId: BigNumberish],
    [void],
    "nonpayable"
  >;

  mint: TypedContractMethod<[], [void], "nonpayable">;

  mods: TypedContractMethod<[arg0: BigNumberish], [string], "view">;

  monthDuration: TypedContractMethod<[], [bigint], "view">;

  name: TypedContractMethod<[], [string], "view">;

  owner: TypedContractMethod<[], [string], "view">;

  ownerOf: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  personalBlockList: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;

  personalFollowList: TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;

  premiumMembershipExpiry: TypedContractMethod<
    [arg0: AddressLike],
    [bigint],
    "view"
  >;

  profilePic: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  promoPeriod: TypedContractMethod<[], [boolean], "view">;

  purchaseMonthlySubscription: TypedContractMethod<[], [void], "nonpayable">;

  removeFromPersonalBlockList: TypedContractMethod<
    [_blockedAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  removeFromPersonalFollowList: TypedContractMethod<
    [_followedAddress: AddressLike],
    [void],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256)": TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  "safeTransferFrom(address,address,uint256,bytes)": TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;

  setApprovalForAll: TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;

  setProfilePic: TypedContractMethod<
    [_picString: string],
    [void],
    "nonpayable"
  >;

  setSubscriptionCurrency: TypedContractMethod<
    [_subscriptionCurrency: AddressLike],
    [void],
    "nonpayable"
  >;

  setSubscriptionPriceMonthly: TypedContractMethod<
    [_newSubscriptionPrice: BigNumberish],
    [void],
    "nonpayable"
  >;

  setUsername: TypedContractMethod<[_username: string], [void], "nonpayable">;

  subscriptionCurrency: TypedContractMethod<[], [string], "view">;

  subscriptionPriceMonthly: TypedContractMethod<[], [bigint], "view">;

  supportsInterface: TypedContractMethod<
    [interfaceId: BytesLike],
    [boolean],
    "view"
  >;

  symbol: TypedContractMethod<[], [string], "view">;

  togglePromoPeriod: TypedContractMethod<[], [void], "nonpayable">;

  tokenURI: TypedContractMethod<[tokenId: BigNumberish], [string], "view">;

  totalChannels: TypedContractMethod<[], [bigint], "view">;

  totalSupply: TypedContractMethod<[], [bigint], "view">;

  transferFrom: TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferMod: TypedContractMethod<
    [_newMod: AddressLike, _channelId: BigNumberish],
    [void],
    "nonpayable"
  >;

  transferOwner: TypedContractMethod<
    [_newOwner: AddressLike],
    [void],
    "nonpayable"
  >;

  unBlacklistUser: TypedContractMethod<
    [_blacklistedUser: AddressLike],
    [void],
    "nonpayable"
  >;

  username: TypedContractMethod<[arg0: AddressLike], [string], "view">;

  withdraw: TypedContractMethod<[], [void], "nonpayable">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "addToPersonalBlockList"
  ): TypedContractMethod<[_blockedAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "addToPersonalFollowList"
  ): TypedContractMethod<[_followedAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "approve"
  ): TypedContractMethod<
    [to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "balanceOf"
  ): TypedContractMethod<[owner: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "banMod"
  ): TypedContractMethod<
    [_bannedMod: AddressLike, _channelIds: BigNumberish[]],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "blacklistUser"
  ): TypedContractMethod<[_blacklistedUser: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "channelBan"
  ): TypedContractMethod<
    [_bannedAccount: AddressLike, _channelId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "channelBans"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "channelExistsForToken"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "channelUnban"
  ): TypedContractMethod<
    [_bannedAccount: AddressLike, _channelId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "channels"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [bigint, string, string, string] & {
        id: bigint;
        tokenAddress: string;
        name: string;
        tokenType: string;
      }
    ],
    "view"
  >;
  getFunction(
    nameOrSignature: "createChannel"
  ): TypedContractMethod<
    [_tokenAddress: AddressLike, _tokenType: string],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "getApproved"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "getChannel"
  ): TypedContractMethod<
    [_channelId: BigNumberish],
    [AlphaPING.ChannelStructOutput],
    "view"
  >;
  getFunction(
    nameOrSignature: "hasJoinedChannel"
  ): TypedContractMethod<
    [arg0: BigNumberish, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isApprovedForAll"
  ): TypedContractMethod<
    [owner: AddressLike, operator: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "isBlackListed"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isMember"
  ): TypedContractMethod<[arg0: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "isSubscriptionActive"
  ): TypedContractMethod<[_subscriber: AddressLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "joinChannel"
  ): TypedContractMethod<[_channelId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "leaveChannel"
  ): TypedContractMethod<[_channelId: BigNumberish], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "mint"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "mods"
  ): TypedContractMethod<[arg0: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "monthDuration"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "name"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "owner"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "ownerOf"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "personalBlockList"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "personalFollowList"
  ): TypedContractMethod<
    [arg0: AddressLike, arg1: AddressLike],
    [boolean],
    "view"
  >;
  getFunction(
    nameOrSignature: "premiumMembershipExpiry"
  ): TypedContractMethod<[arg0: AddressLike], [bigint], "view">;
  getFunction(
    nameOrSignature: "profilePic"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "promoPeriod"
  ): TypedContractMethod<[], [boolean], "view">;
  getFunction(
    nameOrSignature: "purchaseMonthlySubscription"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeFromPersonalBlockList"
  ): TypedContractMethod<[_blockedAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "removeFromPersonalFollowList"
  ): TypedContractMethod<[_followedAddress: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256)"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "safeTransferFrom(address,address,uint256,bytes)"
  ): TypedContractMethod<
    [
      from: AddressLike,
      to: AddressLike,
      tokenId: BigNumberish,
      data: BytesLike
    ],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setApprovalForAll"
  ): TypedContractMethod<
    [operator: AddressLike, approved: boolean],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setProfilePic"
  ): TypedContractMethod<[_picString: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "setSubscriptionCurrency"
  ): TypedContractMethod<
    [_subscriptionCurrency: AddressLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setSubscriptionPriceMonthly"
  ): TypedContractMethod<
    [_newSubscriptionPrice: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "setUsername"
  ): TypedContractMethod<[_username: string], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "subscriptionCurrency"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "subscriptionPriceMonthly"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "supportsInterface"
  ): TypedContractMethod<[interfaceId: BytesLike], [boolean], "view">;
  getFunction(
    nameOrSignature: "symbol"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "togglePromoPeriod"
  ): TypedContractMethod<[], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "tokenURI"
  ): TypedContractMethod<[tokenId: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "totalChannels"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "totalSupply"
  ): TypedContractMethod<[], [bigint], "view">;
  getFunction(
    nameOrSignature: "transferFrom"
  ): TypedContractMethod<
    [from: AddressLike, to: AddressLike, tokenId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferMod"
  ): TypedContractMethod<
    [_newMod: AddressLike, _channelId: BigNumberish],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "transferOwner"
  ): TypedContractMethod<[_newOwner: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "unBlacklistUser"
  ): TypedContractMethod<[_blacklistedUser: AddressLike], [void], "nonpayable">;
  getFunction(
    nameOrSignature: "username"
  ): TypedContractMethod<[arg0: AddressLike], [string], "view">;
  getFunction(
    nameOrSignature: "withdraw"
  ): TypedContractMethod<[], [void], "nonpayable">;

  getEvent(
    key: "Approval"
  ): TypedContractEvent<
    ApprovalEvent.InputTuple,
    ApprovalEvent.OutputTuple,
    ApprovalEvent.OutputObject
  >;
  getEvent(
    key: "ApprovalForAll"
  ): TypedContractEvent<
    ApprovalForAllEvent.InputTuple,
    ApprovalForAllEvent.OutputTuple,
    ApprovalForAllEvent.OutputObject
  >;
  getEvent(
    key: "Transfer"
  ): TypedContractEvent<
    TransferEvent.InputTuple,
    TransferEvent.OutputTuple,
    TransferEvent.OutputObject
  >;

  filters: {
    "Approval(address,address,uint256)": TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;
    Approval: TypedContractEvent<
      ApprovalEvent.InputTuple,
      ApprovalEvent.OutputTuple,
      ApprovalEvent.OutputObject
    >;

    "ApprovalForAll(address,address,bool)": TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;
    ApprovalForAll: TypedContractEvent<
      ApprovalForAllEvent.InputTuple,
      ApprovalForAllEvent.OutputTuple,
      ApprovalForAllEvent.OutputObject
    >;

    "Transfer(address,address,uint256)": TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
    Transfer: TypedContractEvent<
      TransferEvent.InputTuple,
      TransferEvent.OutputTuple,
      TransferEvent.OutputObject
    >;
  };
}
