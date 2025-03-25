import React, { useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useParams } from 'react-router-dom'
import FormInput from '../../utils/FormInput'
import { FaRegCopy } from 'react-icons/fa'
import { defaultOptions, ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import FormButton from '../../utils/FormButton'
import SelectComp from '../../GeneralComponents/SelectComp'
import Lottie from 'react-lottie'
import Loader from '../../GeneralComponents/Loader'
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API'
import { currencies } from '../../AuthComponents/AuthUtils'
import ModalLayout from '../../utils/ModalLayout'

const AdminSingleWithdrawal = () => {
    const { id } = useParams()
    const [forms, setForms] = useState({ sent_money: '', ref: '', msg: '' })
    const [screen, setScreen] = useState(1)
    const [loading, setLoading] = useState({ status: false, val: "" })
    const [failed, setFailed] = useState(false)
    const [data, setData] = useState({})
    const green = `text-lightgreen`

    const fetchWithdrawal = async () => {
        setLoading({ status: true, val: "load" })
        try {
            const res = await AuthGetApi(`${Apis.admin.get_single_withdrawal}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg);
            const data = res.data
            setData(data)
        } catch (error) {
            console.log(error)
        } finally { setLoading({ status: false, val: "" }) }
    }

    useEffect(() => {
        fetchWithdrawal()
    }, [])

    const handleChange = (e) => { setForms({ ...forms, [e.target.name]: e.target.value }) }
    const options = [`Yes`, 'No']

    const submitOrder = async (e) => {
        e.preventDefault()
        if (forms.sent_money === 'No' || !forms.sent_money) return ErrorAlert(`Please confirm money have been paid`)
        if (!forms.ref || forms.ref.length < 10) return ErrorAlert(`Please input a valid transaction number`)
        const data = { tag: 'success', reference_id: forms.ref }
        setLoading({ status: true, val: 'close' })
        try {
            const res = await AuthPostApi(`${Apis.admin.confirm_withdrawal}/${id}`, data)
            if (res.status !== 200) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
            setForms({ ref: '', sent_money: '' })
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
        setLoading({ status: true, val: 'close' })
        try {
            const res = await AuthPostApi(`${Apis.admin.confirm_withdrawal}/${id}`, data)
            if (res.status !== 200) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
            setScreen(2)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, val: '' })
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(data?.account_number)
            .then(() => { return SuccessAlert(`Bank account copied successfully`) })
            .catch((error) => { console.log(`failed to copy account number`, error) })
    }

    const prefillRef = async () => {
        try {
            const clipboardText = await navigator.clipboard.readText(); 
            setForms((prevForms) => ({
                ...prevForms,
                ref: clipboardText, 
            }));
            SuccessAlert('Reference number pasted successfully');
        } catch (error) {
            console.error('Failed to read from clipboard:', error);
            ErrorAlert('Failed to paste reference number');
        }
    };

    return (
        <AdminPageLayout>

            {loading.status && loading.val === 'load' && <Loader title={`...loading`} />}
            {loading.status && loading.val === 'close' && <Loader title={`closing order`} />}

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

            {screen === 1 && <div className="w-11/12 mx-auto">
                <div className=" mt-2">
                    <Link to={`/admin/bank_withdrawals  `} className="w-fit px-4 py-1.5 rounded-md bg-ash">back</Link>
                </div>
                <div className="mt-5 w-full text-center capitalize font-bold poppins">Withdrawal Review Number <span className={`${green}`}>{data?.trans_id}</span></div>
                <form onSubmit={submitOrder} className="bg-primary p-5 rounded-md  mx-auto mt-5 md:mt-10 mb-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5   ">
                        <div className="flex flex-col gap-3 w-full">
                            <div className="w-full flex flex-col gap-2">
                                <div className="text-sm">Customer ID:</div>
                                <FormInput read={true} value={data?.user_withdrawal?.id} className={`${green}`} />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="text-sm">FullName:</div>
                                <FormInput read={true} value={` ${data.user_withdrawal?.first_name} ${data?.user_withdrawal?.surname}`} className={`${green}`} />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="text-sm">Amount:</div>
                                <FormInput read={true} value={`${currencies[1].symbol}${data?.amount?.toLocaleString()}`} className={`${green}`} />
                            </div>
                            {forms.sent_money === 'Yes' &&
                                <div className="flex flex-col gap-2">
                                    <div className="text-sm">Transaction Number:</div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-full">
                                            <FormInput value={forms.ref} name={`ref`} onChange={handleChange} className={`${green}`} />
                                        </div>
                                        <p onClick={prefillRef} className={`${green} cursor-pointer`}>paste</p>
                                    </div>
                                </div>
                            }
                        </div>
                        <div className=" flex flex-col gap-3 w-full">
                            <div className="w-full flex flex-col gap-2">
                                <div className="text-sm">Beneficiary Name:</div>
                                <FormInput read={true} value={data?.bank_user} className={`${green}`} />
                            </div>
                            <div className="w-full flex flex-col gap-2">
                                <div className="text-sm">Beneficiary Bank:</div>
                                <FormInput read={true} value={data?.bank_name} className={`${green}`} />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="text-sm">Bank Account:</div>
                                <div className="flex items-center gap-2">
                                    <div className="w-full">
                                        <FormInput read={true} value={data?.account_number} className={`${green}`} />
                                    </div>
                                    <FaRegCopy onClick={handleCopy} className={`${green} cursor-pointer`} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 mt-5 items-center">
                        <div className="flex items-start flex-col w-full ">
                            <div className=" lowercase">Confirm You have paid</div>
                            <div className="">
                                <SelectComp options={options} value={forms.sent_money} width={200} style={{ bg: '#212134', color: 'lightgreen', font: '0.8rem' }}
                                    handleChange={(e) => setForms({ ...forms, sent_money: e.target.value })}
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
                </form>
            </div>}

            {screen === 2 && <div className="">
                <div className="w-11/12 mx-auto min-h-[70dvh] flex items-center justify-center">
                    <div className="w-full flex items-center  flex-col">
                        <Lottie options={defaultOptions} height={250} width={300} />
                        <div className="mt-10 flex flex-col items-center ">
                            <div className="capitalize">Thank You for confirming this order.
                            </div>
                            <Link to={`/admin/bank_withdrawals`} className={`bg-green-500  mt-10 hover:bg-lightgreen text-white hover:text-ash py-2 text-center rounded-md w-full`}>
                                Go back to orders
                            </Link>
                        </div>
                    </div>
                </div>
            </div>}
        </AdminPageLayout>
    )
}

export default AdminSingleWithdrawal