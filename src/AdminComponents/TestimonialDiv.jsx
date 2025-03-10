import React, { useState } from 'react'
import { Apis, AuthDeleteApi, imageurl } from '../services/API'
import { FaQuoteLeft, FaQuoteRight } from "react-icons/fa";
import { Link } from 'react-router-dom';
import ModalLayout from '../utils/ModalLayout';
import Loader from '../GeneralComponents/Loader';
import { ErrorAlert, SuccessAlert } from '../utils/pageUtils';

const TestimonialDiv = ({ item, fetchTestimonials }) => {
    const [loading, setLoading] = useState(false)
    const [del, setDel] = useState(false)

    const deleteTestimonial = async (id) => {
        setDel(false)
        setLoading(true)
        try {
            const res = await AuthDeleteApi(`${Apis.admin.delete_testimonial}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            fetchTestimonials()
            SuccessAlert(res.msg)
        } catch (error) {
            console.log(`something went wrong in deleting testimonial`, error)
        } finally { setLoading(false) }
    }

    const optimizeImageUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url; 
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`; 
    };

    return (

        <div className='w-full h-fit border border-primary rounded-md p-2'>
            {loading &&
                <Loader title={`deleting testimonial`} />
            }
            {del &&
                <ModalLayout setModal={setDel} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                    <div className="p-5  bg-white text-dark shadow-xl rounded-md">
                        <div className="text-base text-center mb-3">Are you sure you want to delete testimonial</div>
                        <div className="flex items-center justify-between">
                            <button onClick={() => setDel(false)} className='px-3 text-sm md:text-base py-2 bg-red-500 text-white rounded-md'>Cancel</button>
                            <button onClick={() => deleteTestimonial(item.id)} className='px-3 text-sm md:text-base py-2 bg-green-500 text-white rounded-md'>Confirm Delete</button>
                        </div>

                    </div>
                </ModalLayout>
            }
            <div className="flex items-center gap-2 w-full">
                <img src={optimizeImageUrl(item.image)} alt={`${item.firstname} image`}
                    className='w-20 h-20 rounded-full object-cover object-center' />
                <div className="flex flex-col gap-2">
                    <div className="capitalize">{item.firstname} {item.lastname}</div>
                    <div className="px-2 text-sm md:text-base py-1 rounded-md bg-primary capitalize">{item.title}</div>
                </div>
                <div className="w-fit ml-auto">
                    <Link to={`/admin/utilities/testimonials/${item.id}`} className='px-4 rounded-md py-1 bg-lightgreen/90'>Edit</Link>
                </div>
            </div>
            <div className="mt-5 w-11/12 mx-auto relative">
                <div className="absolute top-0 left-0"><FaQuoteLeft /></div>
                <div className="px-5 mx-auto">{item.content}</div>
                <div className="absolute bottom-0 right-0"><FaQuoteRight /></div>
            </div>
            <div className="my-5 w-fit ml-auto">
                <button onClick={() => setDel(true)} type='button' className='px-4 py-1 rounded-md text-white bg-red-600'>Delete</button>
            </div>
        </div>
    )
}

export default TestimonialDiv