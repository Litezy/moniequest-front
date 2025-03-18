import React from 'react'
import { FaXTwitter, FaTelegram, FaGlobe } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { MoveToTop } from '../utils/pageUtils'
import { imageurl } from '../services/API'

const AirdropDiv = ({ item, className }) => {
    return (
        <Link to={`/airdrops/${item.category}/${item.id}/${item.slug}`} onClick={MoveToTop} className={`h-fit w-72 bg-primary hover:bg-[#2f2f47] border hover:border-bg-green border-ash rounded-md p-4 text-white ${className}`}>
            <div className='flex flex-col gap-4'>
                <div className='flex items-center gap-2'>
                    <img alt='airdrop logo' src={item.logo_image} className='w-14 h-14 rounded-full object-cover'></img>
                    <div className='flex flex-col gap-1'>
                        <div className='capitalize text-lg font-bold'>{item?.title}</div>
                        <div className='flex items-center gap-2'>
                            {item.twitter_link && <div className='w-fit h-fit p-1.5 rounded-full border border-gray-600 text-xs flex items-center justify-center'>
                                <FaXTwitter />
                            </div>}
                            {item.telegram_link && <div className='w-fit h-fit p-1.5 rounded-full border border-gray-600 text-xs flex items-center justify-center'>
                                <FaTelegram />
                            </div>}
                            {item.website_link && <div className='w-fit h-fit p-1.5 rounded-full border border-gray-600 text-xs flex items-center justify-center'>
                                <FaGlobe />
                            </div>}
                        </div>
                    </div>
                </div>
                <div className='flex justify-between gap-4 pb-2'>
                    <div className='flex flex-col gap-2 capitalize text-[0.8rem]'>
                        <div className='font-bold'>{item?.format}</div>
                        <div className='text-xs'>${item?.level}</div>
                    </div>
                    <div className='flex flex-col gap-2 capitalize text-[0.8rem]'>
                        <div className='font-bold'>{item?.type}</div>
                        <div className='text-xs'>{item?.blockchain} blockchain</div>
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default AirdropDiv