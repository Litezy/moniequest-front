import React, { useEffect, useState } from 'react'
import { FaRegCopy } from "react-icons/fa";
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useParams } from 'react-router-dom'
import FormInput from '../../utils/FormInput'
import { currencies } from '../../AuthComponents/AuthUtils'
import { defaultOptions, ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import SelectComp from '../../GeneralComponents/SelectComp';
import FormButton from '../../utils/FormButton';
import ModalLayout from '../../utils/ModalLayout';
import Loader from '../../GeneralComponents/Loader';
import Lottie from 'react-lottie';
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';


const SingleBuyOrder = () => {
    const { id } = useParams()
    const green = 'text-lightgreen'
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({})

    const fetchBuyID = async () => {
        setLoading(true)
        try {
            const res = await AuthGetApi(`${Apis.admin.single_buy}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            const data = res.data
            setData(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBuyID()
    }, [])

    const fetchBuys = async () => {
        try {
            const res = await AuthGetApi(Apis.admin.cryptobuy_orders)
            if (res.status !== 200) return;
        } catch (error) {
            console.log(error)
        }
    }

    const handleCopy = (type, val) => {
        navigator.clipboard.writeText(type)
            .then(() => { SuccessAlert(`${val} copied successfully'`) })
            .catch(() => { console.log(`failed to copy ${val}`) })
    }

    const [forms, setForms] = useState({
        confirmed: '',
        sent_crypto: '',
        msg: ""
    })
    const statuses = ["Yes", "No"]
    const [screen, setScreen] = useState(1)
    const [failed, setFailed] = useState(false)
    const afterLoad = () => {
        setLoading(false)
        setScreen(2)
    }
    const handleChange = (e) => {
        setForms({ ...forms, msg: e.target.value })
    }

    const submitOrder = async (e) => {
        e.preventDefault()
        if (forms.confirmed !== 'Yes' || forms.sent_crypto !== 'Yes') return ErrorAlert('Please confirm that you have received the funds and sent crypto')
        const data = { tag: 'success' }
        setLoading(true)
        try {
            const res = await AuthPostApi(`${Apis.admin.confirm_buy}/${id}`, data)
            if (res.status !== 200) return ErrorAlert(res.msg)
            fetchBuys()
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
            afterLoad()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    const declineOrder = async () => {
        if (!forms.msg) return ErrorAlert(`Please provide failed message to user`)
        const data = { tag: 'failed', message: forms.msg }
        setLoading(true)
        try {
            const res = await AuthPostApi(`${Apis.admin.confirm_buy}/${id}`, data)
            // console.log(res)
            if (res.status !== 200) return ErrorAlert(res.msg)
            fetchBuys()
            setFailed(false)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
            afterLoad()
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminPageLayout>
            {loading &&
                <Loader title={`closing order`} />
            }
            {failed && <ModalLayout setModal={setFailed} clas={`w-11/12 mx-auto lg:w-1/2`}>
                <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="font-semibold text-center">Please provide failed message</div>

                        <FormInput formtype='textarea' value={forms.msg} name={`msg`} onChange={handleChange} />
                        <div className="flex w-full items-center justify-between ">
                            <button onClick={() => { setFailed(false); setForms({ ...forms, msg: "" }) }} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                            <button onClick={declineOrder} className='px-4 py-1.5 rounded-md bg-green-600 text-white'>confirm decline</button>
                        </div>
                    </div>
                </div>
            </ModalLayout>}

            {screen === 1 &&
                <>
                    <div className="w-11/12 mx-auto mt-2">
                        <Link to={`/admin/exchange/buy_orders`} className="w-fit px-4 py-1.5 rounded-md bg-ash">back to orders</Link>
                    </div>
                    <div className="mt-5 md:mt-10  mont">

                        <div className="w-full text-center capitalize font-bold poppins">Review Order Number <span className={`${green}`}>{data?.order_no}</span></div>

                        <form onSubmit={submitOrder} className="bg-primary p-3 rounded-md w-11/12 mx-auto mt-5 md:mt-10 mb-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5   ">
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm">Customer ID:</div>
                                        <div className="w-full">
                                            <FormInput value={data?.crypto_buyer?.id} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount:</div>
                                        <div className="w-full">
                                            <FormInput value={`${currencies[0].symbol}${data?.amount}`} className={`${green}`} />

                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Crypto Currency:</div>
                                        <div className="w-full">
                                            <FormInput value={data?.crypto_currency} className={`${green}`} />

                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Status:</div>
                                        <FormInput value={data?.status} className={`${data?.status === 'unpaid' ? 'text-red-600' : green}`} />
                                    </div>

                                </div>
                                <div className=" flex flex-col gap-3 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm">FullName:</div>
                                        <FormInput value={`${data?.crypto_buyer?.first_name} ${data?.crypto_buyer?.surname}`} className={`${green}`} />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Wallet Address:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <FormInput value={data?.wallet_address} className={`${green}`} />
                                            </div>
                                            <FaRegCopy onClick={() => handleCopy(`88t9389fncjjefj`, 'wallet address')} className={`${green} cursor-pointer`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Crypto Network:</div>
                                        <div className="w-full">
                                            <FormInput value={data?.network} className={`${green}`} />

                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Wallet Expiry:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <FormInput value={data?.wallet_exp} className={`${green}`} />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                            {data?.status === 'paid' &&
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:grid-cols-3 items-center mt-5">
                                        <div className="flex items-start flex-col w-full ">
                                            <div className="lowercase">Confirm Payment to your Bank ?</div>
                                            <div className="">
                                                <SelectComp width={200} value={forms.confirmed}
                                                    options={statuses} style={{ bg: '#212134', color: 'lightgreen', font: '0.8rem' }}
                                                    handleChange={(e) => setForms({ ...forms, confirmed: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-start flex-col w-full  ">
                                            <div className="lowercase">Sent Crypto ?</div>
                                            <div className="">
                                                <SelectComp options={statuses} value={forms.sent_crypto} width={200} style={{ bg: '#212134', color: 'lightgreen', font: '0.8rem' }}
                                                    handleChange={(e) => setForms({ ...forms, sent_crypto: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                        <div className="">
                                            <button type='button' onClick={() => setFailed(true)} className='px-4 py-1.5 rounded-sm bg-red-600 text-sm'>Mark As Failed</button>
                                        </div>
                                    </div>
                                    <div className="w-11/12 mt-5 mx-auto md:w-5/6">
                                        <FormButton title={`Confirm & Close Order`} />
                                    </div>
                                </>
                            }
                        </form>


                    </div></>}
            {screen === 2 && <div className="">
                <div className="w-11/12 mx-auto min-h-[70dvh] flex items-center justify-center">

                    <div className="w-full flex items-center  flex-col">
                        <Lottie options={defaultOptions} height={250} width={300} />
                        <div className="mt-10 flex flex-col items-center ">
                            <div className="capitalize">Thank You for confirming this order.
                            </div>
                            <Link to={`/admin/exchange/buy_orders`} className={`bg-green-500  mt-10 hover:bg-lightgreen text-white hover:text-ash py-2 text-center rounded-md w-full`}>
                                Go back to orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>}
        </AdminPageLayout>

    )
}

export default SingleBuyOrder

