import moment from 'moment'
import React, { useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { currencies } from '../../AuthComponents/AuthUtils'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link } from 'react-router-dom'
import { useAtom } from 'jotai'
import { PROFILE, USERDETAILS } from '../../services/store'
import ModalLayout from '../../utils/ModalLayout'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import { Apis, AuthPostApi } from '../../services/API'
import Loader from '../../GeneralComponents/Loader'
import FormInput from '../../utils/FormInput'
import { CiSearch } from 'react-icons/ci'
import SelectComp from '../../GeneralComponents/SelectComp'
import FormButton from '../../utils/FormButton'

const actions = ["true", "false"]

const UserDetails = () => {
    const [user] = useAtom(PROFILE)
    const [data, setData] = useAtom(USERDETAILS)
    const [loading, setLoading] = useState(false)
    const [selectedUser, setSelectedUser] = useState({})
    const [modal, setModal] = useState(false)
    const [modal2, setModal2] = useState(false)
    const [filteredata, setFilteredData] = useState(data)
    const [form, setForm] = useState({
        airdrop_permit: '',
        blog_permit: '',
        product_permit: '',
        exchange_permit: '',
        giftcard_permit: ''
    })

    const permissions = [
        {
            title: 'airdrop permit',
            name: 'airdrop_permit',
            value: form.airdrop_permit
        },
        {
            title: 'blog permit',
            name: 'blog_permit',
            value: form.blog_permit
        },
        {
            title: 'product permit',
            name: 'product_permit',
            value: form.product_permit
        },
        {
            title: 'exchange permit',
            name: 'exchange_permit',
            value: form.exchange_permit
        },
        {
            title: 'giftcard permit',
            name: 'giftcard_permit',
            value: form.giftcard_permit
        },
    ]

    const handleFilter = (e) => {
        const { value } = e.target;
        if (!value) {
            setFilteredData(data);
            return;
        }
        const filtered = data.filter(
            (val) =>
                val.first_name.toLowerCase().startsWith(value.toLowerCase()) ||
                val.surname.toLowerCase().startsWith(value.toLowerCase()) ||
                val.email.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredData(filtered);
    };

    const ViewFunc = (item) => {
        setSelectedUser(item)
        setForm({
            airdrop_permit: item.airdrop_permit,
            blog_permit: item.blog_permit,
            product_permit: item.product_permit,
            exchange_permit: item.exchange_permit,
            giftcard_permit: item.giftcard_permit
        })
        setModal2(true)
    }

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const ChangeRole = async () => {
        if (!selectedUser.id) return ErrorAlert(`User ID missing`)
        const data = { id: selectedUser.id }
        setModal(false)
        setLoading(true)
        try {
            const response = await AuthPostApi(Apis.admin.assign_role, data)
            if (response.status !== 200) return ErrorAlert(response.msg)
            setData(response.data)
            setFilteredData(response.data)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(response.msg)
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const UpdatePermissions = async () => {
        if (!selectedUser.id) return ErrorAlert(`User ID missing`)
        const data = {
            id: selectedUser.id,
            airdrop_permit: form.airdrop_permit,
            blog_permit: form.blog_permit,
            product_permit: form.product_permit,
            exchange_permit: form.exchange_permit,
            giftcard_permit: form.giftcard_permit
        }
        setModal2(false)
        setLoading(true)
        try {
            const response = await AuthPostApi(Apis.admin.update_permissions, data)
            if (response.status !== 200) return ErrorAlert(response.msg)
            setData(response.data)
            setFilteredData(response.data)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(response.msg)
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <AdminPageLayout>

            {modal &&
                <ModalLayout setModal={setModal} clas={`lg:w-1/2 w-10/12 mx-auto`}>
                    <div className="p-5  bg-white text-dark shadow-xl rounded-md">
                        <div className="text-base text-center mb-3 font-medium">Are you sure you want to change {selectedUser?.first_name} {selectedUser?.surname}'s role?</div>
                        <div className="flex items-center justify-between">
                            <button onClick={() => setModal(false)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Cancel</button>
                            <button onClick={ChangeRole} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm</button>
                        </div>
                    </div>
                </ModalLayout>
            }
            {modal2 &&
                <ModalLayout setModal={setModal2} clas={`lg:w-1/2 w-10/12 mx-auto`}>
                    <div className="p-5 bg-white text-dark font-medium shadow-xl rounded-md">
                        <div className="text-base text-center capitalize border-b w-full">{selectedUser?.first_name} {selectedUser?.surname} permissions</div>
                        <div className='flex flex-wrap justify-center gap-4 mt-5'>
                            {permissions.map((item, i) => (
                                <div key={i} className='flex flex-col'>
                                    <div className='capitalize font-medium'>{item.title}:</div>
                                    <SelectComp options={actions} width={200} style={{ bg: '#ffff', color: 'grey', font: '0.85rem', rounded: '0.2rem' }} name={item.name} value={item.value} handleChange={handleChange} />
                                </div>
                            ))}
                        </div>
                        <div className="w-11/12 mx-auto mt-8">
                            <FormButton type='button' title={`Update Permissions`} onClick={UpdatePermissions} />
                        </div>
                    </div>
                </ModalLayout>
            }
            {loading && <Loader title={`processing`} />}
            <div className='w-11/12 mx-auto '>
                <div className="w-full flex items-center text-white justify-between">
                    <Link to={`/admin/all_users`} className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                        <IoReturnUpBackOutline className='text-2xl' />
                    </Link>
                    <div className="text-lg font-semibold">User Details</div>
                </div>
                <div className="my-5 text-xl font-bold text-center">Below are Users Details on MonieQuest</div>
                <div className="w-full lg:w-2/3 mx-auto relative">
                    <FormInput placeholder='Search by FullName and Email' className="!rounded-lg" onChange={(e) => handleFilter(e)} />
                    <div className="absolute top-3 right-3">
                        <CiSearch className='text-xl cursor-pointer text-white' />
                    </div>
                </div>

                <div className="relative overflow-x-auto rounded-md mt-10">
                    <table className="w-full text-sm text-center">
                        <thead className=" bg-primary text-sm poppins">
                            <tr>
                                <th scope="col" className="px-3 py-3">
                                    ID
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    FullName
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    Role
                                </th>
                                <th scope="col" className="px-3 py-3">
                                    KYC Verified
                                </th>

                                <th scope="col" className="px-3 py-3">
                                    Balance
                                </th>
                                <th scope="col" className="px-3 py-3 truncate">
                                    Date Joined
                                </th>
                                {user.role === 'super admin' && <th scope="col" className="px-3 py-3 truncate">
                                    Change Role
                                </th>}
                                {user.role === 'super admin' && <th scope="col" className="px-3 py-3 truncate">
                                    Permissions
                                </th>}

                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(filteredata) ? filteredata.map((item, i) => (
                                <tr className=" border-b " key={i}>
                                    <th scope="row" className="px-6 text-white py-4 font-medium  whitespace-nowrap ">
                                        {item.id}
                                    </th>
                                    <td className="px-3 truncate capitalize text-lightgreen py-3">
                                        {item?.first_name} {item?.surname}
                                    </td>
                                    <td className="px-3 py-3">
                                        {item?.email}
                                    </td>
                                    <td className="px-3 py-3">
                                        {item?.role}
                                    </td>
                                    <td className="px-3 py-3 truncate">
                                        {item?.kyc_verified === 'false' ? 'Not Submitted' : item?.kyc_verified === 'processing' ? 'Submitted' : 'Verified'}
                                    </td>

                                    <td className="px-3 py-3">
                                        {currencies[1].symbol}{item?.user_wallets?.balance ? item?.user_wallets?.balance.toLocaleString() : 0}
                                    </td>
                                    <td className="px-3 py-3 truncate">
                                        {moment(item.createdAt).format(`DD-MM-YYYY hh:mm a`)}
                                    </td>
                                    {user.role === 'super admin' && <td className="px-3 py-3 truncate">
                                        <button onClick={() => { setModal(true); setSelectedUser(item) }} className='text-center w-full bg-ash text-white rounded-md py-1.5'>Proceed</button>
                                    </td>}
                                    {user.role === 'super admin' && <td className="px-3 py-3 truncate">
                                        <button onClick={() => ViewFunc(item)} className='text-center w-full bg-ash text-white rounded-md py-1.5'>View</button>
                                    </td>}
                                </tr>
                            )) :
                                <tr className=" w-full truncate text-lg font-semibold">
                                    <td colSpan="7" className='text-center py-2'>No Users found</td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminPageLayout>
    )
}

export default UserDetails