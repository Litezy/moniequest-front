import React, { useEffect, useState } from 'react'
import { GoArrowDownLeft, GoArrowUpRight } from 'react-icons/go'
import { Link, useLocation } from 'react-router-dom'
import moment from 'moment'
import { currencies } from './AuthUtils'

const GiftComp = ({ trans }) => {

    const [naira, setNaira] = useState('')
    useEffect(() => {
        if (trans) {
            const amt = trans?.amount * trans?.rate
            setNaira(amt.toLocaleString())
        }
    }, [])

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
        <div className='w-full mb-5'>

            <Link 
            to={isCompletedOrders ? `/user/giftcards/completed_orders/${trans.id}`: `/user/giftcards/orders/${trans.id}`} 
            className="w-full flex items-center cursor-pointer lg:grid lg:grid-cols-3 justify-between border-b-primary py-2 border-b ">
                <div className="flex items-start gap-2 lg:gap-5 w-fit lg:w-full ">
                    <div className="w-fit px-4 py-4 rounded-full bg-primary">
                        <GoArrowUpRight className='text-red-600' />
                    </div>
                    <div className="flex items-start flex-col lg:gap-1">
                        <div className="flex items-center gap-3">
                            <div className={` capitalize`}>{trans.brand}</div>
                        </div>
                        <div className="flex flex-col items-start gap-1 text-sm">
                            <div className="">{moment(trans.createdAt).format('ddd')} {moment(trans.createdAt).format('DD-MM-YYYY')}</div>
                            <div className="">{moment(trans.createdAt).format('hh:mm a')}</div>
                        </div>
                    </div>
                </div>
                <div className={`flex items-center text-sm justify-center lg:w-full rounded-md ${trans.status === 'pending' ? 'text-yellow-300 ' : 'text-lightgreen'} `}>
                    {trans.status}</div>

                <div className=" gap-1 font-bold lg:w-full flex items-center justify-center">
                    {/* <div className="">-</div> */}
                    <div
                        className={` `}>{currencies[1].symbol}{naira}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default GiftComp