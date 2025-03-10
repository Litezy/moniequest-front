import React, { useEffect, useState } from 'react'
import { BiSolidToTop } from "react-icons/bi";
import AuthPageLayout from '../../AuthComponents/AuthPageLayout';
import { Apis, AuthGetApi } from '../../services/API';
import { currencySign } from '../../utils/pageUtils';
import logo from '../../assets/images/trophy.png'
import banner from '../../assets/images/toptrader1.jpg'
import { UTILS } from '../../services/store';
import { useAtom } from 'jotai';

const Leaderboards = () => {
    const [dataLoading, setDataLoading] = useState(true)
    const [leaderboard, setLeaderboard] = useState([])
    const [utils] = useAtom(UTILS)

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
        <AuthPageLayout>
            <div className='w-11/12 mx-auto'>
                {dataLoading && new Array(3).fill().map((_, i) => (
                    <div key={i} className="w-full mb-5 h-16 bg-gray-500 rounded-md animate-pulse"></div>

                ))}
                {!dataLoading &&
                    <div className="w-full flex items-start gap-5 flex-col lg:flex-row">
                        <div className="w-full lg:w-1/2">
                            <img src={banner} loading='lazy' className='rounded-md' alt="" />
                        </div>

                        <div className="w-full lg:w-1/2">
                            <div className="flex justify-center w-full  items-center gap-3 mb-10">
                                <BiSolidToTop className='text-3xl text-lightgreen' />
                                <div className="text-2xl font-bold ">Top Traders on MonieQuest</div>
                            </div>
                            <div className="relative overflow-y-auto shadow-md sm:rounded-lg w-full max-h-96 lg:max-h-80 scroll ">

                                <table className="w-full text-sm text-center rounded-e-md rounded-s-md truncate rtl:text-right text-gray-400 ">
                                    <thead className="text-sm bg-primary lg:text-base">
                                        <tr>
                                            <th scope="col" className="text-start px-7 text-2xl">
                                                #
                                            </th>
                                            <th scope="col" className=" px-6 py-3">
                                                User ID
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                <div className="">Name</div>
                                            </th>
                                            <th scope="col" className="px-6 py-3">
                                                <div className="">Prizes</div>
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {leaderboard.length > 0 ? leaderboard.slice(0, 10).map((item, i) => {
                                            return (
                                                (
                                                    <tr key={i} className="bg-dark truncate text-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-500">
                                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap dark:text-white">
                                                            <img src={logo} className='w-10' alt="winner_" />
                                                        </th>
                                                        <td className="px-6 py-4">
                                                            {item.unique_Id}
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            {item.first_name.slice(0, 1)}*****{item.first_name.slice(-3)}
                                                        </td>
                                                        <td className="px-6 py-4 text-lightgreen">
                                                            {currencySign[0]}{utils?.leaderboard_reward}
                                                        </td>

                                                    </tr>

                                                )
                                            )
                                        }) :
                                            <tr className='bg-dark truncate text-white border-b'>
                                                <td colSpan="4" className='py-2 italic text-center'>
                                                    No leaders available yet...
                                                </td>
                                            </tr>
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                }

            </div>
        </AuthPageLayout>
    )
}

export default Leaderboards