import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInputField from '../../utils/PasswordInputField'
import FormInput from '../../utils/FormInput'
import FormButton from '../../utils/FormButton'
import { CookieName, ErrorAlert, MoveToTop, UserRoles } from '../../utils/pageUtils'
import logo from '../../assets/images/logo.png'
import { Apis, PostApi } from '../../services/API'
import Loader from '../../GeneralComponents/Loader'
import GoogleSignInButton from '../../GeneralComponents/GoogleSignInButton'
import { decodeToken } from 'react-jwt'
import Cookies from 'js-cookie'


const SignUpPage = () => {
  const [check, setCheck] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState({ status: false, val: '' })
  const [form, setForm] = useState({
    first_name: '',
    surname: '',
    email: '',
    phone: '',
    password: '',
    confirm_password: '',
  })

  const formHandler = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handlePhoneNum = (e) => {
    let value = e.target.value
    const formatVal = value.replace(/\D/g, '')
    setForm({ ...form, phone: formatVal })
  }

  const CreateAccount = async (e) => {
    e.preventDefault()

    if (!form.first_name || !form.surname || !form.email || !form.phone || !form.password) return ErrorAlert('Enter all fields')
    if (!form.confirm_password) return ErrorAlert('Confirm passsword')
    if (form.password !== form.confirm_password) return ErrorAlert('Password(s) mismatch')
    if (!check) return ErrorAlert('Must agree with terms and privacy policy')

    const formbody = {
      first_name: form.first_name,
      surname: form.surname,
      email: form.email,
      phone_number: form.phone,
      password: form.password,
      confirm_password: form.confirm_password
    }

    setLoading({ status: true, val: 'signing up' })
    try {
      const response = await PostApi(Apis.user.signup, formbody)
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        navigate(`/verify-account?v=${form.email}`)
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading({ status: false, val: '' })
    }
  }



  const handleSuccess = async (user) => {
    const formbody = {
      email: user.email,
      first_name: user.first_name,
      surname: user.lastname,
      image: user.image,
    };
    setLoading({ status: true, val: 'please wait' })
    try {
      const res = await PostApi(Apis.user.continue_with_google, formbody);
      if (res.status !== 201 && res.status !== 200) return ErrorAlert(res.msg);
      const token = res.token;
      Cookies.set(CookieName, token);
      const decodedToken = decodeToken(token);
      const findRole = UserRoles.find(item => item.role === decodedToken.role);
      if (findRole) return navigate(`${findRole.url}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      console.log(`Failed to sign up with google: ${error.message}`);
      ErrorAlert(`Failed to sign up with google: ${error.message}`);
    } finally {
      setLoading({ status: false, val: '' })
    }
  };

  const handleFailure = (error) => {
    console.error("Google Sign-in failed:", error);
  };

  return (
    <div className="w-full bg-dark h-screen overflow-y-auto py-10">
      {loading.status && <Loader title={loading.val} />}
      <div className='w-11/12 mx-auto'>
        <div className='flex items-center justify-center max-w-xl mx-auto relative'>
          <div className='w-full h-full flex flex-col text-zinc-300'>
            <div className="flex items-center justify-center w-full">
              <img src={logo} className='w-52' alt="logo alt" />
            </div>
            <div className='text-3xl font-bold text-center'>Create an account</div>
            <div className='text-sm mt-2 text-center'>Already have an account? <Link to='/login' onClick={MoveToTop} className='text-lightgreen cursor-pointer'>Sign in</Link></div>
            <form className='flex flex-col gap-5 mt-8' onSubmit={CreateAccount}>
              <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <FormInput label='First name' placeholder='Your first name' name='first_name' value={form.first_name} onChange={formHandler} />
                <FormInput label='Surname' placeholder='Your surname' name='surname' value={form.surname} onChange={formHandler} />
              </div>
              <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <FormInput label='Email address' placeholder='example@gmail.com' name='email' value={form.email} onChange={formHandler} type='email' />
                <FormInput label='Phone number' placeholder='Phone number' name='phone' value={form.phone} onChange={handlePhoneNum} />
              </div>
              <div className='grid md:grid-cols-2 grid-cols-1 gap-5'>
                <PasswordInputField label='Password' placeholder='Password' name='password' value={form.password} onChange={formHandler} />
                <PasswordInputField label='Confirm password' placeholder='Confirm password' name='confirm_password' value={form.confirm_password} onChange={formHandler} />
              </div>
              <div className='flex flex-col gap-5 items-center'>
                <div className='flex gap-2 text-sm'>
                  <input type='checkbox' value={check} checked={check} onChange={event => { setCheck(event.target.checked) }} className='outline-none'></input>
                  <span>I agree to MonieQuest <Link to='/terms_of_service' onClick={MoveToTop} className='text-lightgreen'>Terms and Conditions</Link> and <Link to='/privacy_policy' onClick={MoveToTop} className='text-lightgreen'>Privacy Policy</Link></span>
                </div>
                <FormButton title='Sign up' className='!py-3' />
                <div className="text-center text-sm text-white">OR</div>
                <div className=" w-full flex items-center justify-center">
                  <GoogleSignInButton text='Continue with Google'
                    onSuccess={handleSuccess}
                    onFailure={handleFailure}
                  />
                </div>
                <Link className='text-sm text-lightgreen underline' to={'/'}>Go Back Home</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage