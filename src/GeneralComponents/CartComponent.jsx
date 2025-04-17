import React, { useState } from 'react'
import emptybox from '../assets/images/emptybox.png'
import FormInput from '../utils/FormInput'
import { ErrorAlert, SuccessAlert } from '../utils/pageUtils'
import { SlClock } from "react-icons/sl";
import { Apis, GetApi, imageurl, PostApi } from '../services/API';
import Loader from './Loader';

const CartComponent = ({ cartItems, setCartItems, dataLoading }) => {
    const [adminBank, setAdminBank] = useState({})
    const [email, setEmail] = useState('')
    const [screen, setScreen] = useState(1)
    const [loading, setLoading] = useState(false)

    let totalPrice = 0;
    let totalPriceAfterDiscount = 0;
    let totalDiscountAmount = 0;
    if (cartItems.length > 0) {
        cartItems.map((ele) => (
            totalPrice += ele.price,
            totalPriceAfterDiscount += (100 - ele.discount_percentage) / 100 * ele.price
        ))
        totalDiscountAmount = totalPrice - totalPriceAfterDiscount
    }

    const copyFunction = (content) => {
        navigator.clipboard.writeText(content)
        SuccessAlert('Account number copied successfully')
    }

    const RemoveCart = (item) => {
        const localData = JSON.parse(localStorage.getItem('products'))
        const filteredData = localData.filter(ele => ele.id !== item.id)
        localStorage.setItem('products', JSON.stringify(filteredData))
        setCartItems(filteredData)
    }

    const checkOut = async () => {
        if (!email) return ErrorAlert('Enter your email address')
        if (!/\S+@\S+\.\S+/.test(email)) return ErrorAlert('Enter a valid email address')
        setLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setScreen(2)

    }

    const ConfirmPaymentAndPlaceAnOrder = async () => {
        const formbody = {
            email_address: email,
            total_price: parseFloat(totalPrice),
            total_discount: parseFloat(totalDiscountAmount),
            amount_paid: parseFloat(totalPriceAfterDiscount),
            products: cartItems
        }

        setLoading(true)
        try {
            const response = await PostApi(Apis.paystack.purchase_products, formbody)
            if (response.status !== 200) return ErrorAlert(response.msg)
            const data = response?.data?.data
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(response.msg)
            // Redirect to Paystack checkout page
            window.location.href = data?.authorization_url
            localStorage.setItem('products', JSON.stringify([]))
            setCartItems([])
            setScreen(3)
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const EmptyCart = () => {
        setCartItems([])
        localStorage.setItem('products', JSON.stringify([]))
        setScreen(1)
    }

    return (
        <div className='grid lg:grid-cols-3 grid-cols-1 gap-10'>
            {dataLoading ?
                <>
                    <div className='flex flex-col gap-8 lg:col-span-2 col-span-1'>
                        <div className='flex flex-col gap-4'>
                            <div className='w-64 h-2 rounded-full bg-slate-400 animate-pulse'></div>
                            <div className='border-b border-slate-400 w-full'></div>
                        </div>
                        <div className='w-full h-28 rounded-[3px] bg-slate-400 animate-pulse'></div>
                    </div>
                    <div className='col-span-1 w-full h-80 rounded-[3px] bg-slate-400 animate-pulse'></div>
                </>
                :
                <>
                    <div className='lg:col-span-2 col-span-1'>
                        <div className='uppercase font-bold border-b border-zinc-500 pb-2'>{cartItems.length > 0 ? <span>your shopping cart ({cartItems.length} item{cartItems.length > 1 && 's'})</span> : <span>your cart is still empty</span>}</div>
                        {cartItems.length > 0 ?
                            <div className='flex flex-col gap-5 mt-8'>
                                {cartItems.map((item, i) => {
                                    const discountPrice = item?.discount_percentage && item?.price ? (100 - item.discount_percentage) / 100 * item.price : 0
                                    return (
                                        <div className='w-full h-fit bg-primary flex md:p-0 p-3 rounded-[3px] overflow-hidden' key={i}>
                                            <div className='md:w-[25%] w-[40%]'>
                                                <img src={item?.image} alt={item?.image} className='w-full md:h-28 h-[5.5rem] object-cover md:rounded-l-[3px] md:rounded-r-none rounded-[3px]'></img>
                                            </div>
                                            <div className='md:w-[75%] w-[60%] px-4 md:py-3 flex flex-col'>
                                                <div className='flex md:flex-row flex-col md:justify-between gap-1'>
                                                    <div className='capitalize font-bold md:text-base text-sm'>{item?.title}</div>
                                                    <div className='flex items-center md:flex-col flex-row gap-1.5 font-semibold'>
                                                        {item?.discount_percentage ?
                                                            <>
                                                                <div>₦{discountPrice.toLocaleString()}</div>
                                                                <div className='text-xs line-through'>₦{item.price && item.price.toLocaleString()}</div>
                                                            </>
                                                            :
                                                            <div>₦{item.price && item.price.toLocaleString()}</div>
                                                        }
                                                    </div>
                                                </div>
                                                <div className='flex justify-between items-center mt-auto text-xs'>
                                                    <button className='outline-none w-fit h-fit bg-secondary rounded-md py-2 px-4 hover:text-lightgreen' onClick={() => RemoveCart(item)}>Remove</button>
                                                    {item?.discount_percentage && <div className='text-lightgreen md:block hidden'>You are saving {item?.discount_percentage}%</div>}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div className='flex flex-col gap-8 mt-6'>
                                <div className='text-sm'>Add a product here by clicking on the add to cart button.</div>
                                <img alt='empty cart box' src={emptybox} className='md:w-52 w-40 h-auto'></img>
                            </div>
                        }
                    </div>
                    <div className='col-span-1'>
                        {cartItems.length > 0 &&
                            <div className='w-full h-fit bg-primary py-6 px-4 text-sm rounded-[3px] relative'>
                                {loading && <Loader />}
                                {screen === 1 &&
                                    <div className='flex flex-col gap-8'>
                                        <div className='flex flex-col gap-4'>
                                            <div className='flex justify-between'>
                                                <div className='capitalize'>cart subtotal</div>
                                                <div className='font-bold'>₦{totalPriceAfterDiscount.toLocaleString()}</div>
                                            </div>
                                            <div className='text-lightgreen border-b border-zinc-500 pb-4'>You are saving ₦{totalDiscountAmount.toLocaleString()}</div>
                                        </div>
                                        <div className='flex flex-col gap-6'>
                                            <div className='flex justify-between font-bold uppercase'>
                                                <div>Total</div>
                                                <div className='text-xl'>₦{totalPriceAfterDiscount.toLocaleString()}</div>
                                            </div>
                                            <div>
                                                <FormInput placeholder='Enter Email Address' type='email' value={email} onChange={(e) => setEmail(e.target.value)} />
                                            </div>
                                            <button className='bg-lightgreen text-ash uppercase font-extrabold w-full h-fit py-3 rounded-[4px]' onClick={checkOut}>proceed to checkout</button>

                                        </div>
                                    </div>
                                }
                                {screen === 2 &&
                                    <div className='flex flex-col gap-4 items-center'>
                                        <div className='flex flex-col gap-1'>
                                            <div className="flex items-center flex-col gap-1">
                                                <div className="">total amount to pay</div>
                                                <span className='text-3xl font-bold text-lightgreen'>₦{totalPriceAfterDiscount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                        <div className='text-center'>Kindly click the button below to checkout</div>

                                        <button className='bg-lightgreen text-ash font-extrabold w-full h-fit py-3 rounded-[4px]' onClick={ConfirmPaymentAndPlaceAnOrder}>Proceed to make payments</button>
                                    </div>
                                }
                                {screen === 3 &&
                                    <div className='flex flex-col gap-6 items-center'>
                                        <SlClock className='text-8xl' />
                                        <div className='text-center'>Your order is being processed. Keep an eye on your email for delivery updates.
                                        </div>
                                        <button className='bg-lightgreen text-ash font-extrabold w-full h-fit py-3 rounded-[4px] uppercase' onClick={EmptyCart}>empty cart</button>
                                    </div>
                                }
                            </div>
                        }
                    </div>
                </>
            }
        </div>
    )
}

export default CartComponent