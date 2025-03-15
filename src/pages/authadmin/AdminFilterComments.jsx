import React, { useEffect, useState } from 'react'
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

    useEffect(() => {
        const FetchBlogComments = async () => {
            setDataLoading({ status: true, msg: 'loading comments' })
            try {
                const response = await GetApi(`${Apis.admin.blog_comments}/${id}`)
                if (response.status === 200) {
                    setComments(response.msg)
                }
            } catch (error) {
                console.log(error)
            } finally {
                setDataLoading(false)
            }
        }
        FetchBlogComments()
    }, [])


    const deleteComment = async () => {
        const data = { id: commentId }
        setModal(false)
        setDataLoading({ status: true, msg: 'deleting comment' })
        try {
            const response = await AuthPostApi(Apis.admin.delete_comment, data)
            if (response.status !== 200) return ErrorAlert(response.msg)
            setComments(comments.filter(comment => comment.id !== commentId))
            await new Promise(resolve => setTimeout(resolve, 2000))
            SuccessAlert(response.msg)
        } catch (error) {
            console.log(error)
        } finally {
            setDataLoading(false)
        }
    }
    return (
        <AdminPageLayout>
            {dataLoading.status &&
                <ModalLayout setModal={setDataLoading}>
                    <Loader title={dataLoading.msg} />
                </ModalLayout>
            }
            {modal &&
                <ModalLayout setModal={setModal} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                    <div className="p-5  bg-white text-dark shadow-xl rounded-md">
                        <div className="text-base text-center mb-3">Are you sure you want to delete this comment?</div>

                        <div className="flex items-center justify-between">
                            <button onClick={() => setModal(false)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Cancel</button>
                            <button onClick={deleteComment} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm Decline</button>
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
                            {comments.map((comment, index) => (
                                <div key={index} className="bg-white text-dark shadow-md rounded-md p-5 mt-3">
                                    <div className="flex items-start flex-col md:flex-row justify-between">
                                        <div className="w-full md:w-5/6">
                                            <h1 className="text-lg font-bold">{comment.username}</h1>
                                            <p className="text-sm">{comment.content}</p>
                                        </div>
                                        <button onClick={() => setModal(true)} onMouseOver={() => setCommentId(comment?.id)} className='w-fit px-4 py-1.5 bg-red-600 text-white rounded-md'>Delete</button>
                                    </div>
                                </div>
                            ))}
                        </div>
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