import React from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link } from 'react-router-dom'

const AdminUtils = () => {
    const links = [
        { path: 'Update Cryptocurrencies', url: '/admin/utilities/update_cryptos' },
        { path: 'Testimonials', url: '/admin/utilities/testimonials' },
        { path: 'Filter Comments', url: '/admin/utilities/filter_blogs' },
        { path: 'Create Tools', url: '/admin/utilities/create_tools' },
    ]

    return (
        <AdminPageLayout>
            <div className='w-11/12 mx-auto'>
                <div className='w-full mx-auto'>
                    <div className="w-full text-center text-xl font-bold">Manage Utils on MonieQuest</div>
                    <div className="my-10  mx-auto flex flex-col items-start gap-5">
                        {links.map((item, i) => (
                            <Link to={item.url} className="h-20 w-full flex items-center p-5 rounded-md justify-between bg-white" key={i}>
                                <div className="text-base md:text-lg text-dark font-bold">{item.path}</div>
                                <div
                                    className="px-5 py-2 rounded-lg bg-primary w-fit text-white cursor-pointer">
                                    Proceed
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminUtils