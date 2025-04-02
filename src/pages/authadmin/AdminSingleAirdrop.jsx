import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import Loader from '../../GeneralComponents/Loader'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { FaEdit } from 'react-icons/fa'
import { FiUploadCloud } from 'react-icons/fi'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import FormInput from '../../utils/FormInput'
import SelectComp from '../../GeneralComponents/SelectComp'
import FormButton from '../../utils/FormButton'
import { Apis, AuthGetApi, AuthPostApi, AuthPutApi, imageurl } from '../../services/API'
import ModalLayout from '../../utils/ModalLayout'
import { MdDelete } from "react-icons/md";

const statuses = [
    "open", "closed"
]
const categories = [
    "deFi", "featured", "new", "NFT", "potential", "earn_crypto"
]
const kyces = [
    "required", "unrequired"
]
const blockchains = ['Abstract', 'Algorand', 'ApeChain', 'Abitrum', 'Avalanche', 'Base', 'Berachain', 'Binance', 'Bitcoin', 'Blast', 'Cardano', 'Celestia', 'Cosmos', 'Dogechain', 'Ethereum', 'Filecoin', 'Immutable', 'Injective', 'IoTeX', 'Linea', 'Manta Network', 'Near Protocol', 'Optimism', 'Other', 'Polkadot', 'Polygon', 'Ronin', 'Scroll', 'Solana', 'Sui', 'Tesnet', 'TON', 'Tron', 'zkSync'
]


