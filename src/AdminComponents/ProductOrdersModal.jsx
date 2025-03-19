import React from 'react'
import { currencySign, SuccessAlert } from '../utils/pageUtils'
import moment from 'moment'
import { MdContentCopy } from 'react-icons/md'

const ProductsOrdersModal = ({ selected }) => {
    const products = selected?.products ? JSON.parse(selected.products) : []

    const copyFunction = (content) => {
        navigator.clipboard.writeText(content)
        SuccessAlert('Email address copied successfully')
    }

    return (
        <div className="flex w-full gap-8 flex-col poppins">
            <div className='flex flex-col gap-5'>
                <div className="text-center text-lightgreen">Transaction Details</div>
                <div className='flex flex-col gap-2'>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Transaction Type</div>
                        <div className="capitalize ">P purchase</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Transaction Date</div>
                        <div className="capitalize ">{moment(selected?.createdAt).format('Do MMM YYYY')} / {moment(selected?.createdAt).format('h:mma')}</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Transaction ID</div>
                        <div>{selected?.gen_id}</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Total Product(s) Price</div>
                        <div>{currencySign[1]}{selected?.total_price && selected.total_price.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Total Discount Amount</div>
                        <div>{currencySign[1]}{selected?.total_discount && selected.total_discount.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Amount Paid</div>
                        <div>{currencySign[1]}{selected?.amount_paid && selected.amount_paid.toLocaleString()}</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Transaction Status</div>
                        <div>{selected?.status}</div>
                    </div>
                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                        <div>Email Address</div>
                        <div className='flex items-center gap-2'>
                            <div>{selected?.email_address}</div>
                            <div className='cursor-pointer text-lightgreen' onClick={() => copyFunction(selected?.email_address)}>
                                <MdContentCopy />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col gap-5'>
                <div className="text-center text-lightgreen">Products Purchased ({products.length})</div>
                {products.length > 0 &&
                    <>
                        {products.map((item, i) => {
                            const categories = item.category ? JSON.parse(item.category) : []
                            return (
                                <div key={i} className='flex flex-col gap-2 border border-zinc-600 p-4 overflow-x-hidden'>
                                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                                        <div>Product ID</div>
                                        <div>{item?.gen_id}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                                        <div>Title</div>
                                        <div className='capitalize'>{item?.title}</div>
                                    </div>
                                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                                        <div>Category</div>
                                        {categories.length > 0 &&
                                            <div className='flex flex-col gap-1'>
                                                {categories.map((ele, i) => (
                                                    <div key={i}>{ele}{i !== categories.length - 1 && ','}</div>
                                                ))}
                                            </div>
                                        }
                                    </div>
                                    <div className="flex items-center border-b pb-2 border-zinc-600 w-full justify-between gap-4">
                                        <div>Price</div>
                                        <div>{currencySign[1]}{item?.price && item.price.toLocaleString()}</div>
                                    </div>
                                    <div className="flex items-center w-full justify-between gap-4">
                                        <div>Discount</div>
                                        {item?.discount_percentage ? <div>{item?.discount_percentage}%</div> : <div>n/a</div>}
                                    </div>
                                </div>
                            )
                        })}
                    </>
                }
            </div>
        </div>
    )
}

export default ProductsOrdersModal