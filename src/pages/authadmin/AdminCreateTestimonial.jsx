import React, { useRef, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Apis, AuthPostApi, } from '../../services/API'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import FormInput from '../../utils/FormInput'
import { BiSolidEditAlt } from 'react-icons/bi'
import FormButton from '../../utils/FormButton'
import ModalLayout from '../../utils/ModalLayout'
import Loader from '../../GeneralComponents/Loader'
import { FaRegUser } from "react-icons/fa";

const AdminCreateTestimonial = () => {
    const imgref = useRef(null)
    const [forms, setForms] = useState({
        firstname: '',
        lastname: '',
        title: '',
        content: '',
    })
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState({
        img: null,
        image: null
    })

    const handleChange = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value })
    }

    const handleProfileUpload = (event) => {
        const file = event.target.files[0]
        if (file.size >= 1000000) {
            imgref.current.value = null
            return ErrorAlert('Image size too large, file must not exceed 1mb')
        }
        setImage({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const navigate = useNavigate()

    const createTestimonial = async (e) => {
        e.preventDefault()
        const formdata = new FormData()
        formdata.append('firstname', forms.firstname)
        formdata.append('lastname', forms.lastname)
        formdata.append('title', forms.title)
        formdata.append('content', forms.content)
        formdata.append('image', image.image)
        setLoading(true)
        try {
            const res = await AuthPostApi(`${Apis.admin.create_testimonial}`, formdata)
            if (res.status !== 201) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            navigate('/admin/utilities/testimonials')
        } catch (error) {
            console.log(`Error updating details`, error)
        } finally { setLoading(false) }

    }
    return (
        <AdminPageLayout>
            {loading ?
                <ModalLayout>
                    <Loader title={`creating`} />
                </ModalLayout> :

                <div className="w-11/12 mx-auto">
                    <Link className='px-3 py-1.5 rounded-md bg-ash text-white'
                        to={`/admin/utilities/testimonials`}>back to testimonials</Link>

                    <form onSubmit={createTestimonial} className='w-full border border-primary rounded-md p-5 mt-10'>
                        <div className="flex  flex-col lg:flex-row gap-2 w-full  justify-between">
                            <div className='relative w-fit self-center lg:self-start'>
                                {image?.img ? <img src={image.img}
                                    className='h-44 w-44  object-cover border-8 border-[#141523] bg-primary rounded-full'></img> :
                                    <div className="h-44 w-44 flex items-center justify-center border border-zinc-700 rounded-full"><FaRegUser className='text-4xl' /></div>
                                }
                                <label>
                                    <div className='bg-primary rounded-full w-fit h-fit p-2 text-xl absolute bottom-4 right-0 border border-secondary cursor-pointer text-lightgreen'>
                                        <BiSolidEditAlt />
                                    </div>
                                    <input ref={imgref} type="file" onChange={handleProfileUpload} hidden />
                                </label>
                            </div>
                            <div className="flex flex-col gap-2">
                                <FormInput label={`First Name`} name={`firstname`} value={forms.firstname} onChange={handleChange} />

                            </div>
                            <FormInput label={`Last Name`} name={`lastname`} placeholder={`optional`} value={forms.lastname} onChange={handleChange} />
                            <FormInput label={`Title/Field`} name={`title`} value={forms.title} onChange={handleChange} />

                        </div>
                        <div className="mt-5 w-11/12 mx-auto relative">
                            <FormInput formtype='textarea' onChange={handleChange} name={`content`} value={forms.content} />
                        </div>
                        <div className="mt-5 w-full lg:w-1/2 mx-auto">
                            <FormButton title={`Create Testimonial`} />
                        </div>
                    </form>
                </div>}
        </AdminPageLayout>
    )

}

export default AdminCreateTestimonial