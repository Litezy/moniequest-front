import React, { useCallback, useEffect, useState } from 'react'
import AuthPageLayout from '../../AuthComponents/AuthPageLayout'
import { Link, useLocation, useParams } from 'react-router-dom'
import { ErrorAlert } from '../../utils/pageUtils'
import { Apis, AuthGetApi } from '../../services/API'
import FormInput from '../../utils/FormInput'
import { currencies } from '../../AuthComponents/AuthUtils'

const OneGiftcardOrder = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null) // Set to null initially
    const { id } = useParams()

    // Fetch Giftcard Order Data
    const fetchSingleOrder = useCallback(async () => {
        setLoading(true)
        try {
            const res = await AuthGetApi(`${Apis.transaction.single_giftcard_order}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            setData(res.data[0] || {})
            console.log(res.data[0])
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }, [id])

    useEffect(() => {
        fetchSingleOrder()
    }, [fetchSingleOrder])

    const rate = data?.rate || 1

    const [naira, setNaira] = useState('')
    useEffect(() => {
        if (data?.amount) {
            const amountValue = typeof data.amount === 'string' ? data.amount.replace(/,/g, '') : data.amount
            const calculatedNaira = Number(amountValue) * rate
            setNaira(calculatedNaira.toLocaleString())
        }
    }, [rate, data?.amount]) // Correct dependencies

    const green = 'text-lightgreen text-base lg:text-lg'
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
        <AuthPageLayout>
            <div className="w-11/12 mx-auto">
                <Link to={isCompletedOrders ?`/user/giftcards/completed_orders` :'/user/giftcards/orders'} 
                className='w-fit px-4 py-1.5 rounded-md bg-primary'>Back to Orders</Link>
            </div>
            <div className='mt-5'>
                {loading &&
                    new Array(3).fill(0).map((_, i) => (
                        <div key={i} className="w-11/12 mx-auto animate-pulse flex items-center gap-4 mt-10">
                            <div className="w-16 h-16 ">
                                <div className="w-full h-full bg-gray-500 rounded-full"></div>
                            </div>
                            <div className="w-[90%]">
                                <div className="w-full h-14 rounded-xl bg-gray-500"></div>
                            </div>
                        </div>
                    ))
                }

                {data && !loading && (
                    <div className="">
                        <div className="w-full text-center capitalize font-bold poppins">
                            Order Number <span className={`${green}`}> {data.order_no}</span>
                        </div>

                        <div className="bg-primary p-10 rounded-md w-11/12 mx-auto mt-5 md:mt-10 mb-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5">
                                <div className="flex flex-col gap-3 w-full">
                                    <div className="flex flex-col items-start">
                                        <div className="text-sm">Giftcard Brand:</div>
                                        <FormInput read={true} value={data.brand || ''} className={`${green} capitalize`} />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-sm">Giftcard amount in {data.currency}:</div>
                                        <FormInput read={true} value={`${data.currency || ''}${data.amount || ''}`} className={`${green}`} />
                                    </div>
                                    {data?.code && (
                                        <div className="w-full">
                                            <div className="text-sm">Giftcard Code:</div>
                                            <FormInput read={true} value={data.code} className={`${green} uppercase`} />
                                        </div>
                                    )}
                                    <div className="w-full">
                                        <div className="text-sm">Rate:</div>
                                        <FormInput read={true} value={`${data?.rate || 0}/${data?.currency || ''}`} className={`${green}`} />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 w-full">
                                    {data?.code && (
                                        <div className="">
                                            <div className="text-sm">Giftcard Pin:</div>
                                            <FormInput read={true} value={data.pin || 'nil'} className={`${green}`} />
                                        </div>
                                    )}
                                    <div className="w-full">
                                        <div className="text-sm">Giftcard amount in NGN:</div>
                                        <FormInput read={true} value={`${currencies[1]?.symbol || '₦'}${naira}`} className={`${green}`} />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-sm">Status:</div>
                                        <FormInput read={true} value={data?.status || 'Pending'} className={`${data?.status === 'pending' ? 'text-yellow-300' : green}`} />
                                    </div>
                                    <div className="w-full">
                                        <div className="text-sm">Country:</div>
                                        <FormInput read={true} value={data?.country || ''} className={`${green}`} />
                                    </div>
                                </div>
                            </div>
                            <div className='flex flex-col gap-2 mt-5'>
                                <div>Images of giftcards submitted:</div>
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
                            </div>
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
                            {data?.status === 'pending' && <div className="mt-5 w-full text-center text-base">
                                We're processing your Giftcard transaction. Kindly hold on!
                            </div>}
                            <div className="mt-5 w-full flex items-center justify-center">
                                <Link to={`/user/dashboard`} className='w-1/2 py-2 rounded-md bg-lightgreen text-dark mx-auto text-center text-base'>
                                    Go to Dashboard
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthPageLayout>
    )
}

export default OneGiftcardOrder
