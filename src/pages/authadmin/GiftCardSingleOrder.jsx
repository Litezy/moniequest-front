import React, { useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import FormInput from '../../utils/FormInput'
import FormButton from '../../utils/FormButton'
import { currencies } from '../../AuthComponents/AuthUtils'
import SelectComp from '../../GeneralComponents/SelectComp'
import { defaultOptions, ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import Loader from '../../GeneralComponents/Loader'
import ModalLayout from '../../utils/ModalLayout'
import Lottie from 'react-lottie'
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API'

const GiftCardSingleOrder = () => {
    const [forms, setForms] = useState({
        amount: '', valid: 'select', error: '',
    })
    const { id } = useParams()
    const [screen, setScreen] = useState(1)
    const [confirmBad, setConfirmBad] = useState(false)
    const [confirmMsg, setConfirmMsg] = useState(false)
    const [loading, setLoading] = useState({
        status: false, param: ''
    })
    const [credited, setCredited] = useState(false)
    const [applyAmt, setApplyAmt] = useState(false)
    const [data, setData] = useState({})
    const green = `text-lightgreen`
    const statuses = [`select`, `Yes`, `No`]

    const fetchGiftCardOrder = async () => {
        setLoading({ status: true, param: 'fetch' })
        try {
            const res = await AuthGetApi(`${Apis.admin.get_single_giftcard_order}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            const data = res.data
            setData(data)
            console.log(data)

        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, param: '' })
        }
    }

    useEffect(() => {
        fetchGiftCardOrder()
    }, [])

    const [inNaira, setInNaira] = useState('')
    useEffect(() => {
        if (data?.amount && data?.amount !== '0') {
            const naira = parseFloat(data?.amount) * parseFloat(data?.rate)
            setInNaira(naira.toLocaleString())
        }
    }, [data?.amount])

    const handleChange = () => {
        const amt = inNaira
        const formatVal = amt.replace(/,/g, '')
        setForms({ ...forms, amount: formatVal })
    }

    const applyamount = () => {
        setApplyAmt(true)
        handleChange()
    }

    const creditUser = async (e) => {
        e.preventDefault()
        if (forms.valid !== 'Yes') return ErrorAlert(`Please confirm if Giftcard is valid`)
        if (!forms.amount) return ErrorAlert(`Please apply amount to be credited to user`)
        const formdata = { amount: forms.amount, tag: 'success' }
        setLoading({ status: true, param: 'credit' })
        setCredited(true)
        try {
            const res = await AuthPostApi(`${Apis.admin.credit_gift_customer}/${id}`, formdata)
            if (res.status !== 200) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            fetchGiftCardOrder()
            setForms({ ...forms, amount: '' })
            SuccessAlert(res.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, param: '' })
        }
    }

    const handleErr = (e) => {
        setForms({ ...forms, [e.target.name]: e.target.value })
    }

    const declineOrder = async (e) => {
        e.preventDefault()
        const formdata = { message: forms.error, tag: 'failed' }
        setLoading({ status: true, param: 'exit' })
        try {
            const res = await AuthPostApi(`${Apis.admin.credit_gift_customer}/${id}`, formdata)
            if (res.status !== 200) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            fetchGiftCardOrder()
            setConfirmBad(false)
            setConfirmMsg(false)
            setForms({ ...forms, amount: '', error: '', valid: '' })
            SuccessAlert(res.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading({ status: false, param: '' })
        }
    }

    const submitErrorMsg = (e) => {
        e.preventDefault()
        if (!forms.error) return ErrorAlert(`Please enter an error message to customer`)
        setConfirmMsg(true)
    }

    const closeOrder = (e) => {
        e.preventDefault()
        if (data.status === 'pending') return ErrorAlert('Confirm valid card, credit customer or confirm card is bad')
        setLoading({ status: true, param: 'close' })
        return setTimeout(() => {
            setLoading({ status: false, param: '' })
            SuccessAlert(data?.status === 'completed' ? `Order completed & closed successfully` : `Order marked failed & closed successfully`)
            setScreen(2)
        }, 2000)
    }

    const imagesArray = data?.images ? JSON.parse(data.images) : []
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const location = useLocation()
    const [isCompletedOrders, setIsCompletedOrders] = useState(false);
    useEffect(() => {
        // Check if 'completed_orders' is in the URL
        if (location.pathname.includes('completed_orders')) {
            setIsCompletedOrders(true);
        } else {
            setIsCompletedOrders(false);
        }
    }, [location.pathname]);

    return (
        <AdminPageLayout>
            {
                confirmBad &&
                <ModalLayout clas={`w-11/12 md:w-1/2 mx-auto`} setModal={setConfirmBad}>
                    <div className="w-full rounded-xl bg-white relative p-5 text-dark">
                        {confirmMsg &&
                            <ModalLayout setModal={confirmMsg} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                                <div className="p-5 bg-white text-dark rounded-md">
                                    <div className="text-base text-center mb-3">Are you sure you want to fail this transaction?</div>
                                    <div className="flex items-center justify-between">
                                        <button onClick={() => setConfirmMsg(false)} className='px-4 py-2 bg-red-600 text-white rounded-md' type='button'>Cancel</button>
                                        <button className='px-4 py-2 bg-green-600 text-white rounded-md' type='button' onClick={declineOrder}>Proceed</button>
                                    </div>
                                </div>
                            </ModalLayout>
                        }
                        <div className="w-full text-center font-bold">Enter message to customer</div>
                        <div className="mt-3 flex items-center flex-col gap-3">
                            <div className="w-full">
                                <FormInput read={true} formtype='textarea' name={`error`} value={forms.error} onChange={handleErr} />
                            </div>
                            <button disabled={confirmMsg ? true : false} type='button' onClick={submitErrorMsg} className='px-4 rounded-md bg-red-600 py-1.5 text-white'>confirm message</button>
                        </div>
                    </div>
                </ModalLayout>
            }
            {loading.status && loading.param === 'fetch' &&
                <Loader title={`fetching order`} />
            }
            {loading.status && loading.param === 'close' &&
                <Loader title={`closing order`} />
            }
            {loading.status && loading.param === 'exit' &&
                <Loader title={`closing order and sending error message to user`} />
            }
            {loading.status && loading.param === 'credit' &&
                <Loader title={`crediting customer`} />
            }
            <div className="w-11/12 mx-auto">
                {screen === 1 &&
                    <>
                        <div className="">
                            <Link 
                            to={isCompletedOrders? `/admin/giftcards/completed_orders`:`/admin/giftcards/orders`} 
                            className="w-fit px-4 py-1.5 rounded-md bg-ash">back to orders</Link>
                        </div>
                        <div className="mt-5 md:mt-10 mont">

                            <div className="w-full text-center capitalize font-bold poppins">Review Order Number <span className={`${green}`}>{data?.order_no}</span></div>

                            <form className="bg-primary p-3 rounded-md  mx-auto mt-5 md:mt-10 mb-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5   ">
                                    <div className="flex flex-col gap-3 w-full">
                                        <div className="flex flex-col gap-2 items-start">
                                            <div className="text-sm">Customer ID:</div>
                                            <FormInput read={true} value={data?.gift_seller?.id} className={`${green}`} />
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="text-sm">GiftCard Brand:</div>
                                            <FormInput read={true} value={data?.brand} className={`${green}`} />
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="text-sm">Country:</div>
                                            <FormInput read={true} value={data?.country} className={`${green}`} />
                                        </div>
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="text-sm">Amount:</div>
                                            <FormInput read={true} value={`${currencies[0].symbol}${data?.amount?.toLocaleString()}`} className={`${green}`} />
                                        </div>


                                    </div>
                                    <div className=" flex flex-col gap-3 w-full">
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="text-sm">Rate:</div>
                                            <FormInput read={true} value={`${currencies[1].symbol}${data?.rate}`} className={`${green}`} />
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <div className="text-sm">FullName:</div>
                                            <FormInput read={true} value={`${data?.gift_seller?.first_name} ${data?.gift_seller?.surname}`} className={`${green}`} />
                                        </div>
                                        {data?.code && <div className="flex flex-col gap-2">
                                            <div className="text-sm">GitfCard Code:</div>
                                            <FormInput read={true} value={data?.code} className={`${green} uppercase`} />
                                        </div>}
                                        <div className="w-full flex flex-col gap-2">
                                            <div className="text-sm">Amount In NGN:</div>
                                            <FormInput read={true} value={`${currencies[1].symbol}${inNaira}`} className={`${green}`} />
                                        </div>
                                        {data?.pin && <div className="flex flex-col gap-2">
                                            <div className="text-sm">GitfCard PIN:</div>
                                            <FormInput read={true} value={data?.pin ? data?.pin : 'n/a'} className={`${green}`} />
                                        </div>}
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-1 md:grid-cols-2 items-center mt-5 ">
                                    {!credited && data?.status === 'pending' && <div className="flex items-start flex-col w-full  ">
                                        <div className=" lowercase">Confirm Valid Card</div>
                                        <div className="">
                                            <SelectComp options={statuses} value={forms.valid} width={200} style={{ bg: '#212134', color: 'lightgreen', font: '0.8rem' }}
                                                handleChange={(e) => setForms({ ...forms, valid: e.target.value })}
                                            />
                                        </div>
                                    </div>}
                                    {forms.valid === 'Yes' && !credited && <div className="flex items-start flex-col gap-2 w-full ">
                                        <div className="l">Credit Customer Balance:</div>
                                        <div className="">
                                            <input onChange={handleChange} name='amount' value={forms.amount} type="text" className='input-off w-1/2 bg-primary text-white font-bold' />
                                        </div>
                                        <button type='button' onClick={applyAmt ? creditUser : applyamount} className='px-3 py-1 rounded-md bg-ash'>{applyAmt ? 'credit customer' : 'apply amount'}</button>
                                    </div>}

                                    {data?.status !== 'completed' && forms.valid === 'No' &&
                                        <div className="">
                                            <button type='button' onClick={() => setConfirmBad(true)} className='px-4 rounded-md bg-red-600 py-1.5'>confirm card is bad</button>
                                        </div>
                                    }{data?.status === 'failed' &&
                                        <div className="className=' text-red-600">
                                            Card confirmed bad
                                        </div>
                                    }
                                </div>

                                <div className="mt-5 mb-2">Images of giftcards submitted:</div>
                                <div className=" grid grid-cols-2 md:grid-cols-4 gap-4">

                                    {imagesArray.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative cursor-pointer rounded-md overflow-hidden group"
                                            onClick={() => handleImageClick(image)}
                                        >
                                            <img
                                                src={image}
                                                alt={`Gift Card ${index + 1}`}
                                                className="w-full h-40 object-cover"
                                            />
                                            {/* Hover Overlay */}
                                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="text-white font-semibold">View Image</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Modal */}
                                {selectedImage && (
                                    <div className="fixed  inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
                                        <div className="relative p-4 bg-white rounded-lg">
                                            <button
                                                className="absolute top-2 right-2 text-black font-bold"
                                                onClick={() => setSelectedImage(null)}
                                            >
                                                ✕
                                            </button>
                                            <img src={selectedImage} alt="Full View" className="max-w-full max-h-[80vh] rounded-md" />
                                        </div>
                                    </div>
                                )}
                                <div className="w-11/12 mt-5 mx-auto md:w-5/6">
                                    <FormButton type='button' onClick={closeOrder} title={`Close Order`} />
                                </div>
                            </form>


                        </div>
                    </>}
                {screen === 2 && <div className="">
                    <div className="w-11/12 mx-auto min-h-[70dvh] flex items-center justify-center">
                        <div className="w-full flex items-center  flex-col">
                            <Lottie options={defaultOptions} height={250} width={300} />
                            <div className="mt-10 flex flex-col items-center ">
                                <div className="capitalize">Thank You for confirming this order.
                                </div>
                                <Link to={`/admin/giftcards/orders`} className={`bg-green-500  mt-10 hover:bg-lightgreen text-white hover:text-ash py-2 text-center rounded-md w-full`}>
                                    Go back to orders
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        </AdminPageLayout>
    )
}

export default GiftCardSingleOrder