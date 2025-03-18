import React, { useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link } from 'react-router-dom'

const AdminAllUsers = () => {

    const userHeaders = [
        { title: 'Users Details', id: 1, url: '/admin/all_users/user_details' },
        { title: 'User Banks', id: 2, url: '/admin/all_users/user_banks' },
        { title: 'Users KYC Applications', id: 3, url: '/admin/all_users/submitted_kycs' },
        { title: 'Verified Users', id: 4, url: '/admin/all_users/verified_kycs' },
        { title: 'Create Users', id: 5, url: '/admin/all_users/create_user' },
        { title: 'Subscribers', id: 6, url: '/admin/all_users/subscribers' },
    ]


    return (
        <AdminPageLayout>
            <div className='w-11/12 mx-auto'>
                <div className='w-full mx-auto'>
                    <div className="w-full text-center text-xl font-bold">Manage Users on MonieQuest</div>
                    <div className="my-10  mx-auto flex flex-col items-start gap-5">
                        {userHeaders.map((item, i) => (
                            <Link to={item.url} className="h-20 w-full flex items-center p-5 rounded-md justify-between bg-white" key={i}>
                                <div className="text-base text-dark font-bold">{item.title}</div>
                                <div
                                    className="px-5 py-2 rounded-lg bg-primary w-fit text-white cursor-pointer">
                                    view more
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminAllUsers