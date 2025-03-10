import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PasswordInputField from '../../utils/PasswordInputField'
import FormInput from '../../utils/FormInput'
import FormButton from '../../utils/FormButton'
import { CookieName, ErrorAlert, MoveToTop, UserRoles } from '../../utils/pageUtils'
import Cookies from 'js-cookie'
import { decodeToken } from 'react-jwt'
import { jwtDecode } from 'jwt-decode'
import logo from '../../assets/images/logo.png'
import { Apis, PostApi } from '../../services/API'
import Loader from '../../GeneralComponents/Loader'
import GoogleSignInButton from '../../GeneralComponents/GoogleSignInButton'

const LoginPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    email: '',
    password: '',
  })

  const formHandler = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const LoginAccount = async (e) => {
    e.preventDefault()
    if (!form.email) return ErrorAlert('Enter email address')
    if (!form.password) return ErrorAlert('Enter password')

    const formbody = {
      email: form.email,
      password: form.password
    }

    setLoading(true)
    try {
      const response = await PostApi(Apis.user.login, formbody)
      if (response.status === 200) {
        await new Promise((resolve) => setTimeout(resolve, 2000))
        Cookies.set(CookieName, response.token)
        const decoded = decodeToken(response.token)
        const findRole = UserRoles.find(item => item.role === decoded.role)
        if (findRole) return navigate(`${findRole.url}`)
      } else {
        ErrorAlert(response.msg)
      }
    } catch (error) {
      ErrorAlert(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }


  // const handleGoogleSignInSuccess = async (tokenResponse) => {
  //   const idToken = tokenResponse.credential;
  //   const decoded = jwtDecode(idToken);

  //   const formbody = {
  //     email: decoded.email,
  //     first_name: decoded.given_name,
  //     surname: decoded.family_name,
  //     image: decoded.picture,
  //   };

  //   setLoading(true);
  //   try {
  //     const res = await PostApi(Apis.user.continue_with_google, formbody);
  //     if (res.status !== 201 && res.status !== 200) return ErrorAlert(res.msg);
  //     const token = res.token;
  //     Cookies.set(CookieName, token);
  //     const decodedToken = decodeToken(token);
  //     const findRole = UserRoles.find(item => item.role === decodedToken.role);
  //     if (findRole) return navigate(`${findRole.url}`);
  //     await new Promise((resolve) => setTimeout(resolve, 2000));
  //   } catch (error) {
  //     console.log(`Failed to sign up with google: ${error.message}`);
  //     ErrorAlert(`Failed to sign up with google: ${error.message}`);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleGoogleSignInFailure = (error) => {
  //   ErrorAlert(`Google Sign-In failed: ${error.error}`);
  // };
   const handleSuccess = async (user) => {
      const formbody = {
        email: user.email,
        first_name: user.first_name,
        surname: user.lastname,
        image: user.image,
      };
      setLoading(true);
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
        setLoading(false);
      }
    };

  const handleFailure = (error) => {
    console.error("Google Sign-in failed:", error);
  };
  
  
  return (
    <div className="w-full bg-dark flex items-center justify-center overflow-y-auto relative h-screen">
      {loading && <Loader title={`logging in`} />}
      <div className='w-11/12 mx-auto py-5'>
        <div className='flex items-center justify-center max-w-md mx-auto rounded-md  relative'>
          <div className='w-full h-full flex flex-col text-white'>
            <div className="flex items-center justify-center w-full">
              <img src={logo} className='w-52' alt="logo alt" />
            </div>
            <div className='text-3xl font-bold text-center text-white'>Welcome back!</div>
            <div className='text-sm mt-2 text-center text-zinc-300'>New to MonieQuest? <Link to='/signup' onClick={MoveToTop} className='text-lightgreen cursor-pointer'>Create account</Link></div>
            <form className='flex flex-col gap-5 mt-3' onSubmit={LoginAccount}>
              <FormInput label='Email Address' placeholder='example@gmail.com' name='email' value={form.email} onChange={formHandler} type='email' />
              <PasswordInputField label='Password' placeholder='*********' name='password' value={form.password} onChange={formHandler} />
              <Link to='/forgot-password' onClick={MoveToTop} className='text-lightgreen text-sm cursor-pointer ml-auto'>Forgot password?</Link>
              <FormButton title='Sign in' className={`!py-3`} />
            </form>
            <div className="text-center text-sm text-white my-1 ">OR</div>
            <div className="mt-1 w-full flex  items-center justify-center">
              <GoogleSignInButton text={`Sign in with Google`}
                onSuccess={handleSuccess}
                onFailure={handleFailure}
              />
            </div>
            <Link className='text-sm text-center mt-2 text-lightgreen underline' to={'/'}>Go Back Home</Link>

          </div>

        </div>
      </div>
    </div>
  )
}

export default LoginPage