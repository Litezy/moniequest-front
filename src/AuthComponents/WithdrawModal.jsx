import React from 'react'
import { currencies } from './AuthUtils'
import moment from 'moment'

const WithdrawModal = ({ selected }) => {

    return (
        <div className="flex w-full items-start gap-2 flex-col ">
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction</div>
                <div className="capitalize  ">Bank withdrawal</div>
            </div>
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Amount</div>
                <div className="capitalize  ">{currencies[1].symbol}{selected?.amount.toLocaleString()}</div>
            </div>
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Beneficiary</div>
                <div className=" ">{selected?.bank_name}</div>
            </div>
           
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Beneficiary Account Number</div>
                <div className="capitalize  ">{selected?.account_number}</div>
            </div>
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Beneficiary Bank</div>
                <div className="capitalize  ">{selected?.bank_user}</div>
            </div>

            
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Status</div>
                <div className=" text-yellow-300">{selected?.status}</div>
            </div>
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Date</div>
                <div className=" ">{moment(selected?.createdAt).format(`DD/MM/yyyy hh:mm a`)}</div>
            </div>

        </div>
    )
}

export default WithdrawModal