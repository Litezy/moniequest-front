import React, { useEffect, useState } from 'react'
import { BiSolidToTop } from "react-icons/bi";
import { Apis, AuthGetApi } from '../../services/API';
import { currencySign } from '../../utils/pageUtils';
import moment from 'moment'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout';

const AdminLeaderboards = () => {
    const [dataLoading, setDataLoading] = useState(true)
    const [leaderboard, setLeaderboard] = useState([])

    const fetchLeaderboard = async () => {
        try {
            const res = await AuthGetApi(Apis.user.get_leaderboard)
            if (res.status !== 200) {
                setDataLoading(true)
            }
            const data = res.data
            setLeaderboard(data)
        } catch (error) {

        } finally {
            setDataLoading(false)
        }
    }
    useEffect(() => {
        fetchLeaderboard()
    }, [dataLoading])

    return (
        <AdminPageLayout>
            <div className='w-11/12 mx-auto'>
                <div className="flex justify-center w-full  items-center gap-3 mb-10">
                    <BiSolidToTop className='text-3xl text-lightgreen' />
                    <div className="md:text-2xl text-xl font-bold ">Top Traders on MonieQuest</div>
                </div>

                {dataLoading && new Array(3).fill().map((_, i) => (
                    <div key={i} className="w-full mb-5 h-16 bg-gray-500 rounded-md animate-pulse"></div>

                ))}
                {!dataLoading && <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-11/12 mx-auto text-sm text-center rounded-e-md rounded-s-md truncate rtl:text-right text-gray-400 ">
                        <thead className="text-sm bg-primary lg:text-base">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    User ID
                                </th>

                                <th scope="col" className="px-6 py-3">
                                    <div className="">Name</div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="">Amount Traded</div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    <div className="">Date Joined</div>
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {leaderboard.length > 0 ? leaderboard.slice(0, 20).map((item, i) => {
                                return (
                                    (
                                        <tr key={i} className="bg-dark truncate text-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-500">
                                            <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                                {item.unique_Id}
                                            </th>
                                            <td className="px-6 py-4">
                                                {item.first_name.slice(0, 1)}*****{item.first_name.slice(-3)}
                                            </td>
                                            <td className="px-6 py-4 text-lightgreen">
                                                {currencySign[1]}{item?.user_wallets?.total_deposit && item.user_wallets.total_deposit.toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4">
                                                {moment(item.createdAt).format(`DD-MM-YYYY`)}
                                            </td>
                                        </tr>
                                    )
                                )
                            }) :
                                <tr className='bg-dark truncate text-white border-b'>
                                    <td colSpan="4" className='italic text-center px-6 py-4'>
                                        No leaders available yet...
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>}

            </div>
        </AdminPageLayout>
    )
}

export default AdminLeaderboards