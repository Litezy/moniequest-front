import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import AdminPageLayout from './AdminPageLayout'

const airdropsLinks = [
    { path: 'create', url: '/admin/airdrops/create' },
    { path: 'airdrops', url: '/admin/airdrops/all' },
]

const AirdropsLayout = ({ children }) => {
    const location = useLocation()

    return (
        <AdminPageLayout>
            <div className="w-11/12 lg:w-2/3 mx-auto bg-[#1d1e30] rounded-md p-1.5 gap-10 flex items-center justify-center">
                {airdropsLinks.map((item, i) => (
                    <Link to={item.url} className={`cursor-pointer w-full py-3 uppercase ${location.pathname === item.url ? 'bg-white text-dark rounded-md' : ''} text-center `} key={i}>{item.path}</Link>
                ))}
            </div>
            <div className='mt-10'>
                {children}
            </div>
        </AdminPageLayout>
    )
}

export default AirdropsLayout