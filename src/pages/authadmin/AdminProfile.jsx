import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { MdEmail, MdOutlineAdminPanelSettings } from "react-icons/md";
import { FaEdit, FaRegUserCircle } from "react-icons/fa";
import { HiUser } from "react-icons/hi2";
import { BiSolidEditAlt, BiSolidPhoneCall } from "react-icons/bi";
import { IoLogOut } from "react-icons/io5";
import FormInput from '../../utils/FormInput';
import PasswordInputField from '../../utils/PasswordInputField';
import { CookieName, ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import FormButton from '../../utils/FormButton';
import AdminPageLayout from '../../AdminComponents/AdminPageLayout';
import Loader from '../../GeneralComponents/Loader';
import Loading from '../../GeneralComponents/Loading';
import Cookies from 'js-cookie'
import { useAtom } from 'jotai';
import { BANK, PROFILE, UTILS } from '../../services/store';
import avatar from '../../assets/images/avatar.svg'
import { Apis, AuthGetApi, AuthPostApi, AuthPutApi, imageurl } from '../../services/API';
import { FiUploadCloud } from 'react-icons/fi';

const AdminProfile = () => {
    const [user, setUser] = useAtom(PROFILE)
    const [bank, setBank] = useAtom(BANK)
    const [utils, setUtils] = useAtom(UTILS)
    const [allCarouselImages, setAllCarouselImages] = useState([])
    const [loading, setLoading] = useState({
        main: false,
        sub1: false,
        sub2: false,
        sub3: false
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
        exchange_buy_rate: '',
        exchange_sell_rate: '',
        giftcard_rate: '',
        bank_min: '',
        kyc_threshold: '',
        leaderboard_reward: ''
    })
    const [profile, setProfile] = useState({
        img: user.image ? user.image : avatar,
        image: null
    })
    const [carouselImage, setCarouselImage] = useState({
        img: null,
        image: null
    })

    const imgref = useRef()
    const carouselimgref = useRef()
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

    const handleNums = (e) => {
        let value = e.target.value
        const formatVal = value.replace(/\D/g, '')
        setForm({ ...form, [e.target.name]: formatVal })
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
            account_number: bank?.account_number || '',
            exchange_buy_rate: utils?.exchange_buy_rate || '',
            exchange_sell_rate: utils?.exchange_sell_rate || '',
            giftcard_rate: utils?.giftcard_rate || '',
            bank_min: utils?.bank_withdraw_min || '',
            leaderboard_reward: utils?.leaderboard_reward || '',
        })
    }, [utils, bank])

    const FetchCarouselImages = useCallback(async () => {
        try {
            const response = await AuthGetApi(Apis.user.get_carousel_images)
            if (response.status === 200) {
                setAllCarouselImages(response.msg)
            }
        } catch (error) {
            //
        }
    }, [])
    useEffect(() => {
        FetchCarouselImages()
    }, [FetchCarouselImages])

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

    const handleCarouselUpload = (event) => {
        const file = event.target.files[0]
        if (!file.type.startsWith('image/')) {
            carouselimgref.current.value = null
            return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
        }
        setCarouselImage({
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
        if (!form.account_number || !form.account_name || !form.bank_name) return ErrorAlert('Enter all fields')
        const formbody = {
            bank_name: form.bank_name,
            account_number: form.account_number,
            account_name: form.account_name
        }

        setLoading({
            sub1: true
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
                sub1: false
            })
        }
    }

    const UpdateUtils = async () => {
        const formbody = {
            exchange_buy_rate: parseFloat(form.exchange_buy_rate),
            exchange_sell_rate: parseFloat(form.exchange_sell_rate),
            kyc_threshold: parseFloat(form.kyc_threshold),
            bank_withdraw_min: parseFloat(form.bank_min),
            giftcard_rate: parseFloat(form.giftcard_rate),
            leaderboard_reward: parseFloat(form.leaderboard_reward),
        }

        setLoading({
            sub2: true
        })
        try {
            const response = await AuthPutApi(Apis.admin.update_utils, formbody)
            if (response.status === 200) {
                setUtils(response.utils)
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading({
                sub2: false
            })
        }
    }

    const AddCarouselImage = async () => {
        if (!carouselImage.image) return ErrorAlert('Upload an image')
        const formbody = new FormData()
        formbody.append('image', carouselImage.image)
        setLoading({
            sub3: true
        })
        try {
            const response = await AuthPostApi(Apis.user.add_carousel_image, formbody)
            if (response.status === 200) {
                FetchCarouselImages()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
                setCarouselImage({
                    img: null,
                    image: null
                })
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading({
                sub3: false
            })
        }
    }

    const DeleteCarouselImage = async (id) => {
        setLoading({
            sub3: true
        })
        try {
            const response = await AuthPostApi(Apis.user.delete_carousel_image, { id: id })
            if (response.status === 200) {
                FetchCarouselImages()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading({
                sub3: false
            })
        }
    }

    const optimizeImageUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`;
    };


    return (
        <AdminPageLayout>
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
                                <img src={optimizeImageUrl(profile.img)} className='h-44 w-44 object-cover border-8 border-[#141523] bg-primary rounded-full'></img>
                                <label>
                                    <div className='bg-primary rounded-full w-fit h-fit p-2 text-xl absolute bottom-4 right-0 border border-secondary cursor-pointer text-lightgreen'>
                                        <BiSolidEditAlt />
                                    </div>
                                    <input ref={imgref} type="file" onChange={handleProfileUpload} hidden />
                                </label>
                            </div>
                            <div className='text-2xl font-bold capitalize'>{user?.first_name}  {user?.surname}</div>
                            <div className='flex gap-1 items-center text-sm'>
                                <div className='capitalize'>admin / moderator</div>
                                <MdOutlineAdminPanelSettings className='text-lightgreen text-lg' />
                            </div>
                        </div>
                        <div className='bg-primary w-fit h-fit py-1.5 px-5 rounded-lg md:text-base text-sm text-red-600 font-medium flex gap-1 items-center mt-4 cursor-pointer hover:bg-[#2f2f47]' onClick={logoutAccount}>
                            <IoLogOut />
                            <span>Log out</span>
                        </div>
                    </div>
                    <form className='flex flex-col gap-8 mt-16' onSubmit={Submit}>
                        <div className='flex flex-col gap-5'>
                            <div className='text-xl capitalize font-medium text-lightgreen'>personal details</div>
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
                                    <FormInput label='Phone number' placeholder='Phone number' name='phone_number' value={form.phone_number} onChange={handleNums} className='!pl-4 !pr-10' />
                                    <BiSolidPhoneCall className='absolute top-11 right-3 text-xl text-gray-400' />
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <div className='text-xl capitalize font-medium text-lightgreen'>password & security</div>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-6'>
                                <PasswordInputField label='Old password' placeholder='Enter old password' name='old_password' value={form.old_password} onChange={formHandler} className={{ icon: '!text-gray-400' }} />
                                <PasswordInputField label='New password' placeholder='Create new password' name='new_password' value={form.new_password} onChange={formHandler} className={{ icon: '!text-gray-400' }} />
                            </div>
                        </div>
                        <div className='grid md:grid-cols-2 grid-cols-1'>
                            <FormButton title='Save changes' />
                        </div>
                        <div className='flex flex-col gap-5'>
                            <div className='text-xl capitalize font-medium text-lightgreen'>add a bank account</div>
                            <div className='w-fit h-fit bg-primary rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden'>
                                {loading.sub1 && <Loading />}
                                <FormInput placeholder='Account number' name='account_number' value={form.account_number} onChange={handleAccNum} className='!bg-secondary !w-64' border={false} />
                                <FormInput placeholder='Account name' name='account_name' value={form.account_name} onChange={formHandler} className='!bg-secondary !w-64' border={false} />
                                <FormInput placeholder='Bank name' name='bank_name' value={form.bank_name} onChange={formHandler} className='!bg-secondary !w-64' border={false} />
                                <FormButton title={Object.keys(bank).length !== 0 ? 'Update' : 'Save'} className='!py-3 !text-base' type='button' onClick={AddBankAccount} />
                            </div>
                        </div>
                        <div className='flex flex-col gap-5'>
                            <div className='text-xl capitalize font-medium text-lightgreen'>update settings</div>
                            <div className='w-fit h-fit bg-primary rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden'>
                                {loading.sub2 && <Loader title={`updating rates`} />}
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-medium text-gray-200 text-sm ml-2'>Exchange buy rate ($/₦)</div>
                                        <FormInput placeholder='Enter rate amount' name='exchange_buy_rate' value={form.exchange_buy_rate} onChange={handleNums} className='!bg-secondary !w-64' border={false} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-medium text-gray-200 text-sm ml-2'>Exchange sell rate ($/₦)</div>
                                        <FormInput placeholder='Enter rate amount' name='exchange_sell_rate' value={form.exchange_sell_rate} onChange={handleNums} className='!bg-secondary !w-64' border={false} />
                                    </div>
                                    
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-medium text-gray-200 text-sm ml-2'>Bank withdrawal min (NGN)</div>
                                        <FormInput placeholder='Enter minimum withdrawal amount' name='bank_min' value={form.bank_min} onChange={handleNums} className='!bg-secondary !w-64' border={false} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='font-medium text-gray-200 text-sm ml-2'>Leaderboard reward (USD)</div>
                                        <FormInput placeholder='Enter leaderboard reward amount' name='leaderboard_reward' value={form.leaderboard_reward} onChange={handleNums} className='!bg-secondary !w-64' border={false} />
                                    </div>
                                </div>
                                <FormButton title='Update' className='!py-3 !text-base md:!w-1/2 mx-auto' type='button' onClick={UpdateUtils} />
                            </div>
                        </div>

                        <div className='flex flex-col gap-5'>
                            <div className='text-xl capitalize font-medium text-lightgreen'>add carousel images</div>
                            <div className='w-fit h-fit bg-primary rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden'>
                                {loading.sub3 && <Loader />}
                                <div className='flex md:flex-row flex-col gap-4 md:items-start items-center'>
                                    {allCarouselImages.length > 0 &&
                                        <div className={`grid ${allCarouselImages.length > 1 ? 'grid-cols-2' : 'grid-cols-1'} gap-3`}>
                                            {allCarouselImages.map((item, i) => (
                                                <div key={i} className='relative'>
                                                    <img src={item.image} alt='carousel image' className='w-40 h-32 object-cover object-center border-2 border-ash rounded-md'></img>
                                                    <div className='bg-red-700 hover:bg-red-500 py-1 px-2 rounded-md cursor-pointer text-xs absolute top-1 right-1' onClick={() => DeleteCarouselImage(item.id)}>delete</div>
                                                </div>
                                            ))}
                                        </div>
                                    }
                                    <div className='flex flex-col gap-4'>
                                        <label className='cursor-pointer'>
                                            {carouselImage.img ?
                                                <div className='relative'>
                                                    <img src={carouselImage.img} alt={carouselImage.img} className='w-60 md:h-56 h-44 object-cover object-center'></img>
                                                    <div className="absolute top-0 -right-3 main font-bold">
                                                        <FaEdit className='text-2xl text-lightgreen' />
                                                    </div>
                                                </div>
                                                :
                                                <div className='w-60 md:h-56 h-44 border border-dashed rounded-xl flex flex-col gap-2 items-center justify-center'>
                                                    <div className='bg-secondary rounded-full p-4'><FiUploadCloud /></div>
                                                    <span>click to add image</span>
                                                </div>
                                            }
                                            <input ref={carouselimgref} type="file" onChange={handleCarouselUpload} hidden />
                                        </label>
                                        <FormButton title='Save' className='!py-3 !text-base' type='button' onClick={AddCarouselImage} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminProfile