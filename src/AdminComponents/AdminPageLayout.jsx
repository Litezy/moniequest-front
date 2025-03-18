import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import avatar from '../assets/images/avatar.svg'
import { CookieName, MoveToTop } from '../utils/pageUtils'
import AdminFooter from './AdminFooter'
import { pagelinks } from './AdminUtils'
import { Apis, AuthGetApi, imageurl } from '../services/API'
import { useAtom } from 'jotai'
import Cookies from 'js-cookie'
import { BANK, PROFILE, SUBS, TOOLS, USER_SUB_KYCS, USER_VER_KYCS, USERBANKS, USERDETAILS, UTILS } from '../services/store'
import ModalLayout from '../utils/ModalLayout'


const AdminPageLayout = ({ children }) => {
    const [user] = useAtom(PROFILE)
    const [, setBank] = useAtom(BANK)
    const [, setUtils] = useAtom(UTILS)
    const [, setUserDetails] = useAtom(USERDETAILS)
    const [, setUserSubmittedKycs] = useAtom(USER_SUB_KYCS)
    const [, setUserBanks] = useAtom(USERBANKS)
    const [, setUserVerifiedKycs] = useAtom(USER_VER_KYCS)
    const [, setTools] = useAtom(TOOLS)
    const [, setSubscribers] = useAtom(SUBS)
    const location = useLocation()
    const pathName = location.pathname
    const active = 'text-lightgreen rounded-sm bg-[#1e333c]'
    const nonactive = 'hover:bg-primary rounded-sm text-[#9696b5]'
    const [logOutModal, setLogOutModal] = useState(false)
    const navigate = useNavigate()


    useEffect(() => {
        const FetchBankAndUtils = async () => {
            try {
                const response = await AuthGetApi(Apis.user.wallet_bank_utils)
                if (response.status === 200) {
                    setBank(response.bank)
                    setUtils(response.utils)
                }
            } catch (error) {
                console.log(error)
            }
        }
        const fetchSubs = async ()=>{
            try {
                const res = await AuthGetApi(Apis.admin.get_subs)
                if(res.status !== 200) return;
                 const data = res.data
                 setSubscribers(data)
            } catch (error) {
                console.log(`error in fetching subscribers`,error)
            }
        }
        const fetchAllUsers = async () => {
            try {
                const res = await AuthGetApi(Apis.admin.user_details)
                if (res.status !== 200) return;
                const data = await res.data
                setUserDetails(data[0].data)
                setUserBanks(data[1].data)
                setUserSubmittedKycs(data[2].data)
                setUserVerifiedKycs(data[3].data)
            } catch (error) {
                console.log(error)
            }
        }
        const fetchTools = async () => {
            try {
                const res = await AuthGetApi(Apis.admin.get_tools)
                if (res.status !== 200) return ErrorAlert(res.msg)
                const data = res.data
                setTools(data)
            } catch (error) {
                console.log(`Error in fetching tools data`, error)
            }
        }
        fetchTools()
        FetchBankAndUtils()
        fetchAllUsers()
        fetchSubs()
    }, [])

    const optimizeImageUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`;
    };

    const LogoutAdmin = () => {
        Cookies.remove(CookieName)
        navigate('/login')
    }

    return (
        <div className='w-full'>
            <div className="flex w-full bg-[#1d1e30] relative">

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

                <div
                    className="h-screen z-30 hidden lg:block lg:w-[20%] pt-10 overflow-hidden">
                    <div>
                        <img src={logo} alt='moniequest-logo' className='h-14 w-auto mx-auto'></img>
                    </div>
                    <div className='flex gap-2 items-center justify-center mt-6 bg-primary p-4 rounded-lg w-11/12 h-fit mx-auto'>
                        <img src={user.image ? optimizeImageUrl(user.image) : avatar} alt='user_profile' className='size-14 object-cover rounded-full border-2 border-ash'></img>
                        <div className='text-xl text-center font-bold capitalize text-gray-200'>{user?.first_name}  {user?.surname}</div>
                    </div>
                    <div className="flex mt-10 pb-16 flex-col items-start px-5 gap-4 h-[65vh] overflow-y-auto scroll">
                        {pagelinks.slice(0, pagelinks.length - 1).map((link, i) => {
                            return (
                                <Link onClick={MoveToTop} to={link.url}
                                    className={` py-2 group text-base flex items-center gap-2 px-5 w-full capitalize ${pathName === link.url || pathName.includes(link.main) ? active : nonactive} `} key={i}>
                                    <div className="relative">
                                        {link.label === 'notifications' && <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-red-600 z-40"></div>}
                                        <link.icon className="transform group-hover:rotate-180 text-xl duration-300" />
                                    </div>
                                    <div>{link.label}</div>
                                </Link>
                            )
                        })}
                        {pagelinks.slice(pagelinks.length - 1, pagelinks.length).map((link, i) => {
                            return (
                                <button onClick={() => setLogOutModal(true)}
                                    className={` py-2 group text-base flex items-center gap-2 px-5 w-full capitalize hover:bg-primary rounded-sm text-[#9696b5] `} key={i}>
                                    <div className="relative">
                                        <link.icon className="transform group-hover:rotate-180 text-xl duration-300" />
                                    </div>
                                    <div>{link.label}</div>
                                </button>
                            )
                        })}
                    </div>
                </div>
                <div className='lg:w-[80%] w-full h-screen bg-[#141523] pt-10 pb-20 lg:pb-10 overflow-y-auto overflow-x-hidden text-white'>
                    {children}
                </div>
            </div>
            <div className="lg:hidden">
                <AdminFooter />
            </div>
        </div>
    )
}

export default AdminPageLayout