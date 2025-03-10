import React, { useEffect, useState } from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { useParams } from 'react-router-dom'
import { GiArrowScope } from 'react-icons/gi'
import BlogDiv from '../../GeneralComponents/BlogDiv'
import { Apis, GetApi } from '../../services/API'

const FeatureBlogs = () => {
    const { feature } = useParams()
    const [featureBlogs, setFeatureBlogs] = useState([])
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        const FetchFeatureBlogs = async () => {
            try {
                const response = await GetApi(`${Apis.admin.feature_blogs}/${feature}`)
                if (response.status === 200) {
                    setFeatureBlogs(response.msg)
                }

            } catch (error) {
                //
            } finally {
                setDataLoading(false)
            }
        }
        FetchFeatureBlogs()
    }, [])

    return (
        <PageLayout>
            <div className="bg-dark py-1 w-full text-white">
                <div className="w-11/12 mx-auto my-10 poppins">
                    {dataLoading ?
                        <div className='flex flex-col gap-4 animate-pulse'>
                            <div className='flex gap-3 items-center'>
                                <div className='w-5 h-5 rounded-full bg-slate-400'></div>
                                <div className='w-56 h-4 rounded-full bg-slate-400'></div>
                            </div>
                            <div className='grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4'>
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
                        <div className='flex flex-col gap-4'>
                            <div className="flex items-center gap-5 w-11/12 lg:w-1/2 ">
                                <div className="text-xl"><GiArrowScope /></div>
                                <div className="text-lg capitalize">Latest articles on {feature === 'personal_finance' ? "Personal Finance" : feature}</div>
                            </div>
                            {featureBlogs.length > 0 ?
                                <div className="w-full grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
                                    {featureBlogs.map((item, i) => (
                                        <BlogDiv key={i} item={item} />
                                    ))}
                                </div>
                                :
                                <div>No {feature} blogs published yet...</div>
                            }
                        </div>
                    }
                </div>
            </div>
        </PageLayout>
    )
}

export default FeatureBlogs