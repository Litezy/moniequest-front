import React from 'react'
import AuthPageLayout from '../../AuthComponents/AuthPageLayout'
import { defaultOptionsFailed } from '../../utils/pageUtils'
import Lottie from 'react-lottie'
import { Link } from 'react-router-dom'

const AuthCheckoutFailure = () => {
    return (
        <AuthPageLayout>
            <div className='h-fit py-10 flex flex-col gap-3 items-center justify-center'>
                <Lottie options={defaultOptionsFailed} height={200} width={200} />
                <div className="lg:w-1/2 text-center p-3 rounded-md bg-secondary w-11/12 w mx-auto text-white italic"> <span className='text-red-500 font-bold'>Transaction failed!</span>  Your crypto purchase could not be completed. If any amount was deducted, it will be automatically refunded. Please try again or contact support for assistance.!"</div>
                <Link
                    to={`/user/exchange/buy`}
                    className='mt-5 bg-white text-dark w-fit px-5 py-1.5 rounded-md'>back</Link>
            </div>
        </AuthPageLayout>
    )
}

export default AuthCheckoutFailure