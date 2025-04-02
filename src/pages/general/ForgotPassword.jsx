import React, { useEffect, useState } from 'react'
import FormInput from '../../utils/FormInput'
import FormButton from '../../utils/FormButton'
import { IoLockClosedOutline, IoLockOpenOutline } from "react-icons/io5";
import { MdVerified } from "react-icons/md";
import { ErrorAlert, MoveToTop, SuccessAlert } from '../../utils/pageUtils'
import PinForm from '../../utils/PinForm'
import PasswordInputField from '../../utils/PasswordInputField'
import { Link } from 'react-router-dom'
import SuccessCheck from '../../utils/SuccessCheck'
import logo from '../../assets/images/logo.png'
import { Apis, PostApi } from '../../services/API';
import Loader from '../../GeneralComponents/Loader';

const ForgotPassword = () => {
  const [screen, setScreen] = useState(1)
  const [loading, setLoading] = useState(false)
  const [pins, setPins] = useState(['', '', '', '', '', ''])
  const checkPins = pins.join('')
  const [resend, setResend] = useState(true)
  const [countdown, setCountDown] = useState(40)
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirm_password: ''
  })

  const formHandler = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }


  const SendOTP = async (e) => {
    e.preventDefault()

    if (!form.email) return ErrorAlert('Enter email address')
    setLoading(true)
    try {
      const response = await PostApi(Apis.user.send_otp, { email: form.email })
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        SuccessAlert(response.msg)
        setScreen(2)
        setCountDown(40)
        setResend(true)
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let timer;
    if (resend) {
      timer = setInterval(() => {
        setCountDown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            setResend(false)
            return 0;
          }
          return prev - 1;
        });
      }, 1000)
    }

    return () => clearInterval(timer)
  }, [resend])

  const VerifyOTP = async (e) => {
    e.preventDefault()

    if (checkPins.length < 6) return ErrorAlert('Enter code sent to email')
    const formbody = {
      email: form.email,
      code: checkPins
    }

    setLoading(true)
    try {
      const response = await PostApi(Apis.user.verify_otp, formbody)
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setScreen(3)
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const ChangePassword = async (e) => {
    e.preventDefault()

    if (!form.password) return ErrorAlert('Create new password')
    if (!form.confirm_password) return ErrorAlert('Confirm password')
    if (form.password !== form.confirm_password) return ErrorAlert('Password(s) mismatch')

    const formbody = {
      email: form.email,
      password: form.password,
      confirm_password: form.confirm_password
    }

    setLoading(true)
    try {
      const response = await PostApi(Apis.user.change_password, formbody)
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setScreen(4)
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }


  return (
    <div className='w-full bg-dark h-screen overflow-y-auto py-24'>
      {loading && <Loader />}
      <div className='w-11/12 mx-auto'>
        <div className='flex items-center justify-center max-w-md mx-auto relative'>
          <div className='w-full h-full flex flex-col'>
            <div className="flex items-center justify-center w-full">
              <img src={logo} className='w-52' alt="logo alt" />
            </div>
            <div className='text-3xl font-bold text-center text-zinc-300'>Forgot password</div>
            {screen === 1 &&
              <form onSubmit={SendOTP} className='pb-10'>
                <div className='flex justify-center text-zinc-300 flex-col gap-2 items-center mt-6'>
                  <div className='w-12 h-12 border-2 border-lightgreen rounded-full flex items-center justify-center'>
                    <IoLockClosedOutline className='text-2xl text-lightgreen' />
                  </div>
                  <div className='font-bold text-zinc-300'>Trouble signing in?</div>
                  <div className='text-left text-sm text-lightgreen'>Enter your email address to find your account and reset password</div>
                </div>
                <div className='flex flex-col gap-5 mt-8 text-white'>
                  <FormInput label='Email address' type='email' placeholder='example@gmail.com' name='email' value={form.email} onChange={formHandler} />
                  <FormButton title='Find account' />
                </div>
              </form>
            }
            {screen === 2 &&
              <form onSubmit={VerifyOTP}>
                <div className='flex justify-center flex-col gap-2 items-center mt-6'>
                  <div className='w-12 h-12 border-2 border-lightgreen rounded-full flex items-center justify-center'>
                    <MdVerified className='text-2xl text-lightgreen' />
                  </div>
                  <div className='font-bold text-zinc-300'>Verify your email address</div>
                  <div className='text-left text-sm text-lightgreen'>A verification code was sent to your email address, enter the code below</div>
                </div>
                <div className='flex flex-col gap-8 items-center mt-8'>
                  <PinForm
                    pins={pins}
                    setPins={setPins}
                  />
                  {!resend ?
                    <div className="w-fit ml-auto text-white flex gap-2">
                      <div className="">didn't get code?</div>
                      <div type='button' onClick={SendOTP} className='text-lightgreen cursor-pointer'>Resend code</div>
                    </div> :
                    <div className="w-fit ml-auto text-white">resend in <span className='text-lightgreen'>{countdown}s</span></div>
                  }
                  <FormButton title='Verify' className={`${checkPins.length < 6 && '!bg-zinc-400 !hover:bg-none hover:!text-white'}`} disabled={checkPins.length < 6 ? true : false} />
                </div>
              </form>
            }
            {screen === 3 &&
              <form onSubmit={ChangePassword}>
                <div className='flex justify-center flex-col gap-2 items-center mt-6'>
                  <div className='w-12 h-12 border-2 border-lightgreen rounded-full flex items-center justify-center'>
                    <IoLockOpenOutline className='text-2xl text-lightgreen' />
                  </div>
                  <div className='font-bold text-zinc-300'>Password re-set</div>
                  <div className='text-left text-lightgreen text-sm'>Set a new password for your account by filling the password fields below</div>
                </div>
                <div className='flex flex-col gap-5 mt-8 text-zinc-300'>
                  <PasswordInputField label='Password' placeholder='Create new password' name='password' value={form.password} onChange={formHandler} />
                  <PasswordInputField label='Confirm password' placeholder='Confirm password' name='confirm_password' value={form.confirm_password} onChange={formHandler} />
                  <FormButton title='Change password' />
                </div>
              </form>
            }
            {screen === 4 &&
              <div className='flex flex-col gap-6 py-10'>
                <div className='flex flex-col gap-4 items-center justify-center'>
                  <SuccessCheck />
                  <div className='text-3xl font-bold text-center text-lightgreen'>Password Reset <br></br>Succcessful</div>
                  <div className='text-left text-zinc-300 text-sm'>Password change successful, you can now sign in with new password created</div>
                </div>
                <Link to='/login' onClick={MoveToTop}>
                  <FormButton title='Continue to sign in' />
                </Link>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword