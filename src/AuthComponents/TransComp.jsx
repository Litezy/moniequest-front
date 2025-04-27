import React, { useEffect, useState } from 'react'
import { GoArrowDownLeft, GoArrowUpLeft, GoArrowUpRight } from 'react-icons/go'
import { currencies } from './AuthUtils'
import ModalLayout from '../utils/ModalLayout'
import TransModal from './TransModal'
import moment from 'moment'


const TransComp = ({ trans }) => {
    const [modal, setModal] = useState(false)
    const [naira, setNaira] = useState('')

    useEffect(() => {
        let newAmount;
        if (trans.type === 'buy') {
            newAmount = parseFloat(trans?.amount) + parseFloat(trans?.gas_fee)
        } else {
            newAmount = parseFloat(trans?.amount)
        }
        const naira = newAmount * trans?.rate
        setNaira(naira.toLocaleString())
    }, [trans])

    return (
        <div className='w-full mb-5'>
            {modal &&
                <ModalLayout clas={`w-11/12 mx-auto lg:w-1/2 scroll overflow-hidden rounded-md`} setModal={setModal}>
                    <div className="w-full p-5  bg-primary  ">
                        <div className="text-center">More Details</div>
                        <div className="flex mt-5 items-center justify-between">
                            <TransModal trans={trans} />
                        </div>
                        <button className='mt-5 w-full text-center bg-red-600 py-2 rounded-md' onClick={() => setModal(false)} >close</button>
                    </div>
                </ModalLayout>
            }
            <div onClick={() => setModal(true)} className="w-full flex items-center cursor-pointer lg:grid lg:grid-cols-3 justify-between border-b-primary pb-1 border-b mt-2 ">
                <div className="flex items-start gap-2 lg:gap-5 w-fit lg:w-full ">
                    <div className="w-fit px-4 py-4 rounded-full bg-primary">
                        {trans.type === 'buy' && <GoArrowDownLeft className='text-lightgreen' />}
                        {trans.type === 'sell' && <GoArrowUpRight className='text-red-600' />}
                        {trans.bank_holder && <GoArrowUpLeft className='text-blue-600' />}
                        {trans.brand && <GoArrowUpRight className='text-red-600' />}
                    </div>
                    <div className="flex items-start flex-col gap-1">
                        <div className="flex items-center gap-3">
                            {trans.crypto_currency && <div className={`text-zinc-200 capitalize font-bold`}>Crypto</div>}
                            {trans.bank_holder && <div className={`text-zinc-200 capitalize font-bold`}>Bank Withdrawal</div>}
                            {trans.brand && <div className={`text-zinc-200 capitalize font-bold`}>Gift-Card</div>}
                            {trans.type && <div className="w-[0.5px] h-5 bg-gray-400"></div>}
                            {trans.type && <div className={` ${trans.type === 'buy' ? "text-lightgreen" : 'text-red-600'} capitalize`}> {trans.type}</div>}
                            {/* {trans.brand && <div className="w-[0.5px] h-5 bg-gray-400"></div>}
                            {trans.brand && <div className={`text-red-600 capitalize`}>sell</div>} */}
                        </div>
                        <div className="flex flex-col items-start gap-1 text-sm">
                            <div className="">{moment(trans.createdAt).format('ddd')} {moment(trans.createdAt).format('DD-MM-YYYY')}</div>
                            <div className="">{moment(trans.createdAt).format('hh:mm a')}</div>
                        </div>
                    </div>
                </div>
                {trans.crypto_currency && <div className={`${trans.crypto_currency && ['pending', 'unpaid'].includes(trans.status) ? "text-yellow-300" : trans.status === 'failed' ? 'text-red-600' : 'text-lightgreen'} flex items-center text-sm justify-center lg:w-full rounded-md `}>{trans.status}</div>}

                {trans.bank_holder &&
                    <div className={`${trans.bank_holder && trans.status === 'pending' ? "text-yellow-300" : trans.status === 'failed' ? 'text-red-600' : 'text-lightgreen'} flex items-center text-sm justify-center lg:w-full rounded-md `}>{trans.status}</div>
                }

                {trans.brand && <div className={`${trans.brand && trans.status === 'pending' ? "text-yellow-300" : trans.status === 'failed' ? 'text-red-600' : 'text-lightgreen'} flex items-center text-sm justify-center lg:w-full rounded-md `}>{trans.status}</div>}

                <div className=" gap-1 font-bold lg:w-full flex items-center justify-center">

                    {trans.bank_holder && <div
                        className={`text-white`}>{currencies[1].symbol}{trans?.amount?.toLocaleString()}
                    </div>}
                    {!trans?.bank_holder && <div
                        className={` text-white`}>{currencies[1].symbol}{naira}
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default TransComp