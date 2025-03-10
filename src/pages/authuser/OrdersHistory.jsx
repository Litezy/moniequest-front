import React, { useCallback, useEffect, useState } from 'react'
import { Apis, AuthGetApi } from '../../services/API'
import OrderComp from '../../AuthComponents/OrderComp'
import { Link } from 'react-router-dom'
import ExchangeLayout from '../../AuthComponents/ExchangeLayout'

const BuyOrdersHistory = () => {
    const [data, setData] = useState([])
    
    const fetchOrders = useCallback(async () => {
        const res = await AuthGetApi(Apis.transaction.crypto_order_history)
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
        <ExchangeLayout>
            <div className="w-11/12 mx-auto">
                <div className="my-5 text-2xl font-bold lg:text-center ">Recent Orders</div>
                <div className="mt-10">
                    <div className="mb-5 text-sm ">NB: Completed Orders are found in the <Link to={`/user/transactions_history`} className=''>Transactions history</Link></div>
                    {data ? data.map((trans, i) => {
                        return (
                            <OrderComp key={i} trans={trans} />
                        )
                    }) :
                        <div className="">No orders found</div>
                    }
                </div>
            </div>
        </ExchangeLayout>
    )
}

export default BuyOrdersHistory