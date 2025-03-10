import React, { useEffect, useState } from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { FaUser } from 'react-icons/fa6'
import { FaLongArrowAltLeft } from "react-icons/fa";
import { Link, useParams, } from 'react-router-dom';
import { Apis, GetApi } from '../../services/API';
import moment from 'moment';

const BlogComments = () => {
    const { feature, id, slug } = useParams()
    const [blogComments, setBlogComments] = useState([])
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        const FetchBlogComments = async () => {
            try {
                const response = await GetApi(`${Apis.admin.blog_comments}/${id}`)
                if (response.status === 200) {
                    setBlogComments(response.msg)
                }
            } catch (error) {
                //
            } finally {
                setDataLoading(false)
            }
        }
        FetchBlogComments()
    }, [])

    return (
        <PageLayout>
            <div className='py-1 bg-dark w-full text-white'>
                <div className="w-11/12 mx-auto">
                    <div className="w-full p-5 rounded-md">
                        <Link to={`/blogs/${feature}/${id}/${slug}`}
                            className="flex mb-5 w-fit px-4 py-1 rounded-2xl items-center gap-2 bg-ash">
                            <FaLongArrowAltLeft className='text-white text-2xl' />
                            <div>back</div>
                        </Link>
                        <div className="mt-10 mb-5 poppins font-bold text-xl">All comments</div>
                        <div className="ml-5 lg:ml-10">
                            {dataLoading ?
                                <div className='flex flex-col gap-3 animate-pulse'>
                                    <div className='flex gap-2'>
                                        <div className='bg-slate-400 h-10 w-10 rounded-full'></div>
                                        <div className='flex flex-col gap-3 mt-1'>
                                            <div className='bg-slate-400 w-24 h-3 rounded-full'></div>
                                            <div className='bg-slate-400 w-14 h-1.5 rounded-full'></div>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-1.5 w-full'>
                                        {new Array(3).fill(0).map((_, i) => (
                                            <div key={i} className='w-full h-0.5 rounded-full bg-slate-500'></div>
                                        ))}
                                    </div>
                                </div>
                                :
                                <>
                                    {blogComments.length > 0 &&
                                        <>
                                            {blogComments.map((item, i) => (
                                                <div key={i} className="mb-5 w-full">
                                                    <div className="flex items-start  gap-2">
                                                        <div className="p-2 rounded-full bg-white ">
                                                            <FaUser className='text-primary text-2xl' />
                                                        </div>
                                                        <div className="flex items-start flex-col  text-base">
                                                            <div className="text-white font-bold lg:text-xl">{item?.username}</div>
                                                            <div className="text-xs text-gray-500">{moment(item?.createdAt).fromNow()}</div>
                                                        </div>
                                                    </div>
                                                    <div className="poppins mt-2 text-gray-400">{item?.content}</div>
                                                </div>
                                            ))}
                                        </>
                                    }
                                </>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default BlogComments