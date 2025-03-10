import React, { useCallback, useEffect, useState } from 'react'
import AuthPageLayout from './AuthPageLayout'
import { Link, useLocation } from 'react-router-dom'
import { Apis, AuthGetApi } from '../services/API'

const Giftcards = ({ children }) => {
 
  const [ordersNotify, setOrdersNotify] = useState([])
  const fetchOrders = useCallback(async () => {
    const res = await AuthGetApi(Apis.transaction.giftcard_orders)
    if (res.status !== 200) {
      console.log(res.msg)
      return;
    }
    const data = res.data
    setOrdersNotify(data)
  })
  useEffect(() => {
    fetchOrders()
  }, [])
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes('/giftcards')) {
      fetchOrders();
    }
  }, [location.pathname]);
  const links = [
    { path: 'sell', url: '/user/giftcards/sell' },
    { path: 'orders', url: '/user/giftcards/orders', order: ordersNotify && ordersNotify.length > 0 ? true : false },
  ]

  return (
    <AuthPageLayout>
      <div className="w-11/12 lg:w-2/3 mx-auto bg-[#1d1e30] rounded-md p-1.5 gap-10 flex items-center justify-center">
        <div className="w-full grid grid-cols-2 relative">
          {links.map((item, i) => (
            <Link to={item.url} className={`cursor-pointer w-full relative py-3 uppercase ${location.pathname === item.url ? 'bg-white text-dark rounded-md' : ''} text-center `} key={i}>{item.path}
              {item.order && <span className='w-2 h-2  absolute top-2 rounded-full bg-red-600'></span>}</Link>
          ))}
        </div>
      </div>
      <div className='mt-5'>
        {children}
      </div>
    </AuthPageLayout>
  )
}

export default Giftcards