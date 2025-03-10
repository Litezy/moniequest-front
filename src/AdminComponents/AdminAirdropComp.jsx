import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { MoveToTop } from '../utils/pageUtils'

const AdminAirdropComp = ({ item }) => {
    return (
        
        <div className='w-full h-fit relative text-semi-white rounded-lg shadow_auth'>
            <div className='md:px-4 px-3 py-3 bg-secondary text-sm rounded-t-lg flex justify-between items-center text-lightgreen'>
                <div>{moment(item?.createdAt).format('DD-MM-yyyy')} / {moment(item?.createdAt).format('h:mm')}</div>
                <div className='flex md:gap-3 gap-2 items-center'>
                    <div>ID: {item?.gen_id}</div>
                    <Link to={`/admin/airdrops/${item.id}/${item.slug}`} onClick={MoveToTop}>
                        <button className='outline-none w-fit h-fit bg-ash py-2 md:px-4 px-3 text-xs rounded-md text-white font-medium'>View</button>
                    </Link>
                </div>
            </div>
            <div className='bg-primary grid md:grid-cols-2 grid-cols-1 md:gap-0 gap-2 text-sm rounded-b-lg capitalize md:p-0 p-3'>
                <div className='flex flex-col gap-2 md:p-4 overflow-hidden'>
                    <div className='flex justify-between gap-4'>
                        <span>title:</span>
                        <span>{item?.title}</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>category:</span>
                        <span>{item?.category === 'earn_crypto' ? 'earn crypto' : item?.category}</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>blockchain:</span>
                        <span>{item?.blockchain}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-2 md:p-4 md:border-l border-gray-800 overflow-hidden'>
                    <div className='flex justify-between gap-4'>
                        <span>type:</span>
                        <span>{item?.type}</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>kyc:</span>
                        <span>{item?.kyc}</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>status:</span>
                        <span className={`${item?.status === 'open' ? 'text-green-400' : 'text-red-500'}`}>{item?.status}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default AdminAirdropComp