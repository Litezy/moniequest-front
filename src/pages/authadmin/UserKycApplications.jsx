import React, { useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import KycModal from '../../AdminComponents/KycModal'
import moment from 'moment'
import ModalLayout from '../../utils/ModalLayout'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { useAtom } from 'jotai'
import { USER_SUB_KYCS } from '../../services/store'


const UserKycApplications = () => {
    const [modal, setModal] = useState(false)
    const [selected, setSelected] = useState({})
    const [users,] = useAtom(USER_SUB_KYCS)

    const TableHeaders = [
        "User ID",
        "Full Name",
        "Date Submitted",
        "View details",
    ]

    const filterSelect = (val) => {
        setSelected(val)
        setModal(true)
    }

    return (
        <AdminPageLayout>
            <div className="w-11/12 mx-auto">
                {modal &&
                    <ModalLayout setModal={setModal} clas={`w-11/12 mx-auto lg:w-3/4`}>
                        <KycModal data={selected} setModal={setModal} />
                    </ModalLayout>
                }
                <div className="w-full flex items-center justify-between">
                    <Link to={`/admin/all_users`}
                        className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                        <IoReturnUpBackOutline className='text-2xl' />
                    </Link>
                    <div className="text-lg font-semibold">Submitted Pending Kycs</div>
                </div>

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
                            {users.length > 0 ? users.map((item, i) => (
                                <tr className=" border-b " key={i}>
                                    <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                                        {item?.user}
                                    </th>
                                    <td className="px-3 text-lightgreen truncate py-3">
                                        {item?.user_kyc?.first_name} {item?.user_kyc?.surname}
                                    </td>
                                    <td className="px-3 truncate py-3">
                                        {moment(item?.createdAt).format(`DD-MM-YYYY hh:mm a `)}
                                    </td>
                                    <td className="px-3 py-3">
                                        <button onClick={() => filterSelect(item)}
                                            className="bg-gradient-to-tr from-primary to-sec text-white px-5 rounded-lg py-2">view details</button>
                                    </td>
                                </tr>
                            )) :
                                <tr className=" w-full truncate text-lg font-semibold">
                                    <td colSpan="4" className='text-center py-2'>No pending Kyc's found</td>
                                </tr>
                            }

                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPageLayout>

    )
}


export default UserKycApplications