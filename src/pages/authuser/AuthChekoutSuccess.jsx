import React from 'react'
import Lottie from 'react-lottie'
import AuthPageLayout from '../../AuthComponents/AuthPageLayout'
import { defaultOptions } from '../../utils/pageUtils'
import { Link } from 'react-router-dom'

const AuthChekoutSuccess = () => {
   
    
      return (
        <AuthPageLayout>
          <div className='h-fit py-10 flex flex-col gap-3 items-center justify-center'>
            <Lottie options={defaultOptions} height={250} width={300} />
            <div className="lg:w-1/2 text-center p-3 rounded-md bg-secondary w-11/12 w mx-auto text-white italic"> <span className='text-lightgreen font-bold'>Payment successful!</span> Your crypto is being processed. Please allow up to 1 hour for it to arrive in your wallet. Thank you for choosing us!"</div>
            <Link 
            to={`/user/exchange/buy`}
            className='mt-5 bg-white text-dark w-fit px-5 py-1.5 rounded-md'>back</Link>
          </div>
        </AuthPageLayout>
      )
    }
    

export default AuthChekoutSuccess