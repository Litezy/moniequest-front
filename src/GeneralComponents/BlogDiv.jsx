import React from 'react'
import { FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { PiArrowUpRight } from "react-icons/pi";
import { MoveToTop } from '../utils/pageUtils';
import moment from 'moment';

const BlogDiv = ({ item, className }) => {

    return (
        <div className={`w-full bg-black hover:bg-black/10 border border-black hover:border-bg-green rounded-xl p-2 min-h-24  ${className} `}>
            <Link className='h-full flex items-start flex-col justify-between' to={`/blogs/${item.feature}/${item.id}/${item.slug}`} onClick={MoveToTop} >
                <div className="w-full">
                    <img src={item?.image} alt="blog image" className="w-full rounded-xl h-40 object-cover" />
                </div>
                <div className="mt-2 flex items-start flex-col justify-between gap-3">
                    <div className="text-sm text-gray-400 "><span className='capitalize'>{item?.feature === 'personal_finance' ? 'personal finance' : item?.feature}</span> article</div>
                    <div className="lg:flex items-center gap-3 justify-between ">
                        <div className=" text-lg text-white w-full capitalize">{item?.title}</div>
                        <PiArrowUpRight className='text-lg hidden lg:block' />
                    </div>
                    <div className="flex items-center gap-2 w-full h-fit">
                        <div className=""><FaUser className='text-2xl text-zinc-400' /></div>
                        <div className="flex flex-col gap-1 self-baseline text-sm text-zinc-400">
                            <div className="capitalize">{item?.blog_user?.first_name} {item?.blog_user?.surname}</div>
                            <div className="text-xs">{moment(item?.createdAt).format('D MMM YYYY hh:mm a')}</div>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default BlogDiv