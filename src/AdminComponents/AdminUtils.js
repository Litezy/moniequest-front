import { BiMoneyWithdraw } from "react-icons/bi";
import { HiGift } from "react-icons/hi2";
import { AiFillDollarCircle } from "react-icons/ai";
import { CgToolbox } from "react-icons/cg";
import { FaUsers, FaBloggerB } from "react-icons/fa";
import { IoNotificationsSharp } from "react-icons/io5";
import { MdCurrencyExchange, MdDashboard, MdLeaderboard } from "react-icons/md";
import { RiUserFill } from 'react-icons/ri'
import { GoHistory } from "react-icons/go";
import { MdReviews } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";



export const pagelinks = [
    { label: 'dashboard', url: '/admin/dashboard', icon: MdDashboard },
    { label: 'users', main: '/all_users', url: '/admin/all_users', icon: FaUsers },
    { label: 'crypto exchange', main: '/exchange', url: '/admin/exchange/buy_orders', icon: MdCurrencyExchange },
    { label: 'gift cards', main: '/giftcards', url: '/admin/giftcards/orders', icon: HiGift },
    { label: 'products', main: '/products', url: '/admin/products/orders', icon: CgToolbox },
    { label: 'airdrops', main: '/airdrops', url: '/admin/airdrops/create', icon: AiFillDollarCircle },
    { label: 'blogs', main: '/blogs', url: '/admin/blogs/create', icon: FaBloggerB },
    { label: 'bank withdrawals', main: '/bank_withdrawals', url: '/admin/bank_withdrawals', icon: BiMoneyWithdraw },
    { label: 'transaction history', url: '/admin/transactions_history', icon: GoHistory },
    { label: 'utilities', main: '/utilities', url: '/admin/utilities', icon: MdReviews },
    { label: 'profile', url: '/admin/profile', icon: RiUserFill },
    { label: 'notifications', url: '/admin/notifications', icon: IoNotificationsSharp },
    { label: 'leaderboard', url: '/admin/leaderboard', icon: MdLeaderboard },
    { label: 'logout', icon: FiLogOut },
]
