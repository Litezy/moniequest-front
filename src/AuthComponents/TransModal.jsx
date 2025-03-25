import React, { useEffect, useState } from 'react'
import { currencies } from './AuthUtils'
import moment from 'moment'

const TransModal = ({ trans }) => {
    const [inNaira, setInNaira] = useState('')

    useEffect(() => {
        let newAmount;
        if (trans.type === 'buy') {
            newAmount = parseFloat(trans?.amount) + parseFloat(trans?.gas_fee)
        } else {
            newAmount = parseFloat(trans?.amount)
        }
        const naira = newAmount * trans?.rate
        setInNaira(naira.toLocaleString())
    }, [trans])

    return (
        <div className="flex w-full items-start gap-2 flex-col poppins">
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction</div>
                {trans.crypto_currency && <div className="capitalize ">Crypto Currency</div>}
                {trans.bank_user && <div className="capitalize ">Bank Withdrawal</div>}
                {trans.brand && <div className="capitalize ">Gift Card</div>}
            </div>
            {trans?.type && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Type</div>
                <div className="capitalize ">{trans?.type}</div>
            </div>}
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Date</div>
                <div className="capitalize ">{moment(trans.createdAt).format(`DD/MM/YYYY hh:mm a`)}</div>
            </div>
            {(trans.brand || trans.crypto_currency) && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Amount</div>
                <div className="capitalize ">{currencies[0].symbol}{trans.amount && trans.amount.toLocaleString()}</div>
            </div>}
            {trans.bank_user && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Amount</div>
                <div className="capitalize ">{currencies[1].symbol}{trans.amount && trans.amount.toLocaleString()}</div>
            </div>}

            {trans.crypto_currency && trans.type === 'buy' && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Gas fee</div>
                <div className="capitalize ">{currencies[0].symbol}{trans?.gas_fee}</div>
            </div>}
            {trans.crypto_currency && trans.type === 'buy' && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Amount paid in USD</div>
                <div className="capitalize">{currencies[0].symbol}{parseFloat(trans?.amount) + parseFloat(trans?.gas_fee)}</div>
            </div>}

            {!trans.bank_user && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Amount in NGN</div>
                <div className="capitalize ">{currencies[1].symbol}{inNaira}</div>
            </div>}

            {!trans.bank_user && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Rate</div>
                <div className="capitalize ">{currencies[1].symbol}{trans?.rate}/$</div>
            </div>}

            {trans.trans_id && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction ID</div>
                <div className="capitalize ">{trans?.trans_id}</div>
            </div>}
            {trans.order_no && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Order ID</div>
                <div className="capitalize ">{trans?.order_no}</div>
            </div>}
            {trans?.bank_user && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Number</div>
                <div className="">{trans?.reference_id ? trans?.reference_id : 'Not confirmed'}</div>
            </div>}
            {trans?.bank_name && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Beneficiary</div>
                <div className="">{trans?.bank_name}</div>
            </div>}
            {trans?.account_number && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Beneficiary Account</div>
                <div className="">{trans?.account_number}</div>
            </div>}

            {trans?.bank_user && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Beneficiary Bank</div>
                <div className="">{trans?.bank_user}</div>
            </div>}
            {trans?.code && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Gift-Card Code</div>
                <div className="">{trans?.code}</div>
            </div>}
            {trans?.brand && <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Gift-Card Pin</div>
                <div className="">{trans?.pin ? trans?.pin : 'nil'}</div>
            </div>}
            <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between">
                <div className="">Transaction Status</div>
                <div className="">{trans?.status}</div>
            </div>

        </div>
    )
}

export default TransModal