/*
 * Unified chain‑metadata list (with Chain IDs)
 * --------------------------------------------------
 * Each entry provides:
 *   • chainId  – EVM chain ID (number) when applicable; omitted for non‑EVM chains
 *   • name     – Human‑readable chain name
 *   • explorer – Canonical block‑explorer base URL
 *   • icon     – URL to an SVG/PNG logo (standardized CDN)
 *   • coinId   – CoinMarketCap coin ID for the native token
 */

// Using more reliable and consistent icon sources
const TRUSTWALLET_ICONS = 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains';
const WEB3_ICONS = 'https://raw.githubusercontent.com/0xa3k5/web3icons/main/raw-svgs/networks/branded';
const CRYPTO_ICONS = 'https://cryptologos.cc/logos';

// Helper functions for different icon sources
const trustwallet = (slug: string) => `${TRUSTWALLET_ICONS}/${slug}/info/logo.png`;
const web3icon = (slug: string) => `${WEB3_ICONS}/${slug}.svg`;
const cryptologo = (slug: string, ext: string = 'svg') => `${CRYPTO_ICONS}/${slug}-logo.${ext}`;

interface ChainInfo {
  chainId?: number;
  name: string;
  explorer: string;
  icon: string;
  coinId?: string;
}

export const CHAINS: ChainInfo[] = [
  { chainId: 1,        name: 'Ethereum',              explorer: 'https://etherscan.io',                       icon: trustwallet('ethereum'),     coinId: '1027' },
  { chainId: 250,      name: 'Fantom',                explorer: 'https://explorer.fantom.network',                        icon: trustwallet('fantom'),       coinId: '3513' },
  { chainId: 43114,    name: 'Avalanche C‑Chain',     explorer: 'https://snowtrace.io',                       icon: trustwallet('avalanchec'),   coinId: '5805' },
  { chainId: 137,      name: 'Polygon',               explorer: 'https://polygonscan.com',                    icon: trustwallet('polygon'),      coinId: '28321' },
  { chainId: 88,       name: 'Viction',               explorer: 'https://www.vicscan.xyz',                   icon: web3icon('viction'),      coinId: '2570' },
  { chainId: 10,       name: 'Optimism',              explorer: 'https://optimistic.etherscan.io',            icon: trustwallet('optimism'),     coinId: '11840' },
  { chainId: 42161,    name: 'Arbitrum One',          explorer: 'https://arbiscan.io',                        icon: trustwallet('arbitrum'),     coinId: '11841' },
  {                    name: 'Zilliqa',               explorer: 'https://viewblock.io/zilliqa',               icon: trustwallet('zilliqa'),      coinId: '2469' },
  { chainId: 25,       name: 'Cronos',                explorer: 'https://cronoscan.com',                      icon: trustwallet('cronos'),       coinId: '3635' },
  { chainId: 1666600000,name: 'Harmony',              explorer: 'https://explorer.harmony.one',               icon: trustwallet('harmony'),      coinId: '3945' },
  {                    name: 'Solana',                explorer: 'https://solscan.io',                         icon: trustwallet('solana'),       coinId: '5426' },
  {                    name: 'Terra Classic',         explorer: 'https://finder.terra.money/classic',         icon: trustwallet('terra'),    coinId: '4172' },
  { chainId: 1284,     name: 'Moonbeam',              explorer: 'https://moonscan.io',                        icon: trustwallet('moonbeam'),     coinId: '6836' },
  { chainId: 1313161554,name: 'Aurora',               explorer: 'https://explorer.aurora.dev',                icon: web3icon('aurora'),   coinId: '14803' },
  { chainId: 106,      name: 'Velas',                 explorer: 'https://evmexplorer.velas.com',              icon: web3icon('velas'), coinId: '4747' },
  { chainId: 1088,     name: 'Metis Andromeda',       explorer: 'https://andromeda-explorer.metis.io',        icon: trustwallet('metis'),   coinId: '9640' },
  { chainId: 1285,     name: 'Moonriver',             explorer: 'https://moonriver.moonscan.io',              icon: trustwallet('moonriver'),    coinId: '9285' },
  { chainId: 321,      name: 'KCC',                   explorer: 'https://scan.kcc.io',                        icon: trustwallet('kcc'), coinId: '2087' },
  { chainId: 4689,     name: 'IoTeX',                 explorer: 'https://iotexscan.io',                       icon: web3icon('iotex'),        coinId: '2777' },
  { chainId: 2001,     name: 'Milkomeda C1',          explorer: 'https://explorer-mainnet-cardano-evm.c1.milkomeda.com', icon: 'https://www.milkomeda.com/images/logo.svg', coinId: '2010' },
  {                    name: 'NEAR',                  explorer: 'https://nearblocks.io',                      icon: trustwallet('near'),         coinId: '6535' },
  {                    name: 'Everscale',             explorer: 'https://everscan.io',                        icon: trustwallet('everscale'),     coinId: '7505' },
  { chainId: 1030,     name: 'Conflux eSpace',        explorer: 'https://evm.confluxscan.io',                 icon: web3icon('conflux'),      coinId: '7334' },
  { chainId: 10001,    name: 'EthereumPoW',           explorer: 'https://scan.ethw.xyz',                      icon: trustwallet('ethereumpow'), coinId: '21296' },
  {                    name: 'Stacks',                explorer: 'https://explorer.hiro.so',                   icon: trustwallet('stacks') },
  {                    name: 'TON',                   explorer: 'https://tonscan.org',                        icon: trustwallet('ton'),       coinId: '11419' },
  {                    name: 'Starknet',              explorer: 'https://starkscan.co',                       icon: web3icon('starknet'), coinId: '22691' },
  {                    name: 'Osmosis',               explorer: 'https://www.mintscan.io/osmosis',            icon: trustwallet('osmosis'),      coinId: '12220' },
  { chainId: 40,       name: 'Telos',                 explorer: 'https://www.teloscan.io',                    icon: web3icon('telos'),         coinId: '4660' },
  { chainId: 100,      name: 'Gnosis Chain',          explorer: 'https://gnosisscan.io',                      icon: web3icon('gnosis'),       coinId: '1659' },
  { chainId: 288,      name: 'Boba Network',          explorer: 'https://bobascan.com',                       icon: web3icon('boba'),  coinId: '14556' },
  { chainId: 56,       name: 'BNB Smart Chain',       explorer: 'https://bscscan.com',                        icon: trustwallet('smartchain'),   coinId: '1839' },
  { chainId: 2020,     name: 'Ronin',                 explorer: 'https://app.roninchain.com',                 icon: trustwallet('ronin'),         coinId: '14101' },
  { chainId: 42220,    name: 'Celo',                  explorer: 'https://celoscan.io',                        icon: trustwallet('celo'),         coinId: '5567' },
  { chainId: 70,       name: 'Hoo Smart Chain',       explorer: 'https://hooscan.com',                        icon: trustwallet('hoo'),     coinId: '15165' },
  { chainId: 42262,    name: 'Oasis Network',         explorer: 'https://explorer.oasis.io/mainnet/emerald',  icon: trustwallet('oasis'),        coinId: '7653' },
  { chainId: 122,      name: 'Fuse',                  explorer: 'https://explorer.fuse.io',                   icon: web3icon('fuse'),         coinId: "5634" },
  { chainId: 20,       name: 'Elastos',               explorer: 'https://esc.elastos.io',                     icon: web3icon('elastos'),      coinId: "2492" },
  { chainId: 24,       name: 'KardiaChain',           explorer: 'https://explorer.kardiachain.io',            icon: 'https://explorer.kardiachain.io/images/kardiachain_logo-a4309f6c59c696ca936742683473f6d3.svg?vsn=d',   coinId: '5453' },
  { chainId: 82,       name: 'Meter',                 explorer: 'https://scan.meter.io',                      icon: trustwallet('meter'),         coinId: '5919' },
  { chainId: 7700,     name: 'Canto',                 explorer: 'https://www.oklink.com/canto',              icon: 'https://static.oklink.com/cdn/assets/imgs/2312/B595CA702B6F89DB.png?x-oss-process=image/format,webp/resize,w_72,h_72,type_6/ignore-error,1',         coinId: '21516' },
  {                    name: 'Aptos',                 explorer: 'https://apscan.io',                          icon: trustwallet('aptos'),        coinId: '21794' },
  { chainId: 1101,     name: 'Polygon zkEVM',         explorer: 'https://zkevm.polygonscan.com',              icon: trustwallet('polygon'),      coinId: '3890' },
  { chainId: 1111,     name: 'Wemix',                 explorer: 'https://explorer.wemix.com/',                    icon: trustwallet('wemix'),   coinId: '7548' },
  { chainId: 8453,     name: 'Base',                  explorer: 'https://basescan.org',                       icon: web3icon('base'),            coinId: '27716' },
  { chainId: 59144,    name: 'Linea',                 explorer: 'https://lineascan.build',                    icon: 'https://lineascan.build/assets/linea/images/svg/logos/chain-light.svg?v=25.6.4.0',         coinId: '27657' },
  { chainId: 534352,   name: 'Scroll',                explorer: 'https://scrollscan.com',                     icon: cryptologo('scroll'),        coinId: '26998' },
  { chainId: 5000,     name: 'Mantle',                explorer: 'https://mantlescan.info',                    icon: cryptologo('mantle'),        coinId: '27075' },
  { chainId: 81457,    name: 'Blast',                 explorer: 'https://blastscan.io',                       icon: cryptologo('blast'),         coinId: '28480' },
  { chainId: 34443,    name: 'Mode',                  explorer: 'https://modescan.io',                        icon: cryptologo('mode'),          coinId: '31016' },
  { chainId: 196,      name: 'X Layer',               explorer: 'https://www.okx.com/web3/explorer/xlayer',   icon: cryptologo('xlayer'),        coinId: '3897' },
  { chainId: 167000,   name: 'Taiko',                 explorer: 'https://taikoscan.io',                       icon: cryptologo('taiko'),         coinId: '31525' },
  {                    name: 'Sei v2',                explorer: 'https://seistream.app',                      icon: cryptologo('sei'),           coinId: '23149' },
  { chainId: 480,      name: 'World Chain',           explorer: 'https://worldscan.org',                      icon: cryptologo('worldcoin-wld'), coinId: '13502' },
  { chainId: 146,      name: 'Sonic',                 explorer: 'https://sonicscan.org',                      icon: cryptologo('sonic-soniclabs'), coinId: '32684' },
  { chainId: 1301,     name: 'Unichain',              explorer: 'https://unichain-sepolia.blockscout.com',    icon: cryptologo('uniswap'),       coinId: '7083' },
  {                    name: 'Stacks',                explorer: 'https://explorer.hiro.so',                   icon: 'https://cdn.prod.website-files.com/618b0aafa4afde65f2fe38fe/6595cdc2f63c776b1447da57_favicon-32x32.png',        coinId: '4847' },
  { chainId: 324, name: 'zkSync Era', explorer: 'https://explorer.zksync.io', icon: trustwallet('zksync'), coinId: '24091' },
  { chainId: 4200, name: 'Merlin', explorer: 'https://scan.merlinchain.io', icon: trustwallet('merlin'), coinId: "30712" },
  {                    name: 'Sui',                   explorer: 'https://suiscan.xyz',                        icon: trustwallet('sui'),          coinId: '20947' },
  {                    name: 'Waves',                 explorer: 'https://wavesexplorer.com',                  icon: trustwallet('waves'),        coinId: '1274' },
];