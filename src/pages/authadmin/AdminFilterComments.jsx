import React, { useCallback, useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useParams } from 'react-router-dom'
import { Apis, AuthPostApi, GetApi } from '../../services/API'
import ModalLayout from '../../utils/ModalLayout'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import Loader from '../../GeneralComponents/Loader'

const AdminFilterComments = () => {
    const { id } = useParams()
    const [comments, setComments] = useState([])
    const [dataLoading, setDataLoading] = useState({ status: false, msg: '' })
    const [modal, setModal] = useState(false)
    const [commentId, setCommentId] = useState('')
    const [visibleCount, setVisibleCount] = useState(10)

    const FetchBlogComments = useCallback(async () => {
        setDataLoading({ status: true, msg: 'loading comments' })
        try {
            const response = await GetApi(`${Apis.admin.blog_comments}/${id}`)
            if (response.status === 200) {
                setComments(response.msg)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setDataLoading({ status: false, msg: '' })
        }
    }, [])

    useEffect(() => {
        FetchBlogComments()
    }, [FetchBlogComments])


    const deleteComment = async () => {
        const data = { id: commentId }
        setModal(false)
        setDataLoading({ status: true, msg: 'deleting comment' })
        try {
            const response = await AuthPostApi(Apis.admin.delete_comment, data)
            if (response.status !== 200) return ErrorAlert(response.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            FetchBlogComments()
            SuccessAlert(response.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setDataLoading({ status: false, msg: '' })
        }
    }
    return (
        <AdminPageLayout>
            {dataLoading.status &&
                <Loader title={dataLoading.msg} />
            }
            {modal &&
                <ModalLayout setModal={setModal} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                    <div className="p-5  bg-white text-dark shadow-xl rounded-md">
                        <div className="text-base text-center mb-3">Are you sure you want to delete this comment?</div>
                        <div className="flex items-center justify-between">
                            <button onClick={() => setModal(false)} className='px-4 py-2 bg-red-600 text-white rounded-md'>Cancel</button>
                            <button onClick={deleteComment} className='px-4 py-2 bg-green-600 text-white rounded-md'>Confirm</button>
                        </div>

                    </div>
                </ModalLayout>
            }
            <div className="w-11/12 mx-auto">
                <Link className='px-3 py-1.5 rounded-md bg-ash text-white'
                    to={`/admin/utilities/filter_blogs`}>back to blogs</Link>

                {comments.length > 0 ?
                    <div className="mt-5">
                        <h1 className="text-2xl font-bold">Comments</h1>
                        <div className="mt-5">
                            {comments.slice(0, visibleCount).map((comment, index) => (
                                <div key={index} className="bg-white text-dark shadow-md rounded-md p-5 mt-3">
                                    <div className="flex items-start flex-col md:flex-row gap-4 justify-between">
                                        <div className="flex flex-col gap-4">
                                            <div className='flex flex-col'>
                                                <div className="text-lg font-bold">{comment?.username}</div>
                                                <div className='font-medium text-sm'>{comment?.email_address}</div>
                                                <div className='font-medium text-sm'>{comment?.phone_number}</div>
                                            </div>
                                            <div className="border p-1">{comment?.content}</div>
                                        </div>
                                        <button onClick={() => { setModal(true); setCommentId(comment.id) }} className='w-fit px-4 py-1.5 bg-red-700 text-white rounded-md'>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {visibleCount < comments.length &&
                            <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center capitalize rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto mt-6'>show older comments</button>
                        }
                    </div>
                    :
                    <div className="mt-5">
                        <h1 className="text-2xl font-bold">No comments found</h1>
                    </div>
                }
            </div>
        </AdminPageLayout>
    )
}

export default AdminFilterComments