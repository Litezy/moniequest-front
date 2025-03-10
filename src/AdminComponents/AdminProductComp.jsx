import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { currencySign, MoveToTop } from '../utils/pageUtils'

const AdminProductComp = ({ item }) => {
    const categories = item?.category ? JSON.parse(item.category) : []

    return (
        <div className='w-full h-fit relative text-semi-white rounded-lg shadow_auth'>
            <div className='md:px-4 px-3 py-3 bg-secondary text-sm rounded-t-lg flex justify-between items-center text-lightgreen'>
                <div>{moment(item?.createdAt).format('DD-MM-yyyy')} / {moment(item?.createdAt).format('h:mm')}</div>
                <div className='flex md:gap-3 gap-2 items-center'>
                    <div>ID: {item?.gen_id}</div>
                    <Link to={`/admin/products/${item.id}/${item.slug}`} onClick={MoveToTop} >
                        <button className='outline-none w-fit h-fit bg-ash py-2 md:px-4 px-3 text-xs rounded-md text-white font-medium'>View</button>
                    </Link>
                </div>
            </div>
            <div className='bg-primary grid md:grid-cols-2 grid-cols-1 md:gap-0 gap-2 text-sm rounded-b-lg md:p-0 p-3'>
                <div className='flex flex-col gap-2 md:p-4 overflow-hidden'>
                    <div className='flex justify-between gap-4 capitalize'>
                        <span>title:</span>
                        <span>{item?.title}</span>
                    </div>
                    <div className='flex justify-between gap-6 capitalize'>
                        <div>category:</div>
                        {categories.length > 0 &&
                            <div className="w-full overflow-x-auto scrollsdown cursor-all-scroll">
                                <div className='w-fit flex gap-1 truncate ml-auto'>
                                    {categories.slice(0, 2).map((ele, i) => (
                                        <div key={i}>{ele}{i !== categories.length - 1 && ','}</div>
                                    ))}
                                    {categories.length > 2 && '...'}
                                </div>
                            </div>
                        }
                    </div>
                    <div className='flex justify-between gap-4 capitalize'>
                        <span>price:</span>
                        <span>{currencySign[1]}{item?.price && item.price.toLocaleString()}</span>
                    </div>
                </div>
                <div className='flex flex-col gap-2 md:p-4 md:border-l border-gray-800 overflow-hidden'>
                    <div className='flex justify-between gap-4'>
                        <span>Discount:</span>
                        <span>{item?.discount_percentage ? <span>{item?.discount_percentage}%</span> : 'n/a'}</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>Link:</span>
                        <a href={item?.video_link} target="_blank" rel="noopener noreferrer" className='underline'>{item?.video_link}</a>
                    </div>
                    <div className='flex justify-between gap-4 capitalize'>
                        <span>status:</span>
                        <span className={`${item?.status === 'approved' ? 'text-green-400' : item?.status === 'declined' ? 'text-red-500' : 'text-yellow-300'}`}>{item?.status}</span>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default AdminProductComp