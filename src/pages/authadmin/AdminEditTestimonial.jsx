import React, { useEffect, useRef, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useParams } from 'react-router-dom'
import { Apis, AuthGetApi, AuthPutApi, imageurl } from '../../services/API'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import FormInput from '../../utils/FormInput'
import { BiSolidEditAlt } from 'react-icons/bi'
import FormButton from '../../utils/FormButton'
import Loader from '../../GeneralComponents/Loader'

const AdminEditTestimonial = () => {
    const { id } = useParams()
    const [loading, setLoading] = useState({ status: false, val: '' })
    const [data, setData] = useState({})
    const imgref = useRef(null)
    const [forms, setForms] = useState({
        firstname: '',
        lastname: '',
        title: '',
        content: '',
    })

    const [image, setImage] = useState({
        img: null,
        image: null
    })

    const fetchSingleTestimonial = async () => {
        setLoading({ status: true, val: 'load' })
        try {
            const res = await AuthGetApi(`${Apis.admin.single_testimonial}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            const data = res.data
            setData(data)
            return res.data
        } catch (error) {
            console.log()
        } finally { setLoading({ status: false, val: '' }) }
    }

   
    useEffect(() => {
        fetchSingleTestimonial()
    }, [])

    useEffect(() => {
        if (Object.keys(data)) {
            setForms({
                ...forms,
                firstname: data?.firstname || '',
                lastname: data?.lastname || '',
                title: data?.title || '',
                content: data?.content || '',
            })
            setImage({ ...image, img: data?.image })
        }
    }, [data])

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

    const submitEdit = async (e) => {
        e.preventDefault()
        const isFormFilled = Object.values(forms).filter(([key]) => key !== 'lastname').every(([_, val]) => val !== '');
        if (!isFormFilled) return ErrorAlert(`Please fill out all fields`)
        const formdata = new FormData()
        formdata.append('firstname', forms.firstname)
        if (forms.lastname !== '') {
            formdata.append('lastname', forms.lastname);
        } else {
            formdata.append('lastname', ''); // This explicitly sets it to an empty string in the backend
        }
        formdata.append('title', forms.title)
        formdata.append('content', forms.content)
        formdata.append('image', image.image)
        setLoading({ status: true, val: 'update' })
        try {
            const res = await AuthPutApi(`${Apis.admin.update_testimonial}/${id}`, formdata)
            if (res.status !== 200) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
        } catch (error) {
            console.log(`Error updating details`, error)
        } finally { setLoading({ status: false, val: '' }) }

    }
    return (
        <AdminPageLayout>
            {loading.status && loading.val === 'load' &&
                <Loader title={`loading`} />
            }
            {loading.status && loading.val === 'update' &&
                <Loader title={`saving changes`} />
            }
            {!loading.status && loading.val === '' && <div className="w-11/12 mx-auto">
                <Link className='px-3 py-1.5 rounded-md bg-ash text-white'
                    to={`/admin/utilities/testimonials`}>back to testimonials</Link>

                <form onSubmit={submitEdit} className='w-full border border-primary rounded-md p-5 mt-10'>
                    <div className="flex  flex-col lg:flex-row gap-2 w-full justify-between">
                        <div className='relative w-fit self-center lg:self-start'>
                            <img src={image.img}
                                className='h-44 w-44 object-cover border-8 border-[#141523] bg-primary rounded-full'></img>
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
                        <FormInput label={`Last Name`} name={`lastname`} value={forms.lastname} onChange={handleChange} />
                        <FormInput label={`Title/Field`} name={`title`} value={forms.title} onChange={handleChange} />

                    </div>
                    <div className="mt-5 w-11/12 mx-auto relative">
                        <FormInput label={`Content`} formtype='textarea' onChange={handleChange} name={`content`} value={forms.content} />
                    </div>
                    <div className="mt-5 w-full lg:w-1/2 mx-auto">
                        <FormButton title={`Save Changes`} />
                    </div>
                </form>
            </div>}
        </AdminPageLayout>
    )
}

export default AdminEditTestimonial