import React, { useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import { SUBS } from '../../services/store'
import moment from 'moment'

const AdminSubscribers = () => {
    const TableHeaders = ['Email', 'Phone Number', 'Date']
    const [subs] = useAtom(SUBS)
    const [visibleCount, setVisibleCount] = useState(10)

    return (
        <AdminPageLayout>
            <div className="w-full">
                <div className="w-11/12 mx-auto">
                    <Link className='px-3 py-1.5 rounded-md bg-ash text-white'
                        to={`/admin/all_users`}>back to all users</Link>
                    <div className="mt-10 w-full">
                        <div className="my-10 text-center text-xl md:text-2xl font-bold">Below are Subcribers on MonieQuest</div>

                        <div className="relative overflow-x-auto rounded-md mt-10">
                            <table className="w-full text-sm text-left rtl:text-right">
                                <thead className=" bg-primary lg:text-xl text-base text-white">
                                    <tr >
                                        {TableHeaders.map((item, index) => (
                                            <th scope="col" key={index} className="px-3 py-3 text-sm truncate">
                                                {item}
                                            </th>
                                        ))}
                                    </tr>


                                </thead>
                                <tbody>
                                    {subs.length > 0 ?
                                        subs.slice(0, visibleCount).map((item, i) => (
                                            <tr className=" border-b " key={i}>
                                                <td className="px-3 truncate py-3">
                                                    {item.email}
                                                </td>

                                                <td className="px-3  py-3 truncate">
                                                    {item.phone_number}
                                                </td>
                                                <td className="px-3  py-3 truncate">
                                                    {moment(item.createdAt).format(`DD-MM-YYYY a`)}
                                                </td>

                                            </tr>
                                        )) :
                                        <tr className=" w-full truncate text-lg font-semibold">
                                            <td colSpan="5" className='text-center py-2'>No subscribers found</td>
                                        </tr>
                                    }
                                </tbody>
                            </table>
                        </div>
                        {visibleCount < subs.length &&
                            <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center capitalize rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto mt-6'>show older subscribers</button>
                        }
                    </div>
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminSubscribers