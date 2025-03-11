import React, { useEffect, useState } from 'react'
import AuthFooter from './AuthFooter'
import { links } from './AuthUtils'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import avatar from '../assets/images/avatar.svg'
import { CookieName, ErrorAlert, MoveToTop, SuccessAlert } from '../utils/pageUtils'
import { Apis, AuthGetApi, AuthPostApi, imageurl } from '../services/API'
import { useAtom } from 'jotai'
import { BANK, CRYPTOS, PROFILE, UTILS, WALLET } from '../services/store'
import Cookies from 'js-cookie';
import ModalLayout from '../utils/ModalLayout'



const AuthPageLayout = ({ children }) => {
  const [user] = useAtom(PROFILE)
  const [, setWallet] = useAtom(WALLET)
  const [, setBank] = useAtom(BANK)
  const [, setUtils] = useAtom(UTILS)
  const [, setCryptos] = useAtom(CRYPTOS)
  const navigate = useNavigate()
  const location = useLocation()
  const pathName = location.pathname
  const active = 'text-lightgreen rounded-sm bg-[#1e333c]'
  const nonactive = 'hover:bg-primary rounded-sm text-[#9696b5]'
  const [logOutModal, setLogOutModal] = useState(false)

  useEffect(() => {
    const FetchWalletBankAndUtils = async () => {
      try {
        const response = await AuthGetApi(Apis.user.wallet_bank_utils)
        if (response.status === 200) {
          setBank(response.bank)
          setWallet(response.wallet)
          setUtils(response.utils)
        }
      } catch (error) {
        console.log(error)
      }
    }
    const fetchCryptos = async () => {
      try {
        const res = await AuthGetApi(Apis.admin.get_cryptos)
        if (res.status !== 200) return;
        const data = res.data
        setCryptos(data)
      } catch (error) {
        console.log(`Sorry something went wrong in fetch cryptos data`, error)
      }
    }
    fetchCryptos()
    FetchWalletBankAndUtils()
  }, [])

  const SendOTP = async () => {
    try {
      const res = await AuthPostApi(Apis.user.send_otp, { email: user.email })
      if (res.status === 200) {
        SuccessAlert(res.msg)
      } else {
        ErrorAlert(res.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    }
  }
  useEffect(() => {
    if (user.email_verified === 'false') {
      SendOTP()
      navigate(`/verify-account?v=${user?.email}`)
    }
  }, [user.email_verified, navigate])


  const LogoutUser = () => {
    Cookies.remove(CookieName)
    navigate('/login')
  }

  return (
    <div className='w-full relative'>
      {logOutModal &&
        <div className="w-full h-screen z-50   absolute">
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

      <div className="flex w-full bg-[#1d1e30] relative">

        <div
          className="h-screen z-30 hidden lg:block lg:w-[20%] pt-10 overflow-hidden">
          <div>
            <img src={logo} alt='moniequest-logo' className='h-14 w-auto mx-auto'></img>
          </div>
          <div onClick={() => navigate(`/user/profile`)} className='flex cursor-pointer gap-2 items-center justify-center mt-6 bg-primary p-4 rounded-lg w-11/12 h-fit mx-auto'>
            <img src={user.image ? user?.image : avatar} alt='user_profile' className='size-14 object-cover rounded-full border-2 border-ash'></img>
            <div className='text-base text-center font-bold capitalize text-gray-200'>{user?.surname} {user?.first_name}</div>
          </div>
          <div className="flex mt-10 pb-10 flex-col items-start px-5 gap-4 h-[65vh] overflow-y-auto scroll">
            {links.slice(0, links.length - 1).map((link, i) => {
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
            {links.slice(links.length - 1, links.length).map((link, i) => {
              return (
                <button onClick={() => setLogOutModal(true)} to={link.url}
                  className={` py-2 group text-base flex items-center gap-2 px-5 w-full capitalize hover:bg-primary rounded-sm text-[#9696b5]`} key={i}>
                  <div className="relative">
                    <link.icon className="transform group-hover:rotate-180 text-xl duration-300" />
                  </div>
                  <div>{link.label}</div>
                </button>
              )
            })}
            <a
              target="_blank"
              href={`mailto:corporate@moniequest.com?subject=Contact%20support`}
              className="text-sm px-3 py-2 mb-2 rounded-md bg-ash text-white"
            >
              Not Seeing What You Need? Tap and Contact Support Now!
            </a>
          </div>
        </div>
        <div className='lg:w-[80%] w-full h-screen bg-[#141523] pt-10 pb-20 lg:pb-10 overflow-y-auto overflow-x-hidden text-white'>
          {children}
        </div>
      </div>

      {user.email_verified !== 'false' && <div className="lg:hidden">
        <AuthFooter />
      </div>}
    </div>
  )
}

export default AuthPageLayout