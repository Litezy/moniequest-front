import React, { useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import Loader from '../../GeneralComponents/Loader'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import FormInput from '../../utils/FormInput'
import FormButton from '../../utils/FormButton'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import { Apis, AuthPostApi } from '../../services/API'
import { useAtom } from 'jotai'
import { USERDETAILS } from '../../services/store'
import PasswordInputField from '../../utils/PasswordInputField'

const AdminCreateUsers = () => {
    const [forms, setForms] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: '',
        confirm_password: '',
    });
    const [, setUserDetails] = useAtom(USERDETAILS)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    const handlePhoneNum = (e) => {
        let value = e.target.value
        const formatVal = value.replace(/\D/g, '')
        setForms({ ...forms, phone: formatVal })
    }

    const createUser = async (e) => {
        e.preventDefault()
        if (!forms.firstname) return ErrorAlert('First name required')
        if (!forms.lastname) return ErrorAlert('lastname name required')
        if (!forms.email) return ErrorAlert('email is required')
        if (!forms.phone) return ErrorAlert('phone number required')
        if (!forms.password) return ErrorAlert('password required')
        if (forms.password.length < 6) return ErrorAlert(`Password must be at least 6 characters long`)
        if (!forms.confirm_password) return ErrorAlert('password(s) mismatch')

        const formdata = {
            first_name: forms.firstname,
            surname: forms.lastname,
            email: forms.email,
            phone_number: forms.email,
            password: forms.password,
            confirm_password: forms.confirm_password
        }
        setLoading(true)
        try {
            const res = await AuthPostApi(Apis.admin.create_user, formdata)
            if (res.status !== 201) return ErrorAlert(res.msg)
            setForms({ firstname: "", lastname: '', password: '', phone: '', confirm_password: "", email: "" })
            setUserDetails(res.data)
            SuccessAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            navigate(`/admin/all_users/user_details`)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminPageLayout>
            <div className='mx-auto w-11/12'>
                <div className='w-full '>
                    {loading &&
                        <Loader title={`creating`} />
                    }
                    <div className="w-full flex items-center  justify-between">
                        <Link to={`/admin/all_users`} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                            <IoReturnUpBackOutline className='text-2xl' />
                        </Link>
                        <div className="text-lg font-semibold">Create Users</div>
                    </div>
                    <div className="my-5 text-center poppins font-semibold">Create new user by entering the following details</div>
                    <form onSubmit={createUser} className='shadow-xl w-full p-2 rounded-lg relative'>
                        <div className="grid md:grid-cols-2 grid-cols-1 md:flex-row md:gap-10 gap-4">
                            <div className="flex flex-col items-start w-full gap-4">
                                <div className="w-full">
                                    <FormInput label='First Name' name={`firstname`} value={forms.firstname} onChange={handleChange} />
                                </div>
                                <div className="w-full">
                                    <FormInput label='Last Name' name={`lastname`} value={forms.lastname} onChange={handleChange} />
                                </div>
                                <div className="w-full">
                                    <FormInput label='Phone No' type='phone' name={`phone`} value={forms.phone} onChange={handlePhoneNum} />
                                </div>
                            </div>
                            <div className="flex flex-col items-start w-full gap-4">
                                <div className="w-full">
                                    <FormInput label='Email Address:' type='email' name={`email`} value={forms.email} onChange={handleChange} />
                                </div>
                                <div className="w-full">
                                    <PasswordInputField label='Password' type='password' name={`password`} value={forms.password} onChange={handleChange} />
                                </div>
                                <div className="w-full relative">
                                    <PasswordInputField label='Confirm Password' type='password' name={`confirm_password`} value={forms.confirm_password} onChange={handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="w-3/4 mx-auto mt-10">
                            <FormButton title={`Create User`} bg={`text-white bg-primary h-12 rounded-md`} />
                        </div>
                    </form>
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminCreateUsers