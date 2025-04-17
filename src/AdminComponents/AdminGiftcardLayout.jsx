import React from 'react'
import AdminPageLayout from './AdminPageLayout'
import { Link, useLocation } from 'react-router-dom'

const AdminGiftcardLayout = ({ children }) => {

    const tags = [
        { path: 'orders', url: '/admin/giftcards/orders' },
        { path: 'completed', url: '/admin/giftcards/completed_orders' },
    ]
    const location = useLocation()
    
    return (
        <AdminPageLayout>
            <div className="w-11/12 lg:w-2/3 mx-auto bg-[#1d1e30] rounded-md p-1.5 gap-10 flex items-center justify-center">
                {tags.map((item, i) => (
                    <Link to={item.url} className={`cursor-pointer w-full py-3 uppercase ${location.pathname === item.url || location.pathname.includes(item.main) ? 'bg-white text-dark rounded-md' : ''} text-center `} key={i}>{item.path}</Link>
                ))}
            </div>
            <div className='mt-5'>
                {children}
            </div>
        </AdminPageLayout>
    )
}

export default AdminGiftcardLayout