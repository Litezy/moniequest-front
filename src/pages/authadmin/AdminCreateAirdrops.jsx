import React, { useRef, useState } from 'react'
import Loader from '../../GeneralComponents/Loader'
import { FaEdit } from 'react-icons/fa'
import { FiUploadCloud } from 'react-icons/fi'
import { defaultOptions, ErrorAlert } from '../../utils/pageUtils'
import FormInput from '../../utils/FormInput'
import SelectComp from '../../GeneralComponents/SelectComp'
import FormButton from '../../utils/FormButton'
import AirdropsLayout from '../../AdminComponents/AirdropsLayout'
import Lottie from 'react-lottie'
import { Link } from 'react-router-dom'
import { Apis, AuthPostApi } from '../../services/API'
import { MdDelete } from 'react-icons/md'

const categories = [
    "deFi", "featured", "new", "NFT", "potential", "earn_crypto"
]
const kyces = [
    "required", "unrequired"
]
const blockchains = ['Abstract', 'Algorand', 'ApeChain', 'Abitrum', 'Avalanche', 'Base', 'Berachain', 'Binance', 'Bitcoin', 'Blast', 'Cardano', 'Celestia', 'Cosmos', 'Dogechain', 'Ethereum', 'Filecoin', 'Immutable', 'Injective', 'IoTeX', 'Linea', 'Manta Network', 'Near Protocol', 'Optimism', 'Other', 'Polkadot', 'Polygon', 'Ronin', 'Scroll', 'Solana', 'Sui', 'Tesnet', 'TON', 'Tron', 'zkSync'
]


const AdminCreateAirdrops = () => {
    const [screen, setScreen] = useState(1)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        category: categories[0],
        kyc: kyces[0],
        blockchain: blockchains[0],
        type: '',
        format: '',
        level: '',
        about: '',
        video_guide_link: '',
        referral_link: '',
        twitter_link: '',
        telegram_link: '',
        website_link: '',
        steps: ['']
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

    const formHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

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
        if (!logo.image || !banner.image) return ErrorAlert('Upload airdrop logo and banner images')

        const formbody = new FormData()
        formbody.append('logo_image', logo.image)
        formbody.append('banner_image', banner.image)
        formbody.append('title', form.title)
        formbody.append('category', form.category)
        formbody.append('about', form.about)
        formbody.append('blockchain', form.blockchain)
        formbody.append('kyc', form.kyc)
        formbody.append('type', form.type)
        form.steps.forEach(ele => {
            formbody.append('steps', ele)
        })
        formbody.append('format', form.format)
        formbody.append('level', form.level)
        formbody.append('referral_link', form.referral_link)
        formbody.append('video_guide_link', form.video_guide_link)
        formbody.append('telegram_link', form.telegram_link)
        formbody.append('twitter_link', form.twitter_link)
        formbody.append('website_link', form.website_link)

        setLoading(true)
        try {
            const response = await AuthPostApi(Apis.admin.create_airdrop, formbody)
            if (response.status === 200) {
                await new Promise((resolve) => setTimeout(resolve, 2000))
                setScreen(2)
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }

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
        <AirdropsLayout>
            <div className='w-11/12 mx-auto'>
                {loading && <Loader title={`creating`} />}
                {screen === 1 &&
                    <div className='flex flex-col gap-10'>
                        <div className='flex flex-col gap-2'>
                            <div className='md:text-4xl text-3xl font-bold text-center'>Create and Upload Airdrop</div>
                            <div className='text-center'>Required fields are marked.</div>
                        </div>
                        <form className='flex flex-col gap-10' onSubmit={Submit}>
                            <div className='grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-6'>
                                <div className='flex flex-col gap-6'>
                                    <div className='flex justify-between gap-4 items-center'>
                                        <div className='text-lightgreen capitalize font-medium'>*logo:</div>
                                        <label className='cursor-pointer'>
                                            {logo.img ?
                                                <div className='relative w-fit'>
                                                    <img src={logo.img} alt={logo.img} className='w-20 h-20 rounded-full object-cover'></img>
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
                                                    <img src={banner.img} alt={banner.img} className='w-full h-auto object-cover'></img>
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
                                <div className='flex flex-col gap-6 '>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-lightgreen capitalize font-medium'>*title:</div>
                                        <FormInput placeholder='Title' name='title' value={form.title} onChange={formHandler} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='text-lightgreen capitalize font-medium'>*category:</div>
                                        <SelectComp options={categories} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.category} handleChange={(e) => setForm({ ...form, category: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='text-lightgreen font-medium'>*KYC:</div>
                                        <SelectComp options={kyces} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.kyc} handleChange={(e) => setForm({ ...form, kyc: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col'>
                                        <div className='text-lightgreen capitalize font-medium'>*blockchain:</div>
                                        <SelectComp options={blockchains} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.blockchain} handleChange={(e) => setForm({ ...form, blockchain: e.target.value })} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-lightgreen capitalize font-medium'>*type <span className='lowercase'>(gaming, bot, meme, e.t.c.):</span></div>
                                        <FormInput placeholder='Airdrop type' name='type' value={form.type} onChange={formHandler} />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-6'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-lightgreen capitalize font-medium'>*format <span className='lowercase'>(play to earn, refer to earn, e.t.c.):</span></div>
                                        <FormInput placeholder='Airdrop format' name='format' value={form.format} onChange={formHandler} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-lightgreen capitalize font-medium'>*level <span className='lowercase'>(basic, advanced, pro, e.t.c.):</span></div>
                                        <FormInput placeholder='Airdrop level' name='level' value={form.level} onChange={formHandler} />
                                    </div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-lightgreen capitalize font-medium'>*about <span className='lowercase'>(add \n for paragraph spacing)</span>:</div>
                                        <FormInput formtype='textarea' placeholder='About airdrop' name='about' value={form.about} onChange={formHandler} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="text-lightgreen">*Add Steps</div>
                                    <div className='flex flex-col gap-3'>
                                        {form.steps.map((step, index) => (
                                            <div key={index} className="flex items-center w-full gap-2">
                                                <div className="w-full">
                                                    <FormInput
                                                        formtype='textarea'
                                                        label={`step ${index + 1}`}
                                                        value={step}
                                                        onChange={(e) => handleStepChange(index, e.target.value)}
                                                        className={`!h-20`}
                                                    ></FormInput>
                                                </div>
                                                <div onClick={() => removeStep(index)}
                                                    className="bg-red-500 cursor-pointer p-2 rounded-full">
                                                    <MdDelete className="text-white" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div onClick={addStep} className="w-fit mt-2 px-5 py-2 rounded-md cursor-pointer bg-ash text-white">Add new step</div>
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
                                </div>
                            </div>
                            <FormButton title='Create' className='md:!w-1/2 w-full mx-auto' />
                        </form>
                    </div>
                }
                {screen === 2 &&
                    <div className="">
                        <div className="w-11/12 mx-auto min-h-[70dvh] flex items-center justify-center">
                            <div className="w-full flex items-center  flex-col">
                                <Lottie options={defaultOptions} height={250} width={300} />
                                <div className="mt-10 flex flex-col items-center">
                                    <div className="capitalize">Airdrop successfully Created
                                    </div>
                                    <Link to={`/admin/airdrops/all`} className={`bg-green-500 mt-10 hover:bg-lightgreen text-white hover:text-ash py-2 text-center rounded-md w-full`}>
                                        Go to all airdrops
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </AirdropsLayout>
    )
}

export default AdminCreateAirdrops