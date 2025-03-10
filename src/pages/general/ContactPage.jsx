import React, { useState } from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import contactImg from '../../assets/images/contact_photo.jpg'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import { FaStarOfLife } from "react-icons/fa";
import Loading from '../../GeneralComponents/Loading';
import { Apis, PostApi } from '../../services/API';

const ContactPage = () => {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    message: '',
  })
  const formHandler = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const SubmitForm = async (e) => {
    e.preventDefault()

    if (!form.email || !form.message) return ErrorAlert('Enter required fields')
    const formbody = {
      full_name: form.full_name,
      email: form.email,
      message: form.message
    }

    setLoading(true)
    try {
      const response = await PostApi(Apis.user.contact, formbody)
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        SuccessAlert(response.msg)
        setForm({
          full_name: '',
          email: '',
          message: ''
        })
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
    <PageLayout>
      <div className='bg-dark text-gray-200'>
        <div className='w-11/12 mx-auto py-16'>
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-10'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col gap-8'>
                <div className='text-4xl font-bold'>Get in touch</div>
                <div className='font-medium'>We're here for you every step of the way. Whether you have questions, need help, or want to share feedback, our friendly customer support team is ready to assist. Reach out to us via</div>
              </div>
              <img src={contactImg} alt='contact image' className='w-auto h-auto'></img>
            </div>
            <div className='w-full h-fit rounded-xl b text-white py-8 md:px-8 px-5 relative bg-gradient-to-br from-primary to-ash'>
              {loading && <Loading className={`!bg-[#0c191bc7]`} />}
              <div className='md:text-4xl text-3xl font-bold text-center mt-4'>Send us a message</div>
              <div className='md:w-3/5 text-center mx-auto mt-2'>Your email address will not be published. Required fields are marked.</div>
              <form className='flex flex-col gap-6 mt-8' onSubmit={SubmitForm}>
                <div className='flex flex-col gap-2'>
                  <div className='capitalize'>full name</div>
                  <input className='outline-none bg-white w-full h-fit p-4 text-base rounded-lg text-black' name='full_name' value={form.full_name} placeholder='full name' onChange={formHandler} ></input>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                    <div className='capitalize'>email address</div>
                    <FaStarOfLife />
                  </div>
                  <input className='outline-none bg-white w-full h-fit p-4 text-base rounded-lg text-black' name='email' value={form.email} placeholder='email address' onChange={formHandler} type='email' ></input>
                </div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <div className='capitalize'>message</div>
                    <FaStarOfLife />
                  </div>
                  <textarea className='outline-none bg-white w-full h-40 p-4 text-base rounded-lg text-black resize-none' name='message' value={form.message} placeholder='message' onChange={formHandler}></textarea>
                </div>
                <button className='bg-white text-black w-full h-fit py-3 text-lg rounded-lg font-semibold'>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PageLayout >
  )
}

export default ContactPage