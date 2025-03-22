import React, { useCallback, useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import TestimonialDiv from '../../AdminComponents/TestimonialDiv'
import { Apis, AuthGetApi } from '../../services/API'
import Loader from '../../GeneralComponents/Loader'
import { Link } from 'react-router-dom'

const AdminTestimonials = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState([])

    const fetchTestimonials = useCallback(async () => {
        setLoading(true)
        try {
            const res = await AuthGetApi(Apis.user.get_testimonials);
            if (res.status !== 200) return;
            const data = res.data;
            setData(data);
            return data;
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally { setLoading(false) }
    }, [])

    useEffect(() => {
        fetchTestimonials()
    }, [fetchTestimonials]);
    
    return (
        <AdminPageLayout>
            {loading ?
                <Loader title={`loading`} />
                :
                <div className="w-11/12 mx-auto mb-10 ">
                    <div className=" text-center text-3xl mb-5 font-bold text-">Testimonials</div>
                    <div className="flex items-center justify-between w-full">
                        <Link to={`/admin/utilities`} className='px-4 py-1.5 rounded-md bg-ash'>back to utilities</Link>
                        {data?.length <= 6 && <Link to={`/admin/utilities/testimonials/create`}
                            className="px-4 py-2 rounded-md text-sm text-primary bg-white">Create New Testimonial</Link>}
                    </div>

                    <div className="mt-10 capitalize">below are current testimonials on monieQuest</div>
                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
                        {data && data.length > 0 ? data.map((item, i) => (
                            <TestimonialDiv fetchTestimonials={fetchTestimonials} item={item} key={i} />
                        )) :
                            <div className="">No testimonials uploaded </div>
                        }
                    </div>
                </div>
            }
        </AdminPageLayout>
    )
}

export default AdminTestimonials