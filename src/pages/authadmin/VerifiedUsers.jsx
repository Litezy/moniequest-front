import React, { useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import KycModal from '../../AdminComponents/KycModal'
import moment from 'moment'
import ModalLayout from '../../utils/ModalLayout'
import { useAtom } from 'jotai'
import { USER_VER_KYCS } from '../../services/store'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link } from 'react-router-dom'

const VerifiedUsers = () => {
    const [modal, setModal] = useState()
    const [selected, setSelected] = useState({})
    const [users] = useAtom(USER_VER_KYCS)
    const [visibleCount, setVisibleCount] = useState(10)

    const TableHeaders = [
        "User ID",
        "Full Name",
        "Date Submitted",
        "Date Verified",
        "View details",
    ]

    const filterSelect = (val) => {
        setSelected(val)
        setModal(true)
    }

    return (
        <AdminPageLayout>
            <div className="w-11/12 mx-auto ">

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
                    <div className="text-lg font-semibold">Verified Kycs</div>
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
                            {users.length > 0 ?
                                users.slice(0, visibleCount).map((item, i) => (
                                    <tr className=" border-b " key={i}>
                                        <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap ">
                                            {item?.id}
                                        </th>

                                        <td className="px-3 truncate py-3">
                                            {item?.user_kyc?.first_name} {item?.user_kyc?.surname}
                                        </td>
                                        <td className="px-3 py-3 truncate">
                                            {moment(item?.createdAt).format(`DD-MM-YYYY `)}
                                        </td>
                                        <td className="px-3  py-3 truncate">
                                            {moment(item?.updatedAt).format(`DD-MM-YYYY `)}
                                        </td>
                                        <td className="px-3 py-3">
                                            <button onClick={() => filterSelect(item)}
                                                className="bg-primary truncate text-white px-5 rounded-lg py-2">view details</button>
                                        </td>
                                    </tr>
                                )) :
                                <tr className=" w-full truncate text-lg font-semibold">
                                    <td colSpan="5" className='text-center py-2'>No verified Kyc's found</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
                {visibleCount < users.length &&
                    <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center capitalize rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto mt-6'>show older accounts</button>
                }
            </div>
        </AdminPageLayout>

    )
}




export default VerifiedUsers