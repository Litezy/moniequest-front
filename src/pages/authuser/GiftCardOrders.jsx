import React, { useCallback, useEffect, useState } from 'react'
import Giftcards from '../../AuthComponents/Giftcards'
import GiftComp from '../../AuthComponents/GiftComp'
import { Apis, AuthGetApi } from '../../services/API'
import { Link } from 'react-router-dom'

const GiftCardOrders = () => {
    const [data, setData] = useState([])
    
    const fetchOrders = useCallback(async () => {
        const res = await AuthGetApi(Apis.transaction.giftcard_orders)
        if (res.status !== 200) {
            console.log(res.msg)
            return;
        }
        const data = res.data
        setData(data)
    })
    useEffect(() => {
        fetchOrders()
    }, [])


    return (
        <Giftcards>
            <div className="w-11/12 mx-auto">
                <div className="my-5 text-2xl font-bold lg:text-center ">Recent Orders</div>
                <div className="mt-10">
                    <div className="mb-5 text-sm ">NB: Completed Orders are found in the <Link to={`/user/transactions_history`} className='text-indigo-500'>Transactions history</Link></div>
                    {data.length > 0 ? data.map((trans, i) => {
                        return (
                            <GiftComp key={i} trans={trans} />
                        )
                    }) :
                        <div className="">No orders found</div>}
                </div>
            </div>
        </Giftcards>
    )
}

export default GiftCardOrders