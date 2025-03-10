import React, { useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link } from 'react-router-dom'
import { Apis, AuthGetApi } from '../../services/API'
import ModalLayout from '../../utils/ModalLayout'
import Loader from '../../GeneralComponents/Loader'

const AdminFilterBlogs = () => {

  const [blogs, setBlogs] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  useEffect(() => {
    const FetchAllBlogs = async () => {
      setDataLoading(true)
      try {
        const response = await AuthGetApi(Apis.admin.blogs_with_comments)
        if (response.status === 200) {
          setBlogs(response.data)
        }

      } catch (error) {
        console.log(error)
      } finally {
        setDataLoading(false)
      }
    }
    FetchAllBlogs()
  }, [])
  return (
    <AdminPageLayout>
      <div className="w-11/12 mx-auto">
        <Link className='px-3 py-1.5 rounded-md bg-ash text-white'
          to={`/admin/utilities`}>back to utilities</Link>
        <div className="mt-10 text-base md:text-xl font-bold">Below are blogs that have comments</div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {blogs.length > 0 ? blogs.map((blog, i) => (
            <div key={i} className="w-full p-3 border border-ash rounded-md mt-5">
              <div className="flex w-full items-baseline justify-between">
                <div className="">
                  <div className="text-base font-bold">{blog.title.slice(0,40)}...</div>
                  <div className="text-sm">{blog.main_header_title}</div>
                  <div className="text-sm">Comments: {blog.blog_comments.length}</div>
                </div>
                <div className="">
                  <Link 
                  to={`/admin/utilities/filter_blogs/${blog.id}`}
                  className='px-4 rounded-md w-fit py-1.5 truncate bg-ash text-white'>Explore Comments</Link>
                  </div>
              </div>
            </div>
          )) : <div className="text-center mt-20 text-sm ">No blogs with comments found!</div>}
          {dataLoading &&
            <ModalLayout setModal={setDataLoading}>
              <Loader title='loading blogs' />
            </ModalLayout>
          }
        </div>
      </div>
    </AdminPageLayout>
  )
}

export default AdminFilterBlogs