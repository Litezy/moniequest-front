import React from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import Lottie from 'react-lottie'
import { defaultOptionsFailed } from '../../utils/pageUtils'
import { Link } from 'react-router-dom'

const CheckoutFailure = () => {
  return (
    <PageLayout>
      <div className='h-fit py-10 flex flex-col gap-3 items-center justify-center'>
        <Lottie options={defaultOptionsFailed} height={200} width={200} />
        <div className="lg:w-1/2 text-center p-3 rounded-md bg-secondary w-11/12 w mx-auto text-white italic"> <span className='text-red-500 font-bold'>Payment unsuccessful!</span> Please try again or contact us for assistance. If you were charged but didn't receive a confirmation email, kindly reach out via WhatsApp or reply to the payment email. We're here to help!"</div>
        <Link 
            to={`/products`}
            className='mt-5 bg-white text-dark w-fit px-5 py-1.5 rounded-md'>back</Link>
      </div>
    </PageLayout>
  )
}

export default CheckoutFailure