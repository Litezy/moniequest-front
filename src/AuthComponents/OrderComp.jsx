import React, { useEffect, useState } from 'react'
import { GoArrowDownLeft, GoArrowUpRight } from 'react-icons/go'
import moment from 'moment'
import { currencies } from './AuthUtils'
import { Link } from 'react-router-dom'

const OrderComp = ({ trans }) => {
    const [naira, setNaira] = useState('')

    useEffect(() => {
        let newAmount;
        if (trans.type === 'buy') {
            newAmount = trans?.amount + trans?.gas_fee
        } else {
            newAmount = trans?.amount - trans?.gas_fee
        }
        const naira = newAmount * trans?.rate
        setNaira(naira.toLocaleString())
    }, [trans])

    return (
        <div className='w-full mb-5'>

            <Link to={`/user/exchange/orders/${trans.id}/${trans.type}`} className="w-full flex items-center cursor-pointer lg:grid lg:grid-cols-3 justify-between border-b-primary pb-1 border-b mt-2 ">
                <div className="flex items-start gap-2 lg:gap-5 w-fit lg:w-full ">
                    <div className="w-fit px-4 py-4 rounded-full bg-primary">
                        {trans.type === 'buy' && <GoArrowDownLeft className='text-lightgreen' />}
                        {trans.type === 'sell' && <GoArrowUpRight className='text-red-600' />}
                    </div>
                    <div className="flex items-start flex-col lg:gap-1">
                        <div className="flex items-center gap-3">
                            <div className={`text-zinc-200 capitalize`}>{trans.tag ? trans.tag : 'Crypto'}</div>
                            {trans.type && <div className="w-[0.5px] h-5 bg-gray-400"></div>}
                            {trans.type && <div className={` ${trans.type === 'buy' ? "text-lightgreen" : 'text-red-600'} capitalize`}> {trans.type}</div>}
                        </div>
                        <div className="flex items-center gap-1 lg:text-base text-sm">
                            <div className="text-xs">{moment(trans.createdAt).format(`hh:mm a`)}</div>
                            <div className="w-1 h-1 bg-lightgreen rounded-full"></div>
                            <div className="mont text-sm text-white">{moment(trans.createdAt).format('ddd')}</div>
                        </div>
                    </div>
                </div>
                <div
                    className={` flex items-center capitalize text-sm justify-center lg:w-full rounded-md ${trans.status === 'pending' ? "text-gray-300" : trans.status === 'paid' ? 'text-green-400 ' : 'text-yellow-300'}`}>
                    {trans.status}</div>

                <div className=" gap-1 font-bold lg:w-full flex items-center justify-center">
                    <div
                        className={`text-white `}>{currencies[1].symbol}{naira}
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default OrderComp