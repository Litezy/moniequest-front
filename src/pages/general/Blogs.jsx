import React, { useEffect, useMemo, useState } from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { GiArrowScope } from "react-icons/gi";
import BlogDiv from '../../GeneralComponents/BlogDiv';
import { Link } from 'react-router-dom';
import { MoveToTop } from '../../utils/pageUtils';
import { Apis, GetApi } from '../../services/API';
import empty from '../../assets/images/empty.webp'


const Blogs = () => {
    const [blogs, setBlogs] = useState([])
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        const FetchAllBlogs = async () => {
            try {
                const response = await GetApi(Apis.admin.all_blogs)
                if (response.status === 200) {
                    setBlogs(response.msg)
                }
            } catch (error) {
                //
            } finally {
                setDataLoading(false)
            }
        }
        FetchAllBlogs()
    }, [])

    const airdropBlogs = useMemo(() => {
        return blogs.filter((ele) => ele.feature === 'airdrop');
    }, [blogs])
    const tradingBlogs = useMemo(() => {
        return blogs.filter((ele) => ele.feature === 'trading');
    }, [blogs])
    const personalFinanceBlogs = useMemo(() => {
        return blogs.filter((ele) => ele.feature === 'personal_finance');
    }, [blogs])

    return (
        <PageLayout>
            <div className='pb-20 bg-dark w-full text-gray-200'>
                <div className=''>
                    <div className='w-full h-full  py-5'>
                        <div className='md:text-4xl text-2xl capitalize font-bold text-white text-center'>blogs</div>
                    </div>
                </div>
                <div className='w-11/12 mx-auto py-10'>
                    {dataLoading ?
                        <div className='flex flex-col gap-4 animate-pulse'>
                            <div className='flex gap-5 items-center'>
                                <div className='flex gap-3 items-center'>
                                    <div className='w-5 h-5 rounded-full bg-slate-400'></div>
                                    <div className='w-56 h-4 rounded-full bg-slate-400'></div>
                                </div>
                                <div className='w-20 h-3 rounded-full bg-slate-400 mx-4'></div>
                            </div>
                            <div className='grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-4'>
                                {new Array(4).fill(0).map((_, i) => (
                                    <div key={i} className='w-full bg-black rounded-xl p-2'>
                                        <div className=" bg-gray-500 h-40 rounded-xl w-full"></div>
                                        <div className="mt-2 flex items-start flex-col gap-3  ">
                                            <div className=" rounded-sm h-3 w-1/2  bg-gray-500"></div>
                                            <div className="h-10 bg-gray-500 w-full"></div>
                                            <div className="flex items-center gap-2 w-full ">
                                                <div className="bg-gray-500 h-10 w-12 rounded-full"></div>
                                                <div className="flex flex-col gap-1 w-full">
                                                    <div className="bg-gray-500 w-1/2 h-3"></div>
                                                    <div className="bg-gray-500 w-1/2 h-3"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        :
                        <>
                            {blogs.length > 0 ?
                                <div className='flex flex-col gap-16 poppins'>
                                    {airdropBlogs.length > 0 &&
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center md:gap-5 md:justify-normal justify-between">
                                                <div className='flex gap-3 items-center'>
                                                    <div className="text-xl"><GiArrowScope /></div>
                                                    <div className="text-lg">Latest articles on Airdrops</div>
                                                </div>
                                                <Link
                                                    to={`/blogs/airdrop`} onClick={MoveToTop}
                                                    className="w-fit px-4 text-xl hover:text-lightgreen text-center">view all</Link>
                                            </div>
                                            <div className="w-full grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                                                {airdropBlogs.slice(0, 10).map((item, i) => (
                                                    <BlogDiv key={i} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    {tradingBlogs.length > 0 &&
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center md:gap-5 md:justify-normal justify-between">
                                                <div className='flex gap-3 items-center'>
                                                    <div className="text-xl"><GiArrowScope /></div>
                                                    <div className="text-lg">Latest articles on Trading</div>
                                                </div>
                                                <Link
                                                    to={`/blogs/trading`} onClick={MoveToTop}
                                                    className="w-fit px-4 text-xl hover:text-lightgreen text-center">view all</Link>
                                            </div>
                                            <div className="w-full grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                                                {tradingBlogs.slice(0, 10).map((item, i) => (
                                                    <BlogDiv key={i} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    {personalFinanceBlogs.length > 0 &&
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center md:gap-5 md:justify-normal justify-between">
                                                <div className='flex gap-3 items-center'>
                                                    <div className="text-xl"><GiArrowScope /></div>
                                                    <div className="text-lg">Latest articles on Personal Finance</div>
                                                </div>
                                                <Link
                                                    to={`/blogs/personal_finance`} onClick={MoveToTop}
                                                    className="w-fit px-4 text-xl hover:text-lightgreen text-center">view all</Link>
                                            </div>
                                            <div className="w-full grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                                                {personalFinanceBlogs.slice(0, 10).map((item, i) => (
                                                    <BlogDiv key={i} item={item} />
                                                ))}
                                            </div>
                                        </div>
                                    }
                                </div>
                                :
                                <div className='flex gap-1 items-center justify-center'>
                                    <div className='text-center'>No blogs published yet...</div>
                                    <img src={empty} alt='empty img' className='size-8'></img>
                                </div>
                            }
                        </>

                    }
                </div>
            </div >
        </PageLayout >
    )
}

export default Blogs