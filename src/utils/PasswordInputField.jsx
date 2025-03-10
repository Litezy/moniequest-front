import React, { useState } from 'react'
import { HiOutlineEye } from "react-icons/hi2";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import FormInput from './FormInput';

const PasswordInputField = ({ label, onChange, value, name, placeholder, className }) => {
    const [eye, setEye] = useState(false)
    const EyeIcon = eye ? HiOutlineEye : HiOutlineEyeSlash

    return (
        <div className='relative'>
            <FormInput label={label} className={`${className?.input}`} name={name} value={value} placeholder={placeholder} onChange={onChange} type={`${eye ? 'text' : 'password'}`} />
            <EyeIcon className={`absolute top-11 right-4 cursor-pointer text-light text-xl ${className?.icon}`} onClick={() => setEye(!eye)} />
        </div>
    )
}

export default PasswordInputField