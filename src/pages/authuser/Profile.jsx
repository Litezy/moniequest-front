import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { MdVerified, MdOutlineDateRange, MdEmail } from "react-icons/md";
import { GoUnverified } from "react-icons/go";
import { FaRegUserCircle } from "react-icons/fa";
import { HiUser } from "react-icons/hi2";
import { BiSolidEditAlt, BiSolidPhone } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import moment from 'moment';
import FormInput from '../../utils/FormInput';
import PasswordInputField from '../../utils/PasswordInputField';
import { CookieName, ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import FormButton from '../../utils/FormButton';
import AuthPageLayout from '../../AuthComponents/AuthPageLayout';
import { FaRegIdCard } from "react-icons/fa";
import Loader from '../../GeneralComponents/Loader';
import Cookies from 'js-cookie'
import { useAtom } from 'jotai';
import { BANK, PROFILE } from '../../services/store';
import avatar from '../../assets/images/avatar.svg'
import { Apis, AuthPostApi, AuthPutApi, imageurl } from '../../services/API';
import { NigerianBanks } from '../../utils/banks';
import SelectComp from '../../GeneralComponents/SelectComp';

const Profile = () => {
  const [user, setUser] = useAtom(PROFILE)
  // console.log(user)
  const [bank, setBank] = useAtom(BANK)
  const [loading, setLoading] = useState({
    main: false,
    sub: false,
  })
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    surname: user?.surname || '',
    email: user?.email || '',
    username: user?.username || '',
    phone_number: user?.phone_number || '',
    old_password: '',
    new_password: '',
    bank_name: '',
    account_number: '',
    account_name: '',
  })
  const [profile, setProfile] = useState({
    img: user.image ? user.image : avatar,
    image: null
  })
  const imgref = useRef()
  const navigate = useNavigate()

  const logoutAccount = () => {
    Cookies.remove(CookieName)
    navigate('/login')
  }

  const formHandler = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    })
  }

  const handlePhoneNum = (e) => {
    let value = e.target.value
    const formatVal = value.replace(/\D/g, '')
    setForm({ ...form, phone_number: formatVal })
  }

  const handleAccNum = (e) => {
    let value = e.target.value
    const formatVal = value.replace(/\D/g, '')
    const numLenght = formatVal.substring(0, 10)
    setForm({ ...form, account_number: numLenght })
  }

  useEffect(() => {
    setForm({
      ...form,
      bank_name: bank?.bank_name || '',
      account_name: bank?.account_name || '',
      account_number: bank?.account_number || ''
    })
  }, [bank])


  const handleProfileUpload = (event) => {
    const file = event.target.files[0]
    if (file.size >= 1000000) {
      imgref.current.value = null
      return ErrorAlert('Image size too large, file must not exceed 1mb')
    }
    if (!file.type.startsWith('image/')) {
      imgref.current.value = null
      return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
    }
    setProfile({
      img: URL.createObjectURL(file),
      image: file
    })
  }

  const Submit = async (e) => {
    e.preventDefault()

    const formbody = new FormData()
    formbody.append('image', profile.image)
    formbody.append('first_name', form.first_name)
    formbody.append('surname', form.surname)
    formbody.append('email', form.email)
    formbody.append('phone_number', form.phone_number)
    formbody.append('old_password', form.old_password)
    formbody.append('new_password', form.new_password)

    setLoading({
      main: true
    })
    try {
      const response = await AuthPutApi(Apis.user.update_profile, formbody)
      if (response.status === 200) {
        setUser(response.user)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        SuccessAlert(response.msg)
        setForm({
          ...form,
          old_password: '',
          new_password: ''
        })
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading({
        main: false
      })
    }
  }

  const AddBankAccount = async () => {
    if (!form.account_number || !form.bank_name) return ErrorAlert('Enter all fields')
    const formbody = {
      bank_name: form.bank_name,
      account_number: form.account_number,
    }

    setLoading({
      sub: true
    })
    try {
      const response = await AuthPostApi(Apis.user.create_update_bank, formbody)
      if (response.status === 200) {
        setBank(response.bank)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        SuccessAlert(response.msg)
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading({
        sub: false
      })
    }
  }
  const optimizeImageUrl = (url) => {
    if (!url || !url.includes('cloudinary.com')) return url; // Return unchanged if not Cloudinary
    const parts = url.split('/upload/');
    return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`; // Insert transformations
  };


  const [bankNames, setBankNames] = useState([]);
  useEffect(() => {
    if (NigerianBanks && NigerianBanks.length > 0) {
      // Extract just the names and sort alphabetically
      const names = NigerianBanks
        .map(bank => bank.name)
        .sort((a, b) => a.localeCompare(b));

      setBankNames(names);
    }
  }, []);


  return (
    <AuthPageLayout>
      <div>
        {loading.main && <Loader title={`updating`} />}
        <div className='h-36 w-full -mt-10 py-8 bg-gradient-to-br from-ash to-primary'>
          <div className='w-11/12 mx-auto flex gap-2 justify-end items-center text-2xl font-bold uppercase mt-14'>
            <span>profile</span>
            <FaRegUserCircle className='text-lightgreen' />
          </div>
        </div>
        <div className="w-11/12 mx-auto">
          <div className='flex md:flex-row flex-col justify-between'>
            <div className='flex flex-col gap-4 -mt-20'>
              <div className='relative w-fit'>
                <img src={optimizeImageUrl(profile.img)} className='h-44 w-44 object-cover object-center border-8 border-[#141523] rounded-full bg-primary'></img>
                <label>
                  <div className='bg-primary rounded-full w-fit h-fit p-2 text-xl absolute bottom-4 right-0 border border-secondary cursor-pointer text-lightgreen'>
                    <BiSolidEditAlt />
                  </div>
                  <input ref={imgref} type="file" onChange={handleProfileUpload} hidden />
                </label>
              </div>
              <div className='text-2xl font-bold capitalize'>{user?.surname} {user?.first_name}</div>
              <div className='flex items-center gap-2 capitalize text-sm'>
                <div className='flex gap-1 items-center'>
                  {user?.kyc_verified === 'true' && user?.email_verified === 'true' ?
                    <>
                      <span>verified</span>
                      <MdVerified className='text-lightgreen' />
                    </>
                    :
                    <>
                      <span>unverified</span>
                      <GoUnverified className='text-red-600' />
                    </>
                  }
                </div>
                <div className='pl-2 border-l flex gap-1 items-center'>
                  <span>joined:</span>
                  <span>{moment().format('DD-MM-yyyy')}</span>
                  <MdOutlineDateRange className='text-lightgreen' />
                </div>
              </div>
            </div>
            {user?.kyc_verified !== 'true' &&
              <Link
                to={`/user/profile/kyc`}
                className='bg-primary w-fit h-fit py-1.5 px-5 rounded-lg md:text-base text-sm text-lightgreen font-medium flex gap-1 items-center mt-4 cursor-pointer hover:bg-[#2f2f47]' >
                <FaRegIdCard />
                <span>Apply for KYC Verification</span>
              </Link>
            }
            <div className='bg-primary w-fit h-fit py-1.5 px-5 rounded-lg md:text-base text-sm text-red-600 font-medium flex gap-1 items-center mt-4 cursor-pointer hover:bg-[#2f2f47]' onClick={logoutAccount}>
              <IoLogOut />
              <span>Log out</span>
            </div>
          </div>
          <form className='flex flex-col gap-8 mt-16' onSubmit={Submit}>
            <div className='flex flex-col gap-5'>
              <div className='text-xl capitalize font-medium text-lightgreen'>personal details</div>
              {user?.google === 'true' && user?.password === null &&
                <div className="text-xs w-fit px-3 py-1 bg-ash rounded-sm">You signed up with your Google details, Kindly update your account by setting up a new password and phone number.</div>
              }
              <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                <div className='relative'>
                  <FormInput label='First name' placeholder='Your first name' name='first_name' value={form.first_name} onChange={formHandler} className='!pl-4 !pr-10' />
                  <HiUser className='absolute top-11 right-3 text-xl text-gray-400' />
                </div>
                <div className='relative'>
                  <FormInput label='Surname' placeholder='Your surname' name='surname' value={form.surname} onChange={formHandler} className='!pl-4 !pr-10' />
                  <HiUser className='absolute top-11 right-3 text-xl text-gray-400' />
                </div>
                <div className='relative'>
                  <FormInput label='Email address' placeholder='example@gmail.com' name='email' value={form.email} onChange={formHandler} type='email' className='!pl-4 !pr-10' />
                  <MdEmail className='absolute top-11 right-3 text-xl text-gray-400' />
                </div>
                <div className='relative'>
                  <FormInput label='Phone number' placeholder='Phone number' name='phone_number' value={form.phone_number} onChange={handlePhoneNum} className='!pl-4 !pr-10' />
                  <BiSolidPhone className='absolute top-11 right-3 text-xl text-gray-400' />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-5'>
              <div className='text-xl capitalize font-medium text-lightgreen'>password & security</div>
              {user?.google === 'true' && user?.password === null ?
                <>
                  <div className="w-11/12 md:w-2/4">
                    <PasswordInputField label='New password' placeholder='Create new password' name='new_password' value={form.new_password} onChange={formHandler} className={{ icon: '!text-gray-400' }} />
                  </div>
                </>

                :
                <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                  <PasswordInputField label='Old password' placeholder='Enter old password' name='old_password' value={form.old_password} onChange={formHandler} className={{ icon: '!text-gray-400' }} />
                  <PasswordInputField label='New password' placeholder='Create new password' name='new_password' value={form.new_password} onChange={formHandler} className={{ icon: '!text-gray-400' }} />
                </div>}
            </div>
            <div className='grid md:grid-cols-2 grid-cols-1'>
              <FormButton title='Save changes' />
            </div>
            <div className='flex flex-col gap-5'>
              <div className='text-xl capitalize font-medium text-lightgreen'>add a bank account</div>
              <div className='w-fit h-fit bg-primary rounded-2xl p-4 flex flex-col gap-3 relative'>
                {loading.sub && <Loader />}
                <FormInput placeholder='Account number' name='account_number' value={form.account_number} onChange={handleAccNum} className='!bg-secondary !w-64' border={false} />
                {form.account_name && <FormInput name={`account_name`} value={form.account_name} className='!bg-secondary !w-64' border={false} read={true} />}

                <SelectComp
                  value={form.bank_name}
                  title={`${form.bank_name ? '' : 'Select bank'}`}
                  options={bankNames}
                  fullWidth size={false}
                  style={{ bg: '#171828', color: 'lightgrey', font: '0.8rem' }} handleChange={(e) => setForm({ ...form, bank_name: e.target.value })} />


                <FormButton title={Object.keys(bank).length !== 0 ? 'Update' : 'Save'} className='!py-3 !text-base' type='button' onClick={AddBankAccount} />
              </div>
            </div>
          </form>
        </div>
      </div>
    </AuthPageLayout>
  )
}

export default Profile