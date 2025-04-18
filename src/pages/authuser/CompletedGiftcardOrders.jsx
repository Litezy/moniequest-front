import React, { useEffect, useState } from 'react'
import GiftComp from '../../AuthComponents/GiftComp'
import { Apis, AuthGetApi } from '../../services/API'
import GiftcardLayout from '../../AuthComponents/GiftcardLayout'

const CompletedGiftcardOrders = () => {
    const [data, setData] = useState([])
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        const FetchCompletedOrders = async () => {
            try {
                const res = await AuthGetApi(Apis.transaction.completed_giftcard_orders)
                if (res.status === 200) {
                    setData(res.data)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setDataLoading(false)
            }
        }
        FetchCompletedOrders()
    }, [])


    return (
        <GiftcardLayout>
            <div className="w-11/12 mx-auto">
                <div className="my-5 text-2xl font-bold lg:text-center ">Completed Orders</div>
                <div className="mt-10">
                    {dataLoading ?
                        <div className='flex items-center lg:grid lg:grid-cols-3 justify-between border-b border-slate-400 pb-2 w-full animate-pulse'>
                            <div className='flex lg:gap-5 gap-2 items-start'>
                                <div className='w-12 h-12 rounded-full bg-slate-400'></div>
                                <div className='flex flex-col gap-4'>
                                    <div className='w-32 h-3 rounded-full bg-slate-400'></div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='md:w-28 w-24 h-2 rounded-full bg-slate-400'></div>
                                        <div className='md:w-16 w-12 h-2 rounded-full bg-slate-400'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <div className='md:w-16 w-12 h-2 rounded-full bg-slate-400'></div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <div className='md:w-16 w-12 h-2 rounded-full bg-slate-400'></div>
                            </div>
                        </div>
                        :
                        <>
                            {data.length > 0 ?
                                data.map((trans, i) => {
                                    return (
                                        <GiftComp key={i} trans={trans} />
                                    )
                                }) :
                                <div className="">No orders found</div>
                            }
                        </>
                    }
                </div>
            </div>
        </GiftcardLayout>
    )
}

export default CompletedGiftcardOrders