/*
 * Unified chain‑metadata list (with Chain IDs)
 * --------------------------------------------------
 * Each entry provides:
 *   • chainId  – EVM chain ID (number) when applicable; omitted for non‑EVM chains
 *   • name     – Human‑readable chain name
 *   • explorer – Canonical block‑explorer base URL
 *   • icon     – URL to an SVG/PNG logo (standardized CDN)
 */

// Using more reliable and consistent icon sources
const TRUSTWALLET_ICONS = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';
const WEB3_ICONS = 'https://raw.githubusercontent.com/0xa3k5/web3icons/main/raw-svgs/networks/branded';
const CRYPTO_ICONS = 'https://cryptologos.cc/logos';

// Helper functions for different icon sources
const trustwallet = (slug: string) => `${TRUSTWALLET_ICONS}/${slug}/info/logo.png`;
const web3icon = (slug: string) => `${WEB3_ICONS}/${slug}.svg`;
const cryptologo = (slug: string, ext: string = 'svg') => `${CRYPTO_ICONS}/${slug}-logo.${ext}`;

export const CHAINS: ChainInfo[] = [
  { chainId: 1,        name: 'Ethereum',              explorer: 'https://etherscan.io',                       icon: trustwallet('ethereum') },
  { chainId: 250,      name: 'Fantom',                explorer: 'https://ftmscan.com',                        icon: trustwallet('fantom') },
  { chainId: 43114,    name: 'Avalanche C‑Chain',     explorer: 'https://snowtrace.io',                       icon: trustwallet('avalanchec') },
  { chainId: 137,      name: 'Polygon',               explorer: 'https://polygonscan.com',                    icon: trustwallet('polygon') },
  { chainId: 88,       name: 'Viction',               explorer: 'https://scan.viction.xyz',                   icon: cryptologo('viction') },
  { chainId: 10,       name: 'Optimism',              explorer: 'https://optimistic.etherscan.io',            icon: trustwallet('optimism') },
  { chainId: 42161,    name: 'Arbitrum One',          explorer: 'https://arbiscan.io',                        icon: trustwallet('arbitrum') },
  {                    name: 'Zilliqa',               explorer: 'https://viewblock.io/zilliqa',               icon: trustwallet('zilliqa') },
  { chainId: 25,       name: 'Cronos',                explorer: 'https://cronoscan.com',                      icon: trustwallet('cronos') },
  { chainId: 1666600000,name: 'Harmony',              explorer: 'https://explorer.harmony.one',               icon: trustwallet('harmony') },
  {                    name: 'Solana',                explorer: 'https://solscan.io',                         icon: trustwallet('solana') },
  {                    name: 'Terra Classic',         explorer: 'https://finder.terra.money/classic',         icon: cryptologo('terra-luna') },
  { chainId: 1284,     name: 'Moonbeam',              explorer: 'https://moonscan.io',                        icon: trustwallet('moonbeam') },
  { chainId: 1313161554,name: 'Aurora',               explorer: 'https://explorer.aurora.dev',                icon: cryptologo('aurora-near') },
  { chainId: 106,      name: 'Velas',                 explorer: 'https://evmexplorer.velas.com',              icon: trustwallet('velas') },
  { chainId: 1088,     name: 'Metis Andromeda',       explorer: 'https://andromeda-explorer.metis.io',        icon: cryptologo('metis-token') },
  { chainId: 1285,     name: 'Moonriver',             explorer: 'https://moonriver.moonscan.io',              icon: trustwallet('moonriver') },
  { chainId: 321,      name: 'KCC',                   explorer: 'https://scan.kcc.io',                        icon: cryptologo('kucoin-shares') },
  { chainId: 4689,     name: 'IoTeX',                 explorer: 'https://iotexscan.io',                       icon: trustwallet('iotex') },
  { chainId: 2001,     name: 'Milkomeda C1',          explorer: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com', icon: cryptologo('milkomeda') },
  {                    name: 'NEAR',                  explorer: 'https://nearblocks.io',                      icon: trustwallet('near') },
  {                    name: 'Everscale',             explorer: 'https://everscan.io',                        icon: cryptologo('everscale') },
  { chainId: 1030,     name: 'Conflux eSpace',        explorer: 'https://evm.confluxscan.io',                 icon: trustwallet('conflux') },
  { chainId: 10001,    name: 'EthereumPoW',           explorer: 'https://scan.ethw.xyz',                      icon: cryptologo('ethereum-pow-ethw') },
  {                    name: 'Stacks',                explorer: 'https://explorer.hiro.so',                   icon: trustwallet('stacks') },
  {                    name: 'TON',                   explorer: 'https://tonscan.org',                        icon: cryptologo('toncoin') },
  {                    name: 'Starknet',              explorer: 'https://starkscan.co',                       icon: cryptologo('starknet-token') },
  {                    name: 'Osmosis',               explorer: 'https://www.mintscan.io/osmosis',            icon: trustwallet('osmosis') },
  { chainId: 40,       name: 'Telos',                 explorer: 'https://www.teloscan.io',                    icon: cryptologo('telos') },
  { chainId: 100,      name: 'Gnosis Chain',          explorer: 'https://gnosisscan.io',                      icon: trustwallet('gnosis') },
  { chainId: 288,      name: 'Boba Network',          explorer: 'https://bobascan.com',                       icon: cryptologo('boba-network') },
  { chainId: 56,       name: 'BNB Smart Chain',       explorer: 'https://bscscan.com',                        icon: trustwallet('smartchain') },
  { chainId: 2020,     name: 'Ronin',                 explorer: 'https://app.roninchain.com',                 icon: cryptologo('ronin') },
  { chainId: 42220,    name: 'Celo',                  explorer: 'https://celoscan.io',                        icon: trustwallet('celo') },
  { chainId: 70,       name: 'Hoo Smart Chain',       explorer: 'https://hooscan.com',                        icon: cryptologo('hoo-token') },
  { chainId: 42262,    name: 'Oasis Network',         explorer: 'https://explorer.oasis.io/mainnet/emerald',  icon: trustwallet('oasis') },
  { chainId: 122,      name: 'Fuse',                  explorer: 'https://explorer.fuse.io',                   icon: trustwallet('fuse') },
  { chainId: 20,       name: 'Elastos',               explorer: 'https://esc.elastos.io',                     icon: trustwallet('elastos') },
  { chainId: 24,       name: 'KardiaChain',           explorer: 'https://explorer.kardiachain.io',            icon: cryptologo('kardiachain') },
  { chainId: 82,       name: 'Meter',                 explorer: 'https://scan.meter.io',                      icon: cryptologo('meter') },
  { chainId: 7700,     name: 'Canto',                 explorer: 'https://evm.explorer.canto.io',              icon: cryptologo('canto') },
  {                    name: 'Aptos',                 explorer: 'https://apscan.io',                          icon: trustwallet('aptos') },
  { chainId: 1101,     name: 'Polygon zkEVM',         explorer: 'https://zkevm.polygonscan.com',              icon: trustwallet('polygon') },
  { chainId: 1111,     name: 'Wemix',                 explorer: 'https://scope.wemix.com',                    icon: cryptologo('wemix-token') },
  { chainId: 8453,     name: 'Base',                  explorer: 'https://basescan.org',                       icon: web3icon('base') },
  { chainId: 59144,    name: 'Linea',                 explorer: 'https://lineascan.build',                    icon: cryptologo('linea') },
  { chainId: 534352,   name: 'Scroll',                explorer: 'https://scrollscan.com',                     icon: cryptologo('scroll') },
  { chainId: 5000,     name: 'Mantle',                explorer: 'https://mantlescan.info',                    icon: cryptologo('mantle') },
  { chainId: 81457,    name: 'Blast',                 explorer: 'https://blastscan.io',                       icon: cryptologo('blast') },
  { chainId: 34443,    name: 'Mode',                  explorer: 'https://modescan.io',                        icon: cryptologo('mode') },
  { chainId: 196,      name: 'X Layer',               explorer: 'https://www.okx.com/web3/explorer/xlayer',   icon: cryptologo('xlayer') },
  { chainId: 167000,   name: 'Taiko',                 explorer: 'https://taikoscan.io',                       icon: cryptologo('taiko') },
  {                    name: 'Sei v2',                explorer: 'https://seistream.app',                      icon: cryptologo('sei') },
  { chainId: 480,      name: 'World Chain',           explorer: 'https://worldscan.org',                      icon: cryptologo('worldcoin-wld') },
  { chainId: 146,      name: 'Sonic',                 explorer: 'https://sonicscan.org',                      icon: cryptologo('sonic-soniclabs') },
  { chainId: 1301,     name: 'Unichain',              explorer: 'https://unichain-sepolia.blockscout.com',    icon: cryptologo('uniswap') },
];