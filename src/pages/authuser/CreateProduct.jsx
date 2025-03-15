import React, { useRef, useState } from 'react'
import { SlClock } from "react-icons/sl";
import { FiUploadCloud } from 'react-icons/fi'
import { Link } from 'react-router-dom';
import { ErrorAlert } from '../../utils/pageUtils';
import Loader from '../../GeneralComponents/Loader';
import { FaEdit } from 'react-icons/fa';
import FormInput from '../../utils/FormInput';
import { useAtom } from 'jotai';
import { BANK, TOOLS } from '../../services/store';
import { Apis, AuthPostApi } from '../../services/API';
import ProductsLayout from '../../AuthComponents/ProductsLayout';
import ToolsDiv from '../../AuthComponents/ToolsDiv';



const CreateProduct = () => {
  const [bank] = useAtom(BANK)
  const [tools] = useAtom(TOOLS)
  const [screen, setScreen] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    category: [],
    price: '',
    title: '',
    about: '',
    feature1: '',
    feature2: '',
    bank_name: '',
    account_number: '',
    account_name: '',
    video_link: '',
    contact_detail: '',
    other: ''
  })
  const [productImage, setProductImage] = useState({
    img: null,
    image: null
  })
  const imgref = useRef()

  const formHandler = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleAmount = (e) => {
    let value = e.target.value
    const formatVal = value.replace(/\D/g, '')
    const formattedPrice = Number(formatVal).toLocaleString()
    setForm({ ...form, price: formattedPrice })
  }

  const PrefillBank = () => {
    if (Object.values(bank).length === 0) return ErrorAlert(`You haven't linked any bank to your account`)
    setForm({
      ...form,
      bank_name: bank.bank_name,
      account_name: bank.account_name,
      account_number: bank.account_number
    })
  }

  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (!file.type.startsWith('image/')) {
      imgref.current.value = null
      return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
    }
    setProductImage({
      img: URL.createObjectURL(file),
      image: file
    })
  }

  const Submit = async (e) => {
    e.preventDefault()
    if (form.category.length < 1) return ErrorAlert('Choose a category')
    if (!form.title || !form.price || !form.about || !form.feature1 || !form.feature2 || !form.video_link || !form.contact_detail || !form.bank_name || !form.account_name || !form.account_number) return ErrorAlert('Enter all fields')
    const amt = parseInt(form.price.replace(/,/g, ''))
    if (isNaN(amt)) return ErrorAlert('Price amount must be a number')
    if (!productImage.image) return ErrorAlert('Upload profit tool image')


    const formbody = new FormData()
    formbody.append('image', productImage.image)
    formbody.append('title', form.title)
    form.category.forEach(ele => {
      formbody.append('category', ele)
    })
    formbody.append('price', parseFloat(amt))
    formbody.append('about', form.about)
    formbody.append('feature1', form.feature1)
    formbody.append('feature2', form.feature2)
    formbody.append('video_link', form.video_link)
    formbody.append('contact_detail', form.contact_detail)
    formbody.append('bank_name', form.bank_name)
    formbody.append('account_number', form.account_number)
    formbody.append('account_name', form.account_name)
    formbody.append('other', form.other || '')
    setLoading(true)
    try {
      const response = await AuthPostApi(Apis.product.submit_product, formbody)
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

  const addCategory = (val) => {
    setForm((prev) => {
      const category = prev.category || [];
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


  return (
    <ProductsLayout>
      <div className='w-11/12 mx-auto'>
        {loading &&
          <Loader title={`submitting`} />
        }
        {screen === 1 &&
          <div className='max-w-2xl mx-auto h-fit p-6 border border-gray-400'>
            <div className='flex flex-col gap-4'>
              <div className='md:text-3xl text-2xl uppercase border-b-2 w-fit font-bold'>submit your products</div>
              <div>If you have a tool, resource, or guide that could benefit others, share it with Us! Each
                submission undergoes a quality review, and once approved, you’ll get paid. Your tool will then
                be featured on our platform for others to discover and use.</div>
              <div className='flex flex-col gap-4 mt-2'>
                <div className='capitalize text-xl font-bold'>submission guidelines:</div>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2 text-lg font-bold capitalize'>
                    <span>1.</span>
                    <span>video review requirement</span>
                  </div>
                  <div className='flex items-baseline'>
                    <div className='w-[5%]'>
                      <div className='w-2 h-2 rounded-full bg-lightgreen'></div>
                    </div>
                    <span className='w-[95%]'>Upload a demonstration video of your tool or eBook on your preferred social media
                      platform or YouTube.</span>
                  </div>
                  <div className='flex items-baseline'>
                    <div className='w-[5%]'>
                      <div className='w-2 h-2 rounded-full bg-lightgreen'></div>
                    </div>
                    <span className='w-[95%]'>Share the video link with us for review.</span>
                  </div>
                </div>
                <div className='flex flex-col gap-4'>
                  <div className='flex items-center gap-2 text-lg font-bold capitalize'>
                    <span>2.</span>
                    <span>evaluation process</span>
                  </div>
                  <div className='flex items-baseline'>
                    <div className='w-[5%]'>
                      <div className='w-2 h-2 rounded-full bg-lightgreen'></div>
                    </div>
                    <span className='w-[95%]'>Our team will evaluate the tool based on its quality and relevance.</span>
                  </div>
                  <div className='flex items-baseline'>
                    <div className='w-[5%]'>
                      <div className='w-2 h-2 rounded-full bg-lightgreen'></div>
                    </div>
                    <span className='w-[95%]'>If it aligns with our platform's goals, we will proceed to purchase it at your listed price
                      or negotiate if needed.</span>
                  </div>
                  <div className='flex items-baseline'>
                    <div className='w-[5%]'>
                      <div className='w-2 h-2 rounded-full bg-lightgreen'></div>
                    </div>
                    <span className='w-[95%]'>Tools not meeting our standards will be disapproved. We will notify you and explain the reason.</span>
                  </div>
                </div>
              </div>
              <button className='bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-fit h-fit py-3 px-20 rounded-lg outline-none uppercase font-bold mx-auto' onClick={() => setScreen(2)}>continue</button>
            </div>
          </div>
        }
        {screen === 2 &&
          <form onSubmit={Submit} className=''>
            <div className='flex flex-col gap-10 col-span-2'>
              <div className='flex flex-col gap-6'>
                <div className='flex flex-col gap-2'>
                  <div className='flex gap-3 font-bold text-lg text-lightgreen'>
                    <span>1.</span>
                    <span>Pick the Type of Product or eBook
                    </span>
                  </div>
                  <div className='text-sm'>(Choose the categories that best describes your submission)</div>
                </div>
                <div className='w-full grid grid-cols-1 md:grid-cols-2 gap-10'>
                  {tools.length > 0 ? tools.map((item, i) => (
                    <ToolsDiv key={i} item={item} handleCategory={addCategory} array={form.category} />
                  )) :
                    <div className="">No product type available!</div>
                  }
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col">
                    <div className="">Other</div>
                    <div className="text-xs text-zinc-100">Specify Your Tool or eBook Category</div>
                  </div>
                  <div className="w-full md:w-1/2">
                    <FormInput placeholder='Enter category' name='other' value={form.other} onChange={formHandler} className='!rounded-none' />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-10 w-full md:w-1/2">
                <div className='flex gap-2'>
                  <div className='font-bold text-lg text-lightgreen'>2.</div>
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='font-bold text-lg text-lightgreen'>Pricing</div>
                    <div className='text-sm'>Enter the price you want to sell your tool or eBook for.</div>
                    <div className='grid grid-cols-6 w-full h-fit items-center'>
                      <div className='col-span-1 h-full flex items-center justify-center border border-gray-400 uppercase text-xs'>ngn</div>
                      <div className='col-span-5'>
                        <FormInput placeholder='Amount' name='price' value={form.price} onChange={handleAmount} className='!rounded-none' />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='font-bold text-lg text-lightgreen'>3.</div>
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='font-bold text-lg text-lightgreen'>Product Details</div>
                    <FormInput placeholder='Enter title' name='title' value={form.title} onChange={formHandler} className='!rounded-none' />
                    <FormInput formtype='textarea' placeholder='What is this product about?' name='about' value={form.about} onChange={formHandler} className='!rounded-none' />
                    <FormInput formtype='textarea' placeholder='Enter a key feature' name='feature1' value={form.feature1} onChange={formHandler} className='!rounded-none !h-20' />
                    <FormInput formtype='textarea' placeholder='Enter key feature2' name='feature2' value={form.feature2} onChange={formHandler} className='!rounded-none !h-20' />
                    <label className='cursor-pointer'>
                      {productImage.img ?
                        <div className='relative'>
                          <img src={productImage.img} alt={productImage.img} className='h-60 w-full object-cover object-center'></img>
                          <div className="absolute top-0 -right-3 main font-bold">
                            <FaEdit className='text-2xl text-lightgreen' />
                          </div>
                        </div>
                        :
                        <div className='w-full h-60 border border-dashed rounded-xl flex flex-col gap-2 items-center justify-center'>
                          <div className='bg-primary rounded-full p-4'><FiUploadCloud /></div>
                          <span>click to add image</span>
                        </div>
                      }
                      <input ref={imgref} type="file" onChange={handleUpload} hidden />
                    </label>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='font-bold text-lg text-lightgreen'>4.</div>
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='font-bold text-lg text-lightgreen'>Payment Details</div>
                    <FormInput placeholder='Account number' name='account_number' value={form.account_number} onChange={formHandler} className='!rounded-none' />
                    <FormInput placeholder='Account name' name='account_name' value={form.account_name} onChange={formHandler} className='!rounded-none' />
                    <FormInput placeholder='Bank name' name='bank_name' value={form.bank_name} onChange={formHandler} className='!rounded-none' />
                    <div onClick={PrefillBank} className="w-fit mt-2 px-5 py-2 rounded-md cursor-pointer bg-ash text-white">Use linked account</div>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='font-bold text-lg text-lightgreen'>5.</div>
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='font-bold text-lg text-lightgreen'>Video Link / URL</div>
                    <FormInput placeholder='Insert URL to the tool or eBook Demo' name='video_link' value={form.video_link} onChange={formHandler} className='!rounded-none' />
                  </div>
                </div>
                <div className='flex gap-2'>
                  <div className='font-bold text-lg text-lightgreen'>6.</div>
                  <div className='flex flex-col gap-2 w-full'>
                    <div className='font-bold text-lg text-lightgreen'>Contact Details</div>
                    <FormInput placeholder='WhatsApp or phone number' name='contact_detail' value={form.contact_detail} onChange={formHandler} className='!rounded-none' />
                  </div>
                </div>
                <div className='w-full'>
                  <div className='flex flex-col gap-4 items-center'>
                    <div className=''>We Accept: AI tools, eBooks, Productive tools, Creative resources and lots
                      More! All submissions are manually reviewed by our staff.</div>
                    <button className='bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-fit h-fit py-3 px-24 rounded-lg outline-none uppercase font-bold' onClick={() => setScreen(2)}>submit</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        }
        {screen === 3 &&
          <div className='flex flex-col gap-7 items-center max-w-md mx-auto mt-20'>
            <SlClock className='text-8xl' />
            <div className='text-center'>Thank you for your submission! Our team is currently reviewing your demo video. Please allow up to 2 days for us to assess it. We’ll reach out to you via WhatsApp or phone with our feedback soon.</div>
            <Link to="/user/products/all">
              <button className='bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-fit h-fit py-3 px-10 rounded-lg outline-none uppercase font-bold'>see all products submitted</button>
            </Link>
          </div>
        }
      </div>
    </ProductsLayout>
  )
}

export default CreateProduct