import React, { useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { currencies } from '../../AuthComponents/AuthUtils'
import { Link } from 'react-router-dom'
import { Apis, AuthGetApi } from '../../services/API'
import { ErrorAlert } from '../../utils/pageUtils'
import moment from 'moment'

const AdminBankWithdrawals = () => {
    const [loading, setLoading] = useState(false)
    const [records, setRecords] = useState([])


    const fetchWithdrawals = async () => {
        setLoading(true)
        try {
            const res = await AuthGetApi(Apis.admin.get_bank_withdrawals)
            if (res.status !== 200) return ErrorAlert(res.msg)
            const data = res.data
            setRecords(data)
        } catch (error) {
            console.log(error)
        } finally { setLoading(false) }
    }
    useEffect(() => {
        fetchWithdrawals()
    }, []);

    const Topheaders = [`ID`, 'FullName', 'Date', 'Amount', 'Details']

    return (
        <AdminPageLayout>
            <div className='w-full'>
                <div className='w-11/12 mx-auto'>
                    <div className=" text-lg font-bold w-full text-center capitalize">See Latest withdrawal requests</div>
                    {!loading ?
                        <div className="relative overflow-x-auto rounded-md mt-10">
                            <table className="w-full text-sm text-center rtl:text-right">
                                <thead className=" bg-primary text-base poppins ">
                                    <tr>
                                        {Topheaders.map((item, i) => (
                                            <th key={i} scope="col" className="px-3 text-lightgreen py-3">{item}</th>
                                        ))}

                                    </tr>
                                </thead>
                                <tbody>
                                    {records.length > 0 ? records.map((item, i) => (
                                        <tr className=" border-b " key={i}>
                                            <th scope="row" className="px-6 text-white py-4 font-medium  whitespace-nowrap ">
                                                {item?.user_withdrawal?.id}
                                            </th>
                                            <td className="px-3 py-3">
                                                {item?.user_withdrawal?.first_name} {item?.user_withdrawal?.surname}
                                            </td>
                                            <td className="px-3 py-3 truncate">
                                                {moment(item?.createdAt).format(`DD/MM/yyyy hh:mm a`)}
                                            </td>

                                            <td className="px-3 py-3">
                                                {currencies[1].symbol}{item.amount.toLocaleString()}
                                            </td>
                                            <td className="px-3 py-3">
                                                <Link to={`${item.id}`}
                                                    className="bg-primary to-sec truncate text-white px-5 rounded-lg py-2">view details</Link>
                                            </td>

                                        </tr>
                                    )) :
                                        <tr className=" w-full text-lg  font-semibold ">
                                            <td colSpan='5' className='text-center py-2'>No withdrawal requests  </td>
                                        </tr>
                                    }

                                </tbody>
                            </table>


                        </div> :
                        <div className="w-full ">
                            <div className="mt-10 w-11/12 mx-auto">
                                {new Array(2).fill(0).map((_, i) => {
                                    return (
                                        <div key={i} className="flex animate-pulse mb-5 items-start gap-1 flex-col">

                                            <div className="w-full h-16 bg-gray-500 rounded-sm"></div>
                                        </div>
                                    )
                                })}
                                <div className="text-center">...loading</div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminBankWithdrawals