import { MdCurrencyExchange } from "react-icons/md";
import { HiGift } from "react-icons/hi2";
import { MdDashboard, MdLeaderboard } from "react-icons/md";
import { CgToolbox } from "react-icons/cg";
import { GoHistory } from "react-icons/go";
import { RiUser3Fill } from 'react-icons/ri'
import { IoNotificationsSharp } from "react-icons/io5";
import { BiMoneyWithdraw } from "react-icons/bi";
import { FiLogOut } from "react-icons/fi";



export const delay = (ms) => {
    new Promise((resolve) => setTimeout(resolve, ms));
}


export const coinNames = [
    '--select--',
    'Bitcoin',
    'Ethereum',
    'Binance',
    'Solana',
    'Tron',
    'The Open Network',
    'SUI',
    'DOGE',
    'Litecoin',
    'USDT',
    'USDC',
];

export const coinDetails = [
    {
        name: `--select--`,
        network: '--select--'
    },
    {
        name: 'Bitcoin',
        network: 'Bitcoin BTC',
        address: '1NnzdbP1TVjHHExWB53E9eaKL1J3aBoRvo',
        symbol: 'BTC'
    },
    {
        name: 'Ethereum (ERC20)',
        network: 'Ethereum (ERC20)',
        address: '0x21b01fedd8822936924cd2de09c589ef2b9caba3',
        symbol: 'ETH'
    },
    {
        name: 'Ethereum (BEP20)',
        network: 'Ethereum (BEP20)',
        address: '0x21b01fedd8822936924cd2de09c589ef2b9caba3',
        symbol: 'ETH'
    },
    {
        name: 'Binance BNB',
        network: 'BNB (BEP20)',
        address: '0x21b01fedd8822936924cd2de09c589ef2b9caba3',
        symbol: 'BNB'
    },
    {
        name: 'Solana',
        network: 'Solana',
        address: 'D71a9kxuHUGL56oViA8DxHkRgAqy1JAn2yE2P2rokvtx',
        symbol: 'SOL'
    },
    {
        name: 'Tron',
        network: 'TRX (TRC20)',
        address: 'TLA9qYoZ35TJ3jfaZQeDVpGD6B2injCsTa',
        symbol: 'TRX'
    },
    {
        name: 'The Open Network',
        network: 'TON',
        address: 'UQAiq2Fq9C8hSX4BBon1AQyBVTDWMXRFboAfd154Wv7Dttvi',
        symbol: 'TON'
    },
    {
        name: 'SUI',
        network: 'SUI',
        address: '0xa687f64035d90685a80366d3b12d3c03ddc9711751b2c792adbd606d7b4dff6f',
        symbol: 'SUI'
    },
    {
        name: 'DOGE',
        network: 'DOGE',
        address: 'D7SKaCYu9ase4w7h9BY9xNP67xVxv7pVt3',
        symbol: 'DOGE'
    },
    {
        name: 'Litecoin',
        network: 'Litecoin LTC',
        address: 'LVCjaPaxeSLd8jjABbzytPBPv9hqMGCxfi',
        symbol: 'LTC'
    },
    {
        name: 'USDT',
        network: 'USDT (TRC20)',
        address: 'TLA9qYoZ35TJ3jfaZQeDVpGD6B2injCsTa',
        symbol: 'USDT'
    },
    {
        name: 'USDT (BEP20)',
        network: 'USDT (BEP20)',
        address: '0x21b01fedd8822936924cd2de09c589ef2b9caba3',
        symbol: 'USDT'
    },
    {
        name: 'USDC (ERC20)',
        network: 'USDC (ERC20)',
        address: '0x21b01fedd8822936924cd2de09c589ef2b9caba3',
        symbol: 'USDC'
    },
    {
        name: 'USDC (BEP20)',
        network: 'USDC (BEP20)',
        address: '0x21b01fedd8822936924cd2de09c589ef2b9caba3',
        symbol: 'USDC'
    }
];

export const currencies = [
    { name: 'USD', symbol: '$' },
    { name: 'NGN', symbol: '₦' },
]

export const links = [
    { label: 'dashboard', url: '/user/dashboard', icon: MdDashboard },
    { label: 'crypto exchange', main: '/exchange', url: '/user/exchange/buy', icon: MdCurrencyExchange },
    { label: 'gift cards', main: '/giftcards', url: '/user/giftcards/sell', icon: HiGift },
    { label: 'products', main: '/products', url: '/user/products/create', icon: CgToolbox },
    { label: 'bank withdrawal', url: '/user/bank_withdrawal', icon: BiMoneyWithdraw },
    { label: 'transaction history', url: '/user/transactions_history', icon: GoHistory },
    { label: 'profile', main: '/profile', url: '/user/profile', icon: RiUser3Fill },
    { label: 'notifications', url: '/user/notifications', icon: IoNotificationsSharp },
    { label: 'leaderboard', url: '/user/leaderboard', icon: MdLeaderboard },
    { label: 'logout',  icon: FiLogOut },
]
export const blockchainNetworks = [
    { value: "", label: "--select--" },
    { value: "bitcoin", label: "Bitcoin (BTC)" },
    { value: "ethereum", label: "Ethereum (ETH)" },
    { value: "binance-smart-chain", label: "Binance Smart Chain (BSC)" },
    { value: "cardano", label: "Cardano (ADA)" },
    { value: "solana", label: "Solana (SOL)" },
    { value: "the-open-network", label: "The Open Network (TON)" },
    { value: "polkadot", label: "Polkadot (DOT)" },
    { value: "avalanche", label: "Avalanche (AVAX)" },
    { value: "ripple", label: "Ripple (XRP)" },
    { value: "litecoin", label: "Litecoin (LTC)" },
    { value: "tron", label: "Tron (TRX)" },
    { value: "cosmos", label: "Cosmos (ATOM)" },
    { value: "algorand", label: "Algorand (ALGO)" },
    { value: "near-protocol", label: "Near Protocol (NEAR)" },
    { value: "fantom", label: "Fantom (FTM)" },
    { value: "hedera-hashgraph", label: "Hedera Hashgraph (HBAR)" },
    { value: "tezos", label: "Tezos (XTZ)" },
    { value: "arbitrum", label: "Arbitrum" },
    { value: "optimism", label: "Optimism" },
    { value: "polygon", label: "Polygon (MATIC)" },
    { value: "elrond", label: "Elrond (EGLD)" },
    { value: "stellar", label: "Stellar (XLM)" },
    { value: "zilliqa", label: "Zilliqa (ZIL)" },
    { value: "vechain", label: "VeChain (VET)" },
    { value: "eos", label: "EOS" },
    { value: "harmony", label: "Harmony (ONE)" },
    { value: "kadena", label: "Kadena (KDA)" },
    { value: "theta-network", label: "Theta Network (THETA)" },
];

