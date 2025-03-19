import React, { useCallback, useEffect, useState } from 'react'
import AuthPageLayout from '../../AuthComponents/AuthPageLayout'
import { Link, useNavigate, useParams } from 'react-router-dom'
import ModalLayout from '../../utils/ModalLayout'
import Loader from '../../GeneralComponents/Loader'
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import FormButton from '../../utils/FormButton'
import FormInput from '../../utils/FormInput'
import { FaCopy } from 'react-icons/fa'
import { BankAcc, currencies } from '../../AuthComponents/AuthUtils'
import { TfiTimer } from 'react-icons/tfi'

const OrderPage = () => {
    const [loading, setLoading] = useState(false)
    const [load, setLoad] = useState(false)
    const [data, setData] = useState({})
    const { id, tag } = useParams()
    const [screen, setScreen] = useState(1)

    const fetchSingleHistory = useCallback(async () => {
        setLoading(true)
        try {
            const res = await AuthGetApi(`${Apis.transaction.single_history}/${id}/${tag}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            setData(res.data[0])
            // console.log(res)
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }, [id, tag])

    const fetchOrders = useCallback(async () => {
        const res = await AuthGetApi(Apis.transaction.crypto_order_history)
        if (res.status !== 200) {
            console.log(res.msg)
            return;
        }
    }, [])

    useEffect(() => {
        fetchSingleHistory()
    }, [])

    const naviagate = useNavigate()
    const [confirm, setConfirm] = useState(false)
    const [cancel, setCancel] = useState(false)
    const [naira, setNaira] = useState('')
    const [amountToPay, setAmountToPay] = useState('')
    const [amountToReceive, setAmountToReceive] = useState('')
    useEffect(() => {
        if (data?.amount) {
            let newAmount;
            if (tag === 'buy') {
                newAmount = data.amount + data.gas_fee
                setAmountToPay(newAmount)
            } else {
                newAmount = data.amount - data.gas_fee
                setAmountToReceive(newAmount)
            }
            const naira = newAmount * data.rate
            setNaira(naira.toLocaleString())
        }
    }, [data?.amount])

    const navigate = useNavigate()
    const copyToClip = () => {
        navigator.clipboard.writeText(BankAcc.accountNumber).then(() => {
            SuccessAlert(`account number copied successfully`)
        }).catch((error) => console.log(`failed to copy acount number, ${error}`))
    }
    const green = `text-lightgreen`


    const confirmAndPay = async () => {
        setConfirm(false)
        setLoad(true)
        const data = { id }
        try {
            const res = await AuthPostApi(Apis.transaction.complete_payment, data)
            if (res.status !== 200) {
                setLoad(false)
                ErrorAlert(res.msg)
            }
            fetchOrders()
            await new Promise((resolve) => setTimeout(resolve, 2000));
            SuccessAlert(res.msg)
            naviagate(`/user/exchange/orders`)
        } catch (error) {
            console.log(error)
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const cancelOrder = async () => {
        setCancel(false)
        setLoad(true)
        const data = { id }
        try {
            const res = await AuthPostApi(Apis.transaction.cancel_order, data)
            if (res.status !== 200) {
                setLoad(false)
                ErrorAlert(res.msg)
            }
            fetchOrders()
            await new Promise((resolve) => setTimeout(resolve, 3000));
            SuccessAlert(res.msg)
            naviagate(`/user/exchange/orders`)
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoad(false)
        }
    }
    return (
        <AuthPageLayout>
            <div className="w-11/12 mx-auto">
                <Link to={`/user/exchange/orders`} className='w-fit px-4 py-1.5 rounded-md bg-primary'>back to orders </Link>
            </div>
            {load &&
                <Loader title={`processing`} />
            }
            <div className="mt-5">
                {loading &&
                    new Array(3).fill(0).map((_, i) => {
                        return (
                            <div key={i} className="w-11/12 mx-auto animate-pulse flex items-center gap-4 mt-10">
                                <div className="w-16 h-16 ">
                                    <div className="w-full h-full bg-gray-500 rounded-full"></div>
                                </div>
                                <div className="w-[90%]">
                                    <div className="w-full h-14 rounded-xl bg-gray-500"></div>
                                </div>
                            </div>
                        )
                    })
                }
                <div className="w-full text-center capitalize font-bold poppins">Order Number  <span className={`${green}`}> {data.order_no}</span></div>

                {!loading && screen === 1 && tag === 'buy' &&

                    <div className="">
                        {cancel &&
                            <ModalLayout setModal={setCancel} clas={`w-11/12 mx-auto md:w-1/2`}>
                                <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="font-semibold text-center">Are you sure you want to cancel this order?</div>
                                        <div className="flex w-full items-center justify-between ">
                                            <button onClick={() => setCancel(false)} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                                            <button onClick={cancelOrder} className='px-4 py-1.5 rounded-md bg-green-600 text-white'>confirm cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </ModalLayout>

                        }
                        <div className="bg-primary p-10 rounded-md w-11/12 mx-auto mt-5 md:mt-10 mb-5">
                            {data?.status !== 'paid' && <div className="w-full ml-auto text-end ">
                                <button onClick={() => setCancel(true)} className='w-fit px-4 py-1.5 rounded-md bg-red-600 '>cancel order</button>
                            </div>}
                            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5   ">
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col gap-2 items-start">
                                        <div className="text-sm">Crypto Currency:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={data.crypto_currency} className={`${green} capitalize`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount Bought:</div>
                                        <div className="w-full">
                                            <FormInput value={`${currencies[0].symbol}${data?.amount?.toLocaleString()}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Gas Fee:</div>
                                        <div className="w-full">
                                            <FormInput value={`${currencies[0].symbol}${data?.gas_fee}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount to pay in USD:</div>
                                        <div className="w-full">
                                            <FormInput value={`${currencies[0].symbol}${amountToPay}`} className={`${green}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className=" flex flex-col gap-3 w-full">
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount to pay in NGN:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={`${currencies[1].symbol}${naira}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Network provided:</div>
                                        <FormInput read={true} value={data?.network} className={`${green}`} />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Wallet Address Provided:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <FormInput read={true} value={data?.wallet_address} className={`${green}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Status:</div>
                                        <FormInput read={true} value={data?.status} className={`${data?.status === 'paid' ? green : 'text-yellow-300'}`} />
                                    </div>
                                </div>
                            </div>

                            {data?.status === 'unpaid' ? <div className="w-11/12 mt-5 mx-auto md:w-5/6">
                                <FormButton type='button' onClick={() => setScreen(2)} title={`Proceed to make payment`} />
                            </div> :

                                <>
                                    <div className="mt-5 w-full text-center text-base">Payment made, awaiting crypto release</div>
                                    <div className="mt-5 w-full flex items-center justify-center">
                                        <Link to={`/user/dashboard`} className=' w-1/2 py-2 rounded-md bg-lightgreen text-dark mx-auto text-center text-base bg-'>Go to dashboard</Link>
                                    </div>
                                </>

                            }
                        </div>
                    </div>
                }
                {!loading && screen === 1 && tag === 'sell' &&

                    <div className="">

                        <div className="bg-primary p-10 rounded-md w-11/12 mx-auto mt-5 md:mt-10 mb-5">

                            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5   ">
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col gap-2 items-start">
                                        <div className="text-sm">Crypto Currency:</div>
                                        <div className="w-full">
                                            <FormInput value={data.crypto_currency} className={`${green} capitalize`} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 w-full">
                                        <div className="text-sm">Amount Sold:</div>
                                        <FormInput read={true} value={`${currencies[0].symbol}${data?.amount?.toLocaleString()}`} className={`${green}`} />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Gas Fee:</div>
                                        <div className="w-full">
                                            <FormInput value={`${currencies[0].symbol}${data?.gas_fee}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount to receive in USD:</div>
                                        <div className="w-full">
                                            <FormInput value={`${currencies[0].symbol}${amountToReceive}`} className={`${green}`} />
                                        </div>
                                    </div>
                                </div>
                                <div className=" flex flex-col gap-3 w-full">
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount to receive in NGN:</div>
                                        <FormInput value={`${currencies[1].symbol}${naira}`} className={`${green}`} />
                                    </div>

                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Transaction ID/Hash:</div>
                                        <FormInput value={data?.trans_hash} className={`${green} text-sm`} />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Status:</div>
                                        <FormInput value={data?.status} className={`${data?.status === 'paid' ? green : 'text-yellow-300'}`} />
                                    </div>

                                </div>


                            </div>

                            {data?.status === 'unpaid' ? <div className="w-11/12 mt-5 mx-auto md:w-5/6">
                                <FormButton type='button' onClick={() => setScreen(2)} title={`Proceed to make payment`} />
                            </div> :

                                <>
                                    <div className="mt-5 w-full text-center text-base">Crypto asset sent, awaiting funds release</div>
                                    <div className="mt-5 w-full flex items-center justify-center">
                                        <Link to={`/user/dashboard`} className=' w-1/2 py-2 rounded-md bg-lightgreen text-dark mx-auto text-center text-base bg-'>Go to dashboard</Link>
                                    </div>
                                </>

                            }
                        </div>
                    </div>
                }
                {!loading && screen === 2 && tag === 'buy' &&

                    <div className="w-full min-h-[70dvh] flex items-center justify-center">

                        {confirm &&
                            <ModalLayout setModal={setConfirm} clas={`w-11/12 mx-auto md:w-1/2`}>
                                <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                                    <div className="flex flex-col gap-4 w-full">
                                        <div className="font-semibold text-center">Confirm payment made</div>
                                        <div className="flex w-full items-center justify-between ">
                                            <button onClick={() => setConfirm(false)} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                                            <button onClick={confirmAndPay} className='px-4 py-1.5 rounded-md bg-green-600 text-white'>confirm</button>
                                        </div>
                                    </div>
                                </div>
                            </ModalLayout>

                        }
                        <div className="w-full flex items-center gap-5 flex-col">
                            <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center text-lightgreen font-bold text-2xl">
                                    <div className="">{currencies[1].symbol}</div>
                                    <div className="">{naira}</div>
                                </div>
                                <div className="text-sm text-lightgreen">bank transfer</div>
                            </div>

                            <div className="">Kindly pay the above amount to the payment details below</div>
                            <div className="w-11/12 px-5 text-dark py-5 bg-[#fafafa] rounded-md lg:w-2/3 mx-auto flex items-center justify-between flex-col ">
                                <div className="flex items-center justify-between w-full">
                                    <div className="">Bank Name</div>
                                    <div className="">{BankAcc.name}</div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="">Account number</div>
                                    <div className="flex items-center gap-2">
                                        <div className="">{BankAcc.accountNumber}</div>
                                        <FaCopy onClick={copyToClip} className='text-ash text-xs cursor-pointer' />
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full">
                                    <div className="">Account name</div>
                                    <div className="">{BankAcc.accountName}</div>
                                </div>
                            </div>
                            <div className="flex w-11/12 md:w-8/12 items-center gap-5 justify-between">
                                <button onClick={() => setScreen(1)} className="w-1/2 rounded-md hover:bg-ash/80 py-2.5 bg-ash mx-auto text-center">back</button>
                                <button onClick={() => setConfirm(true)} className="w-1/2 hover:bg-lightgreen/90 text-center py-2.5 rounded-md bg-lightgreen text-primary">I have made payment</button>
                            </div>
                        </div>
                    </div>

                }

                {!loading && screen === 3 && tag === 'buy' &&
                    <div className="">
                        <div className="w-11/12 mx-auto min-h-[80dvh] flex items-center justify-center">

                            <div className="w-full flex items-center  flex-col">
                                <div className="rounded-full h-20 w-20 flex items-center justify-center border border-lightgreen">
                                    <TfiTimer className='text-2xl text-lightgreen' />
                                </div>
                                <div className="mt-10 flex flex-col items-center gap-2">
                                    <div className="">Your transaction is being processed, keep an eye on your dashboard.
                                    </div>
                                    <button onClick={() => navigate('/user/exchange/orders')} className={`bg-green-500  mt-10 hover:bg-lightgreen text-white hover:text-ash py-2 text-center rounded-md w-full`}>
                                        Go back to Orders
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </AuthPageLayout>
    )
}

export default OrderPage