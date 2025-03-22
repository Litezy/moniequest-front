import React, { useCallback, useEffect, useState } from 'react'
import Giftcards from '../../AuthComponents/Giftcards'
import GiftComp from '../../AuthComponents/GiftComp'
import { Apis, AuthGetApi } from '../../services/API'
import { Link } from 'react-router-dom'

const GiftCardOrders = () => {
    const [data, setData] = useState([])
    const [dataLoading, setDataLoading] = useState(true)

    const fetchOrders = async () => {
        try {
            const res = await AuthGetApi(Apis.transaction.giftcard_orders)
            if (res.status !== 200) {
                console.log(res.msg)
                return;
            }
            const data = res.data
            setData(data)

        } catch (error) {

        } finally {
            setDataLoading(false)
        }
    }
    useEffect(() => {
        fetchOrders()
    }, [])


    return (
        <Giftcards>
            <div className="w-11/12 mx-auto">
                <div className="my-5 text-2xl font-bold lg:text-center ">Recent Orders</div>
                <div className="mt-10">
                    <div className="mb-5 text-sm ">NB: Completed Orders are found in the <Link to={`/user/transactions_history`} className='text-indigo-500'>Transactions history</Link></div>
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
        </Giftcards>
    )
}

export default GiftCardOrders