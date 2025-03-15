import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useParams } from 'react-router-dom'
import FormInput from '../../utils/FormInput'
import { currencySign, ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import { FaCopy, FaEdit } from 'react-icons/fa';
import { RiDiscountPercentFill } from "react-icons/ri";
import SelectComp from '../../GeneralComponents/SelectComp';
import FormButton from '../../utils/FormButton';
import Loader from '../../GeneralComponents/Loader';
import { FiUploadCloud } from 'react-icons/fi';
import { Apis, AuthGetApi, AuthPutApi, imageurl } from '../../services/API';
import { useAtom } from 'jotai';
import { TOOLS } from '../../services/store';

const statuses = [
    "pending", "approved", "declined"
]
const durationTypes = [
    "days", "weeks", "months"
]
const listOptions = [
    "listed", "unlisted"
]

const AdminSingleProduct = () => {
    const { id } = useParams()
    const [tools] = useAtom(TOOLS)
    const [singleProduct, setSingleProduct] = useState({})
    const [dataLoading, setDataLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        category: [],
        price: '',
        about: '',
        feature1: '',
        feature2: '',
        status: '',
        other: '',
        listing: '',
        discount_percentage: '',
        discount_duration: '',
        discount_duration_type: '',
    })
    const [productImage, setProductImage] = useState({
        img: null,
        image: null
    })
    const imgRef = useRef()

    const formHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }
    const FetchSingleProduct = useCallback(async () => {
        try {
            const response = await AuthGetApi(`${Apis.admin.single_product}/${id}`)
            if (response.status === 200) {
                const data = response.msg
                setSingleProduct(data)
                setForm({
                    ...form,
                    title: data.title,
                    category: JSON.parse(data.category) || [],
                    blockchain: data.blockchain || '',
                    price: data.price || '',
                    about: data.about || '',
                    feature1: data.feature1 || '',
                    feature2: data.feature2 || '',
                    status: data.status || '',
                    listing: data.listing || '',
                    other: data.other || '',
                    discount_percentage: data.discount_percentage || '',
                    discount_duration: data.discount_duration || '',
                    discount_duration_type: data.discount_duration_type || durationTypes[0]
                })
                setProductImage({
                    img: data.image || null
                })
            }
        } catch (error) {
            //
        } finally {
            setDataLoading(false)
        }
    }, [])

    useEffect(() => {
        FetchSingleProduct()
    }, [FetchSingleProduct])

    const handleUpload = (event) => {
        const file = event.target.files[0]
        if (!file.type.startsWith('image/')) {
            imgRef.current.value = null
            return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
        }
        setProductImage({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const addRemoveCategory = (val) => {
        setForm((prev) => {
            const { category } = prev
            if (category.includes(val)) {
                return {
                    ...prev,
                    category: category.filter(item => item !== val)
                }
            } else {
                return {
                    ...prev,
                    category: [...category, val]
                }
            }
        })
    }

    const copyFunction = (content) => {
        navigator.clipboard.writeText(content)
        SuccessAlert('Text copied successfully')
    }

    const Submit = async (e) => {
        e.preventDefault()

        if (form.category.length < 1) return ErrorAlert('Choose a category')
        if (!form.title || !form.price || !form.about || !form.feature1 || !form.feature2) return ErrorAlert('Enter all required fields')
        if (isNaN(form.price) || isNaN(form.discount_percentage) || isNaN(form.discount_duration)) return ErrorAlert('Price, discount percentage and discount duration must be valid numbers')

        const formbody = new FormData()
        formbody.append('product_id', singleProduct.id)
        formbody.append('image', productImage.image)
        formbody.append('title', form.title)
        form.category.forEach(ele => {
            formbody.append('category', ele)
        })
        formbody.append('price', parseFloat(form.price))
        formbody.append('about', form.about)
        formbody.append('feature1', form.feature1)
        formbody.append('feature2', form.feature2)
        formbody.append('status', form.status)
        formbody.append('listing', form.listing)
        formbody.append('discount_percentage', form.discount_percentage && parseFloat(form.discount_percentage))
        formbody.append('discount_duration', form.discount_duration && parseFloat(form.discount_duration))
        formbody.append('discount_duration_type', form.discount_duration_type)

        setLoading(true)
        try {
            const response = await AuthPutApi(Apis.admin.update_product, formbody, { category: form.category })
            if (response.status === 200) {
                FetchSingleProduct()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }

    }

    const optimizeImageUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url; // Return unchanged if not Cloudinary
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`; // Insert transformations
    };

    return (
        <AdminPageLayout>
            <div className='w-11/12 mx-auto'>
                {loading && <Loader title={`updating`} />}
                <Link to='/admin/products/all' className="w-fit rounded-md px-5 py-2 bg-ash text-white cursor-pointer">
                    back to all products
                </Link>
                {dataLoading ?
                    <div className='mt-10 grid md:grid-cols-2 grid-cols-1 md:gap-10 gap-6'>
                        <div className='w-full h-72 bg-slate-400 animate-pulse'></div>
                        <div className='flex flex-col gap-6'>
                            {new Array(3).fill(0).map((_, i) => (
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
                            <label className='cursor-pointer w-full'>
                                {productImage.img ?
                                    <div className='relative'>
                                        <img src={optimizeImageUrl(productImage.img)} alt={`product image`} className='w-full h-72 object-cover object-center'></img>
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
                                <input ref={imgRef} type="file" onChange={handleUpload} hidden />
                            </label>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>title:</div>
                                    <FormInput placeholder='Title' name='title' value={form.title} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>category:</div>
                                    <div className='flex flex-wrap gap-2'>
                                        {form.category.length > 0 &&
                                            <>
                                                {form.category.map((item, i) => (
                                                    <div key={i} className='w-fit h-fit p-2 bg-ash text-white rounded-xl text-sm'>
                                                        {item}
                                                    </div>
                                                ))}
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>Other tools specified by user:</div>
                                    <div className='flex flex-wrap gap-2'>
                                        {form.other ?
                                            <div className='w-fit h-fit p-2 text-white bg-gray-500 rounded-xl text-sm'>{form.other}</div> :
                                            <div className="">n/a</div>
                                        }
                                    </div>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>all product tools:</div>
                                    <div className='flex flex-wrap gap-2'>
                                        {tools.length > 0 &&
                                            <>
                                                {tools.map((item, i) => (
                                                    <div key={i} className='flex gap-2 items-center w-fit h-fit p-2 bg-ash text-white rounded-xl text-sm'>
                                                        <div>{item.name}</div>
                                                        <div className={`${form.category.includes(item.name) ? 'bg-lightgreen' : 'bg-white'} h-3.5 w-3.5 rounded-full cursor-pointer`} onClick={() => addRemoveCategory(item.name)}></div>
                                                    </div>
                                                ))}
                                            </>
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>price ({currencySign[1]}):</div>
                                    <FormInput placeholder='Price' name='price' value={form.price} onChange={formHandler} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>about:</div>
                                    <FormInput formtype='textarea' placeholder='About tool' name='about' value={form.about} onChange={formHandler} />
                                </div>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>feature 1:</div>
                                    <FormInput formtype='textarea' placeholder='Enter tool feature' name='feature1' value={form.feature1} onChange={formHandler} className='!h-20' />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-lightgreen capitalize font-medium'>feature 2:</div>
                                    <FormInput formtype='textarea' placeholder='Enter tool feature' name='feature2' value={form.feature2} onChange={formHandler} className='!h-20' />
                                </div>
                            </div>
                            <div className="w-full h-fit px-5 text-dark py-5 bg-[#fafafa] rounded-md flex items-center justify-between flex-col gap-4">
                                <div className='flex flex-col gap-1 w-full'>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="">Bank Name:</div>
                                        <div className="">{singleProduct?.bank_name}</div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="">Account number:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="">{singleProduct?.account_number}</div>
                                            <FaCopy onClick={() => copyFunction(singleProduct?.account_number)} className='text-ash text-sm cursor-pointer' />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="">Account name:</div>
                                        <div className="">{singleProduct?.account_name}</div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-1 w-full border-t pt-2'>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="">Video link / URL:</div>
                                        <a href={singleProduct?.video_link} target="_blank" rel="noopener noreferrer" className="underline">{singleProduct?.video_link}</a>
                                    </div>
                                    <div className="flex items-center justify-between gap-4">
                                        <div className="">Contact Details:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="">{singleProduct?.contact_detail}</div>
                                            <FaCopy onClick={() => copyFunction(singleProduct?.contact_detail)} className='text-ash text-sm cursor-pointer' />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-6'>
                                <div className='flex flex-col'>
                                    <div className='text-lightgreen capitalize font-medium'>status:</div>
                                    <SelectComp options={statuses} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.status} handleChange={(e) => setForm({ ...form, status: e.target.value })} />
                                </div>
                                <div className='flex flex-col'>
                                    <div className='text-lightgreen capitalize font-medium'>list product for purchase:</div>
                                    <SelectComp options={listOptions} width={200} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.listing} handleChange={(e) => setForm({ ...form, listing: e.target.value })} />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <div className='flex gap-1 items-center text-lightgreen '>
                                        <div className='capitalize font-medium'>add a discount</div>
                                        <RiDiscountPercentFill />
                                    </div>
                                    <div className='grid md:grid-cols-2 grid-cols-1 gap-4 items-center'>
                                        <div className='flex flex-col gap-2'>
                                            <div className='text-lightgreen capitalize font-medium'>discount percentage (%):</div>
                                            <FormInput placeholder='Discount' name='discount_percentage' value={form.discount_percentage} onChange={formHandler} />
                                        </div>
                                        <div className='flex flex-col gap-1'>
                                            <div className='text-lightgreen capitalize font-medium'>duration:</div>
                                            <div className='flex items-center'>
                                                <FormInput name='discount_duration' value={form.discount_duration} onChange={formHandler} className='!w-14 !px-3' />
                                                <SelectComp options={durationTypes} width={150} style={{ bg: '#212134', color: 'lightgrey', font: '0.85rem' }} value={form.discount_duration_type} handleChange={(e) => setForm({ ...form, discount_duration_type: e.target.value })} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <FormButton title='Save Changes' className='md:!w-1/2 w-full mx-auto' />
                    </form>
                }
            </div>
        </AdminPageLayout>
    )
}

export default AdminSingleProduct