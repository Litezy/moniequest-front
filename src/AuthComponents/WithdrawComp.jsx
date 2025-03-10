import React, { useState } from 'react'
import ModalLayout from '../utils/ModalLayout'
import moment from 'moment'
import { GoArrowDownLeft } from 'react-icons/go'
import { currencies } from './AuthUtils'
import WithdrawModal from './WithdrawModal'

const WithdrawComp = ({ trans }) => {
    const [modal, setModal] = useState(false)
    
    return (
        <div className='w-full mb-5'>
            {modal &&
                <ModalLayout clas={`w-11/12 mx-auto lg:w-1/2 scroll`} setModal={setModal}>
                    <div className="w-full p-5 lg:p-10  bg-primary rounded-md ">
                        <div className="text-center">More Details</div>
                        <div className="flex mt-5 items-center justify-between">
                            <WithdrawModal selected={trans} />
                        </div>
                        <button className='mt-5 w-full text-center bg-red-600 py-2 rounded-md' onClick={() => setModal(false)} >close</button>
                    </div>
                </ModalLayout>
            }
            <div onClick={() => setModal(true)} className="w-full flex items-center cursor-pointer lg:grid lg:grid-cols-3 justify-between border-b-primary pb-1 border-b mt-2 ">
                <div className="flex items-start gap-2 lg:gap-5 w-fit lg:w-full ">
                    <div className="w-fit px-4 py-4 rounded-full bg-primary">
                        <GoArrowDownLeft className='text-blue-600' />
                    </div>
                    <div className="flex items-start flex-col gap-1">
                        <div className="flex items-center gap-3">
                            <div className={`text-zinc-200 capitalize`}>Bank Withdrawal</div>
                        </div>
                        <div className="flex items-center gap-1 md:text-sm text-xs">
                            <div className="flex flex-col items-start gap-1 text-sm">
                                <div className="">{moment(trans.createdAt).format('ddd')} {moment(trans.createdAt).format('DD-MM-YYYY')}</div>
                                <div className="">{moment(trans.createdAt).format('hh:mm a')}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className={` flex items-center capitalize text-sm justify-center lg:w-full rounded-md text-yellow-300 `}>
                    {trans.status}</div>

                <div className=" gap-1 font-bold lg:w-full flex items-center justify-center">
                    <div
                        className={` `}>{currencies[1].symbol}{trans.amount.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default WithdrawComp