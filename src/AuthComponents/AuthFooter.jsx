import React, { useState } from 'react'
import { MdCurrencyExchange, MdLeaderboard } from "react-icons/md";
import { HiGift } from "react-icons/hi2";
import { MdDashboard } from "react-icons/md";
import { CgToolbox } from "react-icons/cg";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoHistory } from "react-icons/go";
import { CookieName, MoveToTop } from '../utils/pageUtils';
import { CiMenuKebab } from "react-icons/ci";
import { IoNotificationsSharp } from 'react-icons/io5';
import { BiMoneyWithdraw } from "react-icons/bi";
import { RiUser3Fill } from 'react-icons/ri'
import { FiLogOut } from "react-icons/fi";
import ModalLayout from '../utils/ModalLayout';
import Cookies from 'js-cookie';
import { IoMdHelp } from "react-icons/io";
import { UNREADNOTIS } from '../services/store';
import { useAtom } from 'jotai';

const mainIcons = [
    {
        name: 'dashboard',
        symbol: MdDashboard,
        url: '/user/dashboard',
        main: '/dashboard'
    },
    {
        name: 'crypto exchange',
        symbol: MdCurrencyExchange,
        url: '/user/exchange/buy',
        main: '/exchange'
    },
    {
        name: 'giftcards',
        symbol: HiGift,
        url: '/user/giftcards/sell',
        main: '/giftcards'
    },
    {
        name: 'products',
        symbol: CgToolbox,
        url: '/user/products/create',
        main: '/products'
    },
    {
        name: 'bank withdrawal',
        symbol: BiMoneyWithdraw,
        url: '/user/bank_withdrawal',
        main: '/bank_withdrawal'
    },
]

const extraIcons = [
    {
        name: 'transaction history',
        symbol: GoHistory,
        url: '/user/transactions_history'
    },
    {
        name: 'profile',
        symbol: RiUser3Fill,
        main: '/profile',
        url: '/user/profile'
    },
    {
        name: 'notifications',
        symbol: IoNotificationsSharp,
        url: '/user/notifications',
    },
    {
        name: 'leaderboard',
        symbol: MdLeaderboard,
        url: '/user/leaderboard',
    },
]

const emailSupport = {
    symbol: IoMdHelp,
    url: 'mailto:support@moniequest.com?subject=Contact%Support'
}

const AuthFooter = () => {
    const [unreadNotis] = useAtom(UNREADNOTIS)
    const [view, setView] = useState(false)
    const location = useLocation()
    const pathName = location.pathname
    const navigate = useNavigate()
    const active = 'text-lightgreen'
    const nonactive = 'text-white/60 hover:text-lightgreen'
    const mainLinks = mainIcons.some(ele => pathName.includes(ele.main))
    const [logOutModal, setLogOutModal] = useState(false)


    const LogoutUser = () => {
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
                                <button onClick={LogoutUser} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm</button>
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
                                    <div className="bg-lightgreen absolute top-0 w-full h-1 rounded-b-full"></div>
                                    : <></>
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
                    <div className='absolute -top-12 overflow-x-auto  right-0 bg-secondary border border-primary px-4 flex items-center justify-around gap-2 rounded-full'>
                        {extraIcons.map((item, i) => (
                            <div key={i} className='flex items-center py-4 relative'>
                                {pathName === item.url || pathName.includes(item.main) ?
                                    <div className="bg-lightgreen absolute top-0 w-full h-1 rounded-b-full"></div>
                                    : <></>
                                }
                                <Link to={item.url} onClick={MoveToTop}
                                    className={` group-hover:text-lightgreen px-2  ${pathName === item.url || pathName.includes(item.main) ? active : nonactive} cursor-pointer flex flex-col gap-1 items-center`}>
                                    <div className='relative'>
                                        {item.name === 'notifications' && unreadNotis.length > 0 && <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-red-600 z-40"></div>}
                                        <div className="text-[1.5rem]">{<item.symbol />}</div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                        <button onClick={() => setLogOutModal(true)}
                            className={` group-hover:text-lightgreen px-2 text-white/60 hover:text-lightgreen cursor-pointer flex flex-col gap-1 items-center`}>
                            <div className="text-[1.5rem]"><FiLogOut /></div>
                        </button>
                        <a
                            href={emailSupport.url}
                            target="_blank"
                            className={` group-hover:text-lightgreen text-white/60 hover:text-lightgreen cursor-pointer flex flex-col gap-1 items-center`}>
                            <div className='relative'>
                                <div className="text-[1.5rem]">{<emailSupport.symbol />}</div>
                            </div>
                        </a>
                    </div>
                }
            </div>
        </div>
    )
}

export default AuthFooter