export const instructions = [
    `Third party payments are not allowed. Payments must be made from your personal account.Matching your verified name on your moniequest account profile.`,
    `For a successful transaction, do not enter any crypto related terms (BTC,ETH,USDT) in your payment narration or memo.`,
    `Opening orders without making payments is not allowed.`,
    `Failure to comply with the above stated terms leads to limitation on your moniequest account and total loss of paid amount`
]
export const sellInstruction = [
    'Please note that due to price flunctuations, there may be a slight difference between the amount you receive and the estimated amount.'
]
export const BankAcc = {
    "name": "Access Bank",
    "accountNumber": "1234567890",
    "accountName": "MonieQuest Account",
}
export const giftCardValidations = [
    { brand: "--select--", length: '', regex: '' },
    { brand: "PAYSAFE", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "PLAYSTATION", length: 12, regex: /^[A-Za-z0-9]{12}$/ },
    { brand: "WALMART 61/62", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "ADIDAS", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "ROBLOX", length: 10, regex: /^[A-Za-z0-9]{10}$/ },
    { brand: "VANILLA/ONE VANILLA MASTERCARD", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "VANILLA/ONE VANILLA VISA", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "VISA 4030", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "VISA 4097", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "HOME DEPOT", length: 19, regex: /^[A-Za-z0-9]{19}$/ },
    { brand: "NETSPEND", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "MICHAEL KORS", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "AMEX SERVE 3777/3751", length: 15, regex: /^[A-Za-z0-9]{15}$/ },
    { brand: "CVS PHARMACY", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "SAKS FIFTH AVENUE", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "BLOOMINGDALES", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "NETFLIX", length: 11, regex: /^[A-Za-z0-9]{11}$/ },
    { brand: "TARGET", length: 15, regex: /^[A-Za-z0-9]{15}$/ },
    { brand: "BEST BUY", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "JC PENNY", length: 19, regex: /^[A-Za-z0-9]{19}$/ },
    { brand: "XBOX", length: 25, regex: /^[A-Za-z0-9]{25}$/ },
    { brand: "GAMESTOP", length: 19, regex: /^[A-Za-z0-9]{19}$/ },
    { brand: "RAZER GOLD", length: 14, regex: /^[A-Za-z0-9]{14}$/ },
    { brand: "VISA", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "NIKE", length: 19, regex: /^[A-Za-z0-9]{19}$/ },
    { brand: "AMERICAN EXPRESS 3779", length: 15, regex: /^[A-Za-z0-9]{15}$/ },
    { brand: "AMAZON", length: 14, regex: /^[A-Za-z0-9]{14}$/ },
    { brand: "FOOTLOCKER", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "NORDSTROM", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "MACY'S", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "EBAY", length: 13, regex: /^[A-Za-z0-9]{13}$/ },
    { brand: "SEPHORA", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "APPLE STORE", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "ITUNES", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
    { brand: "STEAM", length: 15, regex: /^[A-Za-z0-9]{15}$/ },
    { brand: "GOOGLE PLAY", length: 20, regex: /^[A-Za-z0-9]{20}$/ },
    { brand: "OFFGAMERS", length: 16, regex: /^[A-Za-z0-9]{16}$/ },
];

export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
})

export const banksArr = [
    "AB Microfinance Bank",
    "Access Bank",
    "Accion Microfinance Bank",
    "ALAT by Wema Bank",
    "Bank of Agriculture (BOA)",
    "Bank of Industry (BOI)",
    "Carbon",
    "Chipper Cash",
    "Coronation Merchant Bank",
    "Development Bank of Nigeria (DBN)",
    "Eyowo",
    "FairMoney",
    "FCMB (First City Monument Bank)",
    "FBNQuest Merchant Bank",
    "First Bank of Nigeria (FBN)",
    "Flutterwave",
    "Fidelity Bank",
    "GTBank (Guaranty Trust Bank)",
    "Jaiz Bank",
    "Kuda Bank",
    "LAPO Microfinance Bank",
    "Moniepoint",
    "NIRSAL Microfinance Bank",
    "Opay",
    "PalmPay",
    "Paystack",
    "Polaris Bank",
    "Rand Merchant Bank (RMB Nigeria)",
    "Stanbic IBTC Bank",
    "Sterling Bank",
    "Union Bank of Nigeria",
    "United Bank for Africa (UBA)",
    "Unity Bank",
    "VBank",
    "Wema Bank",
    "Zenith Bank"
];

