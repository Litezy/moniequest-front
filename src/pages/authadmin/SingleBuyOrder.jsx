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
    const [loading, setLoading] = useState({ status: '', val: '' })
    const [data, setData] = useState({})
    const [forms, setForms] = useState({
        confirmed: '',
        sent_crypto: '',
        msg: "",
        trans_hash: ''
    })
    const statuses = ["Yes", "No"]
    const [screen, setScreen] = useState(1)
    const [failed, setFailed] = useState(false)
    const [transmsg, setTransMsg] = useState(false)

    const fetchBuyID = async () => {
        setLoading({ status: true, val: 'fetching order' })
        try {
            const res = await AuthGetApi(`${Apis.admin.single_buy}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            const data = res.data
            setData(data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, val: '' })
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

    const handleChange = (e) => {
        setForms({ ...forms, trans_hash: e.target.value })
    }

    const submitOrder = async (e) => {
        e.preventDefault()
        if (forms.confirmed !== 'Yes' || forms.sent_crypto !== 'Yes') return ErrorAlert('Please confirm that you have received the funds and sent crypto')
        if (!forms.trans_hash) return ErrorAlert('Please provide transaction ID')
        const data = { tag: 'success', trans_hash: forms.trans_hash }
        setTransMsg(false)
        setLoading({ status: true, val: 'closing order' })
        try {
            const res = await AuthPostApi(`${Apis.admin.confirm_buy}/${id}`, data)
            if (res.status !== 200) return ErrorAlert(res.msg)
            fetchBuys()
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
            setScreen(2)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, val: '' })
        }

    }

    const declineOrder = async () => {
        if (!forms.msg) return ErrorAlert(`Please provide failed message to user`)
        setFailed(false)
        const data = { tag: 'failed', message: forms.msg }
        setLoading({ status: true, val: 'closing order' })
        try {
            const res = await AuthPostApi(`${Apis.admin.confirm_buy}/${id}`, data)
            if (res.status !== 200) return ErrorAlert(res.msg)
            fetchBuys()
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
            setScreen(2)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, val: '' })
        }
    }

    return (
        <AdminPageLayout>
            {loading.status &&
                <Loader title={loading.val} />
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
            {transmsg && <ModalLayout setModal={setTransMsg} clas={`w-11/12 mx-auto lg:w-1/2`}>
                <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="font-semibold text-center">Please Transaction ID</div>

                        <FormInput value={forms.trans_hash} name={`trans_hash`} onChange={handleChange} />
                        <div className="flex w-full items-center justify-between ">
                            <button onClick={() => { setTransMsg(false); setForms({ ...forms, trans_hash: "" }) }} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                            <button onClick={submitOrder} className='px-4 py-1.5 rounded-md bg-green-600 text-white'>proceed</button>
                        </div>
                    </div>
                </div>
            </ModalLayout>}

            {screen === 1 &&
                <>
                    <div className="w-11/12 mx-auto mt-2">
                        <Link to={`/admin/exchange/buy_orders`} className="w-fit px-4 py-1.5 rounded-md bg-ash">back to orders</Link>
                    </div>
                    <div className="mt-5 mont">

                        <div className="w-full text-center capitalize font-bold poppins">Review Order Number <span className={`${green}`}>{data?.order_no}</span></div>

                        <form onSubmit={submitOrder} className="bg-primary p-3 rounded-md w-11/12 mx-auto mt-5 md:mt-10 mb-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5   ">
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm">Customer ID:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={data?.crypto_buyer?.id} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount Bought:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={`${currencies[0].symbol}${data?.amount?.toLocaleString()}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Gas Fee:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={`${currencies[0].symbol}${data?.gas_fee}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Amount {data?.status == 'unpaid' && 'to be'} paid:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={`${currencies[0].symbol}${parseFloat(data?.amount) + parseFloat(data?.gas_fee)}`} className={`${green}`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Crypto Currency:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={data?.crypto_currency} className={`${green}`} />
                                        </div>
                                    </div>

                                </div>
                                <div className=" flex flex-col gap-3 w-full">
                                    <div className="flex flex-col gap-2">
                                        <div className="text-sm">FullName:</div>
                                        <FormInput read={true} value={`${data?.crypto_buyer?.first_name} ${data?.crypto_buyer?.surname}`} className={`${green}`} />
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Wallet Address:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <FormInput read={true} value={data?.wallet_address} className={`${green}`} />
                                            </div>
                                            <FaRegCopy onClick={() => handleCopy(data?.wallet_address, 'wallet address')} className={`${green} cursor-pointer`} />
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Crypto Network:</div>
                                        <div className="w-full">
                                            <FormInput read={true} value={data?.network} className={`${green}`} />

                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Wallet Expiry:</div>
                                        <div className="flex items-center gap-2">
                                            <div className="w-full">
                                                <FormInput read={true} value={data?.wallet_exp} className={`${green}`} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="text-sm">Status:</div>
                                        <FormInput read={true} value={data?.status} className={`${data?.status === 'unpaid' ? 'text-red-600' : green}`} />
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
                                        {forms.confirmed === 'No' &&
                                            forms.sent_crypto === 'No'
                                            && <div className="">
                                                <button type='button' onClick={() => setFailed(true)} className='px-4 py-1.5 rounded-sm bg-red-600 text-sm'>Mark As Failed</button>
                                            </div>}
                                    </div>
                                    {forms.confirmed === 'Yes' && forms.sent_crypto === 'Yes' && <div className="w-11/12 mt-5 mx-auto md:w-5/6">
                                        <button type='button' onClick={() => setTransMsg(true)} className='w-full py-4 rounded-md bg-ash text-white hover:bg-lightgreen'>Confirm & Close Order</button>
                                    </div>}
                                </>
                            }
                        </form>
                    </div>
                </>
            }
            {screen === 2 &&
                <div className="">
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
                </div>
            }
        </AdminPageLayout>

    )
}

export default SingleBuyOrder