const AdminSingleAirdrop = () => {
    const { id } = useParams()
    const [dataLoading, setDataLoading] = useState(true)
    const [loading, setLoading] = useState({ status: false, desc: '' })
    const [singleAirdrop, setSingleAirdrop] = useState({})
    const [modal, setModal] = useState(false)
    const [form, setForm] = useState({
        title: '',
        category: '',
        blockchain: '',
        kyc: '',
        type: '',
        format: '',
        level: '',
        about: '',
        video_guide_link: '',
        referral_link: '',
        twitter_link: '',
        telegram_link: '',
        website_link: '',
        status: '',
        steps: []
    })
    const [banner, setBanner] = useState({
        img: null,
        image: null
    })
    const [logo, setLogo] = useState({
        img: null,
        image: null
    })
    const bannerRef = useRef()
    const logoRef = useRef()
    const navigate = useNavigate()

    const formHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }


    const FetchSingleAirdrop = useCallback(async () => {
        try {
            const response = await AuthGetApi(`${Apis.admin.single_airdrop}/${id}`)
            if (response.status === 200) {
                const data = response.msg
                setSingleAirdrop(data)
                setForm({
                    title: data.title || '',
                    category: data.category || categories[0],
                    blockchain: data.blockchain || blockchains[0],
                    kyc: data.kyc || kyces[0],
                    type: data.type || '',
                    format: data.format || '',
                    level: data.level || '',
                    about: data.about || '',
                    status: data.status || statuses[0],
                    referral_link: data.referral_link || '',
                    video_guide_link: data.video_guide_link || '',
                    twitter_link: data.twitter_link || '',
                    telegram_link: data.telegram_link || '',
                    website_link: data.website_link || '',
                    steps: JSON.parse(data.steps) || []
                })
                setLogo({
                    img: data?.logo_image || null
                })
                setBanner({
                    img: data.banner_image || null
                })
            }
        } catch (error) {
            //
        } finally {
            setDataLoading(false)
        }
    }, [])

    useEffect(() => {
        FetchSingleAirdrop()
    }, [FetchSingleAirdrop])

    const handleUpload = (event) => {
        const file = event.target.files[0]
        if (!file.type.startsWith('image/')) {
            bannerRef.current.value = null
            return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
        }
        setBanner({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const handleUpload2 = (event) => {
        const file = event.target.files[0]
        if (!file.type.startsWith('image/')) {
            logoRef.current.value = null
            return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
        }
        setLogo({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const Submit = async (e) => {
        e.preventDefault()

        if (form.steps.length === 0) return ErrorAlert(`Add at least a step to this airdrop`)
        if (!form.title || !form.category || !form.about || !form.blockchain || !form.type || !form.format || !form.level || !form.referral_link) return ErrorAlert('Enter all required fields')

        const formbody = new FormData()
        formbody.append('airdrop_id', singleAirdrop.id)
        formbody.append('logo_image', logo.image)
        formbody.append('banner_image', banner.image)
        formbody.append('title', form.title)
        formbody.append('category', form.category)
        formbody.append('about', form.about)
        formbody.append('blockchain', form.blockchain)
        formbody.append('kyc', form.kyc)
        formbody.append('type', form.type)
        formbody.append('format', form.format)
        formbody.append('level', form.level)
        formbody.append('video_guide_link', form.video_guide_link)
        formbody.append('referral_link', form.referral_link)
        formbody.append('status', form.status)
        formbody.append('telegram_link', form.telegram_link)
        formbody.append('twitter_link', form.twitter_link)
        formbody.append('website_link', form.website_link)
        form.steps.forEach(ele => {
            formbody.append('steps', ele)
        })

        setLoading({ status: true, desc: 'updating' })
        try {
            const response = await AuthPutApi(Apis.admin.update_airdrop, formbody)
            if (response.status === 200) {
                FetchSingleAirdrop()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading({ status: false, desc: '' })
        }
    }

    const DeleteAirdrop = async () => {
        setModal(false)
        setLoading({ status: true, desc: 'deleting' })
        try {
            const response = await AuthPostApi(Apis.admin.delete_closed_airdrop, { airdrop_id: singleAirdrop.id })
            if (response.status === 200) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
                navigate(`/admin/airdrops/all`)
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading({ status: false, desc: '' })
        }
    }

    const optimizeImageUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url; // Return unchanged if not Cloudinary
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`; // Insert transformations
    };


    const addStep = () => {
        setForm(prevForm => ({
            ...prevForm,
            steps: [...prevForm.steps, ""]
        }));
    };

    const handleStepChange = (index, value) => {
        setForm(prevForm => {
            const updatedSteps = [...prevForm.steps];
            updatedSteps[index] = value;
            return { ...prevForm, steps: updatedSteps };
        });
    };

    const removeStep = (index) => {
        setForm(prevForm => {
            const updatedSteps = [...prevForm.steps];
            updatedSteps.splice(index, 1);
            return { ...prevForm, steps: updatedSteps };
        });
    };



    return (
        <AdminPageLayout>
            <div className='w-11/12 mx-auto'>
                {loading.status && <Loader title={loading.desc} />}
                <Link to='/admin/airdrops/all' className="w-fit rounded-md px-5 py-2 bg-ash text-white cursor-pointer">
                    back to all airdrops
                </Link>
                {dataLoading ?
                    <div className='mt-10 grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-6'>
                        <div className='flex flex-col gap-6'>
                            <div className='flex justify-between gap-4 items-center'>
                                <div className='w-24 h-2 rounded-full bg-slate-400 animate-pulse'></div>
                                <div className='md:size-20 size-16 bg-slate-400 rounded-full animate-pulse'></div>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div className='w-24 h-2 rounded-full bg-slate-400 animate-pulse'></div>
                                <div className='w-full h-72 bg-slate-400 animate-pulse'></div>
                            </div>
                        </div>
                        <div className='flex flex-col gap-6'>
                            {new Array(5).fill(0).map((_, i) => (
                                <div key={i} className='flex flex-col gap-3'>
                                    <div className='w-28 h-2 rounded-full bg-slate-400 animate-pulse'></div>
                                    <div className='w-full h-12 bg-slate-400 animate-pulse rounded-xl'></div>
                                </div>
                            ))}
                        </div>
                    </div>
                    :
                    <form className='mt-10 flex flex-col gap-10' onSubmit={Submit}>
                        <div className='grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-6'>
                            <div className='flex flex-col gap-6'>
                                <div className='flex justify-between gap-4 items-center'>
                                    <div className='text-lightgreen capitalize font-medium'>*logo:</div>
                                    <label className='cursor-pointer'>
                                        {logo.img ?
                                            <div className='relative w-fit'>
                                                <img src={optimizeImageUrl(logo.img)} alt={logo.img} className='md:size-20 size-16 rounded-full object-cover'></img>
                                                <div className="absolute top-0 -right-2 main font-bold">
                                                    <FaEdit className='text-xl text-lightgreen' />
                                                </div>
                                            </div>
                                            :
                                            <div className='w-20 h-20 border border-dashed rounded-full flex flex-col gap-2 items-center justify-center'>
                                                <div className='bg-primary rounded-full p-4'><FiUploadCloud /></div>
                                            </div>
                                        }
                                        <input ref={logoRef} type="file" onChange={handleUpload2} hidden />
                                    </label>
                                </div>
                                <div className='flex flex-col gap-2 w-full'>
                                    <div className='text-lightgreen capitalize font-medium'>*banner:</div>
                                    <label className='cursor-pointer w-full'>
                                        {banner.img ?
                                            <div className='relative'>
                                                <img src={optimizeImageUrl(banner.img)} alt={banner.img} className='w-full h-72 object-cover object-center'></img>
                                                <div className="absolute top-0 -right-3 main font-bold">
                                                    <FaEdit className='text-2xl text-lightgreen' />
                                                </div>
                                            </div>
                                            :
                                            <div className='w-full h-72 border border-dashed rounded-xl flex flex-col gap-2 items-center justify-center'>
                                                <div className='bg-primary rounded-full p-4'><FiUploadCloud /></div>
                                                <span>click to add image</span>
                                            </div>
                                        }
                                        <input ref={bannerRef} type="file" onChange={handleUpload} hidden />
                                    </label>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>*title:</div>
                                    <FormInput placeholder='Title' name='title' value={form.title} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-lightgreen capitalize font-medium'>*category:</div>
                                    <SelectComp options={categories} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.category} handleChange={(e) => setForm({ ...form, category: e.target.value })} />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-lightgreen capitalize font-medium'>*KYC:</div>
                                    <SelectComp options={kyces} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.kyc} handleChange={(e) => setForm({ ...form, kyc: e.target.value })} />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-lightgreen capitalize font-medium'>*blockchain:</div>
                                    <SelectComp options={blockchains} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.blockchain} handleChange={(e) => setForm({ ...form, blockchain: e.target.value })} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>*type</div>
                                    <FormInput placeholder='Airdrop type' name='type' value={form.type} onChange={formHandler} />
                                </div>
                            </div>
                            <div className='flex flex-col gap-6 '>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>*format</div>
                                    <FormInput placeholder='Airdrop format' name='format' value={form.format} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>*level</div>
                                    <FormInput placeholder='Airdrop level' name='level' value={form.level} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>*about:</div>
                                    <FormInput formtype='textarea' placeholder='About airdrop' name='about' value={form.about} onChange={formHandler} />
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="font-medium text-lightgreen">*Steps:</label>
                                <div className='flex flex-col gap-3'>
                                    {form.steps.map((step, index) => (
                                        <div key={index} className="flex items-center gap-2 w-full">
                                            <div className="w-full">
                                                <FormInput
                                                    formtype='textarea'
                                                    label={`step ${index + 1}`}
                                                    value={step}
                                                    onChange={(e) => handleStepChange(index, e.target.value)}
                                                    className={`!h-20`}
                                                ></FormInput>
                                            </div>
                                            <div onClick={() => removeStep(index)} className="bg-red-500 cursor-pointer p-2 rounded-full">
                                                <MdDelete className="text-white " />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button type="button" className="bg-ash text-white px-4 py-2 rounded mt-2" onClick={addStep}
                                >Add Step</button>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>*referral link:</div>
                                    <FormInput placeholder='Referral link' name='referral_link' value={form.referral_link} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>video guide link:</div>
                                    <FormInput placeholder='Video guide link' name='video_guide_link' value={form.video_guide_link} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>twitter link:</div>
                                    <FormInput placeholder='Twitter link' name='twitter_link' value={form.twitter_link} onChange={formHandler} />
                                </div>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>telegram link:</div>
                                    <FormInput placeholder='Telegram link' name='telegram_link' value={form.telegram_link} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>website link:</div>
                                    <FormInput placeholder='Website link' name='website_link' value={form.website_link} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-lightgreen capitalize font-medium'>status:</div>
                                    <SelectComp options={statuses} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.status} handleChange={(e) => setForm({ ...form, status: e.target.value })} />
                                </div>
                            </div>
                        </div>
                        <FormButton title='Save Changes' className='md:!w-1/2 w-full mx-auto' />
                        {singleAirdrop.status === 'closed' && <FormButton title='Delete Airdrop' type='button' className='md:!w-1/2 w-full mx-auto !bg-red-700 hover:!bg-red-400' onClick={() => setModal(true)} />}
                        {modal &&
                            <ModalLayout setModal={setModal} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                                <div className="p-5 bg-white text-dark rounded-md">
                                    <div className="text-base text-center mb-3">Are you sure you want to delete this airdrop?</div>
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setModal(false)} className='px-4 py-2 bg-red-600 text-white rounded-md' type='button'>Cancel</button>
                                        <button className='px-4 py-2 bg-green-600 text-white rounded-md' type='button' onClick={DeleteAirdrop}>confirm delete</button>
                                    </div>

                                </div>
                            </ModalLayout>
                        }
                    </form>
                }
            </div>
        </AdminPageLayout>
    )
}

export default AdminSingleAirdrop