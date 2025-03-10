import moment from 'moment'
import React from 'react'
import { Link } from 'react-router-dom'
import { MoveToTop } from '../utils/pageUtils'

const BlogComp = ({ item }) => {
    return (
        <div className='w-full h-fit relative text-semi-white rounded-lg shadow_auth'>
            <div className='md:px-4 px-3 py-3 bg-secondary text-sm rounded-t-lg flex justify-between items-center text-lightgreen'>
                <div>{moment(item?.createdAt).format('DD-MM-yyyy')} / {moment(item?.createdAt).format('h:mm')}</div>
                <div className='flex md:gap-3 gap-2 items-center'>
                    <div>ID: {item?.gen_id}</div>
                    <Link to={`/admin/blogs/${item.id}`} onClick={MoveToTop}>
                        <button className='outline-none w-fit h-fit bg-ash py-2 md:px-4 px-3 text-xs rounded-md text-white font-medium'>View</button>
                    </Link>
                </div>
            </div>
            <div className='bg-primary text-sm rounded-b-lg capitalize md:p-4 p-3'>
                <div className='flex flex-col gap-2 overflow-hidden'>
                    <div className='flex justify-between gap-8'>
                        <span>title:</span>
                        <span>{item?.title}</span>
                    </div>
                    <div className='flex justify-between gap-4'>
                        <span>feature:</span>
                        <span>{item?.feature === 'personal_finance' ? 'personal finance' : item?.feature}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BlogComp