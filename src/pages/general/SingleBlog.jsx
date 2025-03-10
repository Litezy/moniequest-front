import React, { useCallback, useEffect, useState } from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { CiLink } from "react-icons/ci";
import { IoChevronForwardSharp } from "react-icons/io5";
import FormInput from '../../utils/FormInput';
import Comments from '../../GeneralComponents/Comments';
import { Link, useParams } from 'react-router-dom';
import { Apis, GetApi, imageurl, PostApi } from '../../services/API';
import avatar from '../../assets/images/avatar.svg'
import moment from 'moment';
import { ErrorAlert, MoveToSection, MoveToTop, SuccessAlert, } from '../../utils/pageUtils';
import BlogDiv from '../../GeneralComponents/BlogDiv';
import Loader from '../../GeneralComponents/Loader';


const SingleBlog = () => {
    const { feature, id } = useParams()
    const [singleBlog, setSingleBlog] = useState({})
    const [relatedBlogs, setRelatedBlogs] = useState([])
    const [dataLoading, setDataLoading] = useState(true)
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        username: '',
        email: '',
        phone: '',
        content: ''
    })
    const formHandler = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        })
    }

    const FetchSingleBlog = useCallback(async () => {
        try {
            const response = await GetApi(`${Apis.admin.single_blog}/${id}`)
            if (response.status === 200) {
                setSingleBlog(response.msg)
            }

        } catch (error) {
            //
        } finally {
            setDataLoading(false)
        }
    }, [id])


    const FetchRelatedBlogs = async () => {
        try {
            const response = await GetApi(`${Apis.admin.related_blogs}/${feature}/${id}`)
            if (response.status === 200) {
                setRelatedBlogs(response.msg)
            }
        } catch (error) {
            //
        }
    }

    useEffect(() => {
        FetchSingleBlog()
        FetchRelatedBlogs()
    }, [FetchSingleBlog, id])


    const SubmitComment = async (e) => {
        e.preventDefault()

        if (!form.username || !form.email || !form.content) return ErrorAlert('Enter all required fields')
        const formbody = {
            blog_id: singleBlog.id,
            email_address: form.email,
            username: form.username,
            phone_number: form.phone,
            content: form.content
        }

        setLoading(true)
        try {
            const response = await PostApi(Apis.admin.add_comment, formbody)
            if (response.status === 200) {
                FetchSingleBlog()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(response.msg)
                setForm({
                    username: '',
                    email: '',
                    phone: '',
                    content: ''
                })
            } else {
                ErrorAlert(response.msg)
            }
        } catch (error) {
            ErrorAlert(`${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const parapgraphs = [
        {
            title: singleBlog?.main_header_title,
            sectionID: 'main'
        },
        {
            title: singleBlog?.first_paragraph_title,
            sectionID: 'first'
        },
        {
            title: singleBlog?.second_paragraph_title,
            sectionID: 'second'
        },
        {
            title: singleBlog?.extras_title,
            sectionID: 'extras'
        },
        {
            title: `conclusion`,
            sectionID: 'conclusion'
        },
    ]

    return (
        <PageLayout>
            <div className='w-full bg-dark py-10 text-white'>
                {dataLoading ?
                    <div className='w-11/12 mx-auto'>
                        <div className='flex items-start lg:gap-6 gap-10 flex-col lg:flex-row animate-pulse'>
                            <div className='flex flex-col gap-12 lg:w-[30%] w-full p-2'>
                                <div className='w-full h-52 bg-slate-500 rounded-xl'></div>
                                <div className='flex flex-col gap-6'>
                                    <div className='bg-slate-500 w-52 h-4 rounded-full'></div>
                                    <div className='flex flex-col gap-4'>
                                        {new Array(4).fill(0).map((_, i) => (
                                            <div key={i} className='w-36 h-2 bg-slate-500 rounded-full'></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className='lg:w-[70%] w-full'>
                                <div className='flex justify-between w-full'>
                                    <div className='flex gap-2'>
                                        <div className='w-10 h-10 rounded-full bg-slate-500'></div>
                                        <div className='flex flex-col gap-2.5'>
                                            <div className='w-28 h-2 bg-slate-500 rounded-full'></div>
                                            <div className='w-36 h-1.5 bg-slate-500 rounded-full'></div>
                                            <div className='w-32 h-1.5 bg-slate-500 rounded-full'></div>
                                        </div>
                                    </div>
                                    <CiLink className='text-3xl text-sky-400' />
                                </div>
                                <div className='flex flex-col gap-3 mt-8'>
                                    <div className='w-3/4 h-5 bg-slate-500 rounded-full'></div>
                                    <div className='flex gap-2 items-center'>
                                        <div className='w-14 h-1.5 bg-slate-500 rounded-full'></div>
                                        <IoChevronForwardSharp className='text-slate-500' />
                                        <div className='w-14 h-1.5 bg-slate-500 rounded-full'></div>
                                    </div>
                                </div>
                                <div className='flex flex-col gap-12 mt-14'>
                                    {new Array(2).fill(0).map((_, i) => (
                                        <div key={i} className='flex flex-col gap-5'>
                                            <div className='w-48 h-4 bg-slate-500 rounded-full'></div>
                                            <div className='flex flex-col gap-2'>
                                                {new Array(8).fill(0).map((_, i) => (
                                                    <div key={i} className='w-full h-0.5 rounded-full bg-slate-500'></div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className="w-11/12 mx-auto">
                        <div className="w-full flex items-start lg:gap-6 gap-10 flex-col lg:flex-row">
                            <div className="lg:w-[30%] w-full">
                                <div className="flex items-start flex-col gap-12">
                                    <img src={singleBlog?.image} alt="blog image" className="w-full rounded-xl max-h-52 object-cover object-center " />
                                    <div className="w-full flex items-start flex-col gap-2">
                                        <div className="poppins font-bold text-2xl">Table of contents</div>
                                        {parapgraphs.map((item, i) => {
                                            return (
                                                <div onClick={() => MoveToSection(item.sectionID, 100)} key={i} className={`cursor-pointer capitalize hover:text-lightgreen poppins `}>{item.title}</div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="lg:w-[70%] w-full">
                                <div className="flex items-start w-full justify-between">
                                    <div className="flex items-start gap-2">
                                        <img src={singleBlog?.blog_user?.image ? singleBlog?.blog_user?.image : avatar} loading='lazy' alt="blog" className=" rounded-full h-10 w-10 object-cover " />
                                        <div className="flex items-start flex-col gap-1 text-sm">
                                            <div className="poppins capitalize">{singleBlog?.blog_user?.first_name} {singleBlog?.blog_user?.surname}</div>
                                            <div className="text-xs poppins text-gray-400">Updated on {moment(singleBlog?.updatedAt).format('D MMM YYYY hh:mm a')}</div>
                                            <div className="text-xs poppins text-gray-400">Written on {moment(singleBlog?.createdAt).format('D MMM YYYY  hh:mm a')}</div>
                                        </div>
                                    </div>
                                    <div className="">
                                        <CiLink className='text-3xl text-sky-400' />
                                    </div>
                                </div>
                                <div className='flex flex-col gap-3 mt-5'>
                                    <div className="text-[1.8rem] leading-[33px] font-bold max-w-3/4">{singleBlog?.title}</div>
                                    <div className="text-sky-400 text-sm flex items-center gap-2">
                                        <div className="">blogs</div>
                                        <div className=""><IoChevronForwardSharp /></div>
                                        <div className=" lowercase">{singleBlog?.feature === 'personal_finance' ? 'personal finance' : singleBlog.feature}</div>
                                    </div>
                                </div>
                                <div className="flex items-start poppins flex-col gap-12 mt-10 text-gray-400">
                                    <div className='flex flex-col gap-2 items-start' id='main'>
                                        <div className="text-[1.8rem] leading-[33px] capitalize font-bold poppins text-white"> {singleBlog?.main_header_title}</div>
                                        <div className="">{singleBlog?.main_header_content}</div>
                                    </div>
                                    <div className="flex items-start gap-2 flex-col " id='first'>
                                        <div className="text-white font-bold capitalize leading-[33px] text-2xl poppins ">{singleBlog?.first_paragraph_title}</div>
                                        <div className="">{singleBlog?.first_paragraph_content}</div>
                                    </div>
                                    <div className='flex flex-col gap-8'>
                                        <div className="flex items-start gap-2 flex-col" id='second'>
                                            <div className="text-white font-bold capitalize leading-[33px] poppins  text-2xl">{singleBlog?.second_paragraph_title}.</div>
                                            <div className="">{singleBlog?.second_paragraph_content}</div>
                                        </div>
                                        {singleBlog?.second_paragraph_image && <div className="flex items-center justify-center" id='second'>
                                            <img src={singleBlog?.second_paragraph_image} alt="second image" className="w-auto rounded-xl md:max-h-[20rem] object-cover object-center" />
                                        </div>}
                                    </div>
                                    <div className='flex flex-col gap-8'>
                                        <div className="flex items-start gap-2 flex-col" id='extras'>
                                            <div className="text-white font-bold capitalize leading-[33px] poppins  text-2xl">{singleBlog?.extras_title}</div>
                                            <div className="">{singleBlog?.extras_content}</div>
                                        </div>
                                        {singleBlog?.extras_image && <div className="flex items-center justify-center" id='second'>
                                            <img src={singleBlog?.extras_image} alt="extras image" className="w-auto rounded-xl md:max-h-[20rem] object-cover object-center " />
                                        </div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 flex-col mt-10 mb-5" id='conclusion'>
                            <div className="text-white font-bold leading-[33px] text-2xl poppins ">Conclusion</div>
                            <div className="text-gray-400 poppins">{singleBlog?.conclusion}</div>
                        </div>

                        <div className="w-full my-10">
                            <div className="poppins text-lg font-bold mb-5">Comments</div>
                            {Object.values(singleBlog).length !== 0 && singleBlog.blog_comments.length > 0 ?
                                <div className='flex flex-col gap-5'>
                                    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-5">
                                        {singleBlog.blog_comments.slice(0, 8).map((item, i) => (
                                            <Comments key={i} item={item} />
                                        ))}
                                    </div>
                                    {singleBlog.blog_comments.length > 1 &&
                                        <Link to={`/blogs/${singleBlog.feature}/${singleBlog.id}/comments`} onClick={MoveToTop}>
                                            <button className="w-fit px-4 py-1 rounded-md bg-ash text-white">see all comments</button>
                                        </Link>
                                    }
                                </div>
                                :
                                <div>Be the first to comment on this blog!</div>
                            }
                        </div>
                        <form className="lg:w-5/6 w-full p-4 rounded-md bg-primary relative" onSubmit={SubmitComment}>
                            {loading && <Loader />}
                            <div className="text-lg mont">Leave a comment</div>
                            <div className="flex mt-4 flex-col gap-5 w-full lg:w-11/12">
                                <div className="flex items-center flex-col lg:flex-row gap-5">
                                    <div className="w-full">
                                        <FormInput label={`Username`} placeholder='Username' name='username' value={form.username} onChange={formHandler} />
                                    </div>
                                    <div className="w-full">
                                        <FormInput label={`Email Address`} type='email' name='email' placeholder='Email address' value={form.email} onChange={formHandler} />
                                    </div>
                                    <div className="w-full">
                                        <FormInput label={`Phone number (Optional)`} name='phone' placeholder='Phone number' value={form.phone} onChange={formHandler} />
                                    </div>
                                </div>
                                <div className="w-full flex-col  flex items-start gap-2">
                                    <div className="text-base">Comment</div>
                                    <textarea
                                        className='resize-y w-full max-h-52 min-h-24 p-2 rounded-md bg-primary' placeholder='enter your comment'
                                        name="content" value={form.content} onChange={formHandler}></textarea>
                                </div>
                                <div className="w-1/2 flex items-center justify-center ml-auto">
                                    <button className='w-full bg-ash hover:bg-ash/90 rounded-md py-2'>Submit</button>
                                </div>
                            </div>
                        </form>
                        {relatedBlogs.length > 0 ?
                            <div className="mt-10 flex flex-col gap-3">
                                <div className="text-lg">You may also like:</div>
                                <div className="w-full flex items-center gap-3 overflow-x-auto scroll">
                                    {relatedBlogs.map((item, i) => (
                                        <BlogDiv item={item} key={i} className={`!w-64 flex-none`} />
                                    ))}
                                </div>
                            </div>
                            :
                            <div className='mt-10'>No related blogs found...</div>
                        }
                    </div>
                }
            </div>

        </PageLayout>
    )
}

export default SingleBlog