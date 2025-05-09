import React, { useState } from 'react'
import { MdCurrencyExchange, MdLeaderboard, MdDashboard } from "react-icons/md";
import { HiGift } from "react-icons/hi2";
import { CgToolbox } from "react-icons/cg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUsers, FaBloggerB } from "react-icons/fa";
import { RiUser3Fill } from 'react-icons/ri'
import { BiMoneyWithdraw } from "react-icons/bi";
import { CookieName, MoveToTop } from '../utils/pageUtils';
import { IoNotificationsSharp } from 'react-icons/io5';
import { CiMenuKebab } from 'react-icons/ci';
import { AiFillDollarCircle } from "react-icons/ai";
import { GoHistory } from 'react-icons/go';
import { MdReviews } from "react-icons/md";
import { FiLogOut } from "react-icons/fi";
import ModalLayout from '../utils/ModalLayout';
import Cookies from 'js-cookie';
import { useAtom } from 'jotai';
import { UNREADNOTIS } from '../services/store';

const mainIcons = [
    {
        name: 'dashboard',
        symbol: MdDashboard,
        url: '/admin/dashboard',
        main: '/dashboard'
    },
    {
        name: 'users',
        symbol: FaUsers,
        url: '/admin/all_users',
        main: '/all_users'
    },
    {
        name: 'crypto exchange',
        symbol: MdCurrencyExchange,
        url: '/admin/exchange/buy_orders',
        main: '/exchange'
    },
    {
        name: 'gift cards',
        symbol: HiGift,
        url: '/admin/giftcards/orders',
        main: '/giftcards'
    },
    {
        name: 'productive tools',
        symbol: CgToolbox,
        url: '/admin/products/orders',
        main: '/products'
    },
]

const extraIcons = [
    {
        name: 'airdrops',
        symbol: AiFillDollarCircle,
        url: '/admin/airdrops/create',
        main: '/airdrops'
    },
    {
        name: 'blogs',
        symbol: FaBloggerB,
        url: '/admin/blogs/create',
        main: '/blogs'
    },
    {
        name: 'bank withdrawals',
        symbol: BiMoneyWithdraw,
        url: '/admin/bank_withdrawals',
        main: '/bank_withdrawals'
    },
    {
        name: 'transaction history',
        symbol: GoHistory,
        url: '/admin/transactions_history'
    },
    {
        name: 'utilities',
        symbol: MdReviews,
        url: '/admin/utilities',
        main: '/utilities'
    },
    {
        name: 'profile',
        symbol: RiUser3Fill,
        url: '/admin/profile',
        main: '/profile'
    },
    {
        name: 'notifications',
        symbol: IoNotificationsSharp,
        url: '/admin/notifications',
    },
    {
        name: 'leaderboard',
        symbol: MdLeaderboard,
        url: '/admin/leaderboard',
    },
]

const AdminFooter = () => {
    const [unreadNotis] = useAtom(UNREADNOTIS)
    const [view, setView] = useState(false)
    const location = useLocation()
    const pathName = location.pathname
    const active = 'text-lightgreen'
    const nonactive = 'text-white/60 hover:text-lightgreen'
    const mainLinks = mainIcons.some(ele => pathName.includes(ele.main))
    const [logOutModal, setLogOutModal] = useState(false)
    const navigate = useNavigate()

    const LogoutAdmin = () => {
        Cookies.remove(CookieName)
        navigate('/login')
    }

    return (

        <div className='w-full fixed bottom-1 z-30'>
            {logOutModal &&
                <div className="w-full h-screen z-50  absolute">
                    <ModalLayout setModal={setLogOutModal} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                        <div className="p-5  bg-white shadow-xl rounded-md">
                            <div className="text-base text-center mb-3">Are you sure you want to logout?</div>
                            <div className="flex items-center justify-between">
                                <button onClick={() => setLogOutModal(false)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Cancel</button>
                                <button onClick={LogoutAdmin} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm</button>
                            </div>
                        </div>
                    </ModalLayout>
                </div>
            }

            <div className='w-11/12 mx-auto relative'>
                <div className="w-full px-5 relative bg-[#212134] border border-secondary rounded-full flex items-center justify-around gap-2">
                    {mainIcons.map((item, i) => {
                        return (
                            <div key={i} className="flex items-center py-4 relative">
                                {pathName === item.url || pathName.includes(item.main) ?
                                    <div className="bg-lightgreen absolute top-0 w-full h-1 rounded-b-full "></div>
                                    :
                                    <></>
                                }
                                <Link to={item.url} onClick={MoveToTop}
                                    className={` group-hover:text-lightgreen px-2  ${pathName === item.url || pathName.includes(item.main) ? active : nonactive} cursor-pointer flex flex-col gap-1 items-center`}>
                                    <div className="text-[1.5rem]">{<item.symbol />}</div>
                                </Link>
                            </div>
                        )
                    })}
                    <div className='flex items-center py-4 relative'>
                        {!mainLinks &&
                            <div className="bg-lightgreen absolute top-0 w-full h-1 rounded-b-full"></div>
                        }
                        <div className={`group-hover:text-lightgreen px-2 cursor-pointer text-[1.5rem] ${!mainLinks ? active : nonactive}`} onClick={() => setView(!view)}>
                            <CiMenuKebab />
                        </div>
                    </div>
                </div>
                {view &&
                    <div className='absolute overflow-x-auto w-full -top-12 right-0 bg-secondary border border-primary px-4 flex items-center justify-around gap-2 rounded-full scrollsdown'>
                        {extraIcons.map((item, i) => (
                            <div key={i} className='!flex items-center py-4 relative'>
                                {pathName === item.url || pathName.includes(item.main) ?
                                    <div className="bg-lightgreen absolute top-0 w-full h-1 rounded-b-full"></div>
                                    : <></>
                                }
                                <Link to={item.url} onClick={MoveToTop}
                                    className={`px-2  ${pathName === item.url || pathName.includes(item.main) ? active : nonactive} cursor-pointer flex flex-col gap-1 items-center`}>
                                    <div className='relative'>
                                        {item.name === 'notifications' && unreadNotis.length > 0 && <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-red-600 z-40"></div>}
                                        <div className="text-[1.5rem]">{<item.symbol />}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        <button onClick={() => setLogOutModal(true)}
                            className={`px-2 text-white/60 hover:text-lightgreen cursor-pointer flex flex-col gap-1 items-center`}>
                            <div className="text-[1.5rem]"><FiLogOut /></div>
                        </button>
                    </div>
                }
            </div>
        </div>
    )
}

export default AdminFooter