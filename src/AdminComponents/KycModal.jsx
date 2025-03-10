import React, { useRef, useState } from 'react'
import { IoReturnUpBackOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import Loader from '../GeneralComponents/Loader'
import ModalLayout from '../utils/ModalLayout'
import { Apis, AuthPutApi, imageurl } from '../services/API'
import FormInput from '../utils/FormInput'
import { ErrorAlert, SuccessAlert } from '../utils/pageUtils'
import { useAtom } from 'jotai'
import { USER_SUB_KYCS, USER_VER_KYCS } from '../services/store'


const KycModal = ({ data, setModal }) => {
    const refdiv = useRef(null)
    const [, setSubKycs] = useAtom(USER_SUB_KYCS)
    const [, setVerifiedKycs] = useAtom(USER_VER_KYCS)
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [form, setForm] = useState({ msg: '' })
    const [approve, setApprove] = useState(false)
    const [decline, setDecline] = useState(false)

    const DeclineKyc = async () => {
        if (!form.msg) return ErrorAlert('Reason for decline is required')
        const formdata = {
            kyc_id: data?.id, status: 'failed', message: form.msg
        }
        setDecline(false)
        setLoading(true)
        try {
            const response = await AuthPutApi(Apis.admin.update_kyc, formdata)
            if (response.status !== 200) return ErrorAlert(response.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(response.msg)
            setSubKycs(response.data?.submitted)
            setForm({ msg: '' })
            setLoading(false)
            setModal(false)
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }
    const ApproveKyc = async () => {
        const formdata = {
            kyc_id: data?.id, status: 'verified'
        }
        setApprove(false)
        setLoading(true)
        try {
            const response = await AuthPutApi(Apis.admin.update_kyc, formdata)
            if (response.status !== 200) return ErrorAlert(response.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(response.msg)
            setVerifiedKycs(response.data?.verified)
            setForm({ msg: '' })
            setModal(false)
            navigate(`/admin/all_users/submitted_kycs`)
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleMsg = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }
    return (
        <div className="w-full mx-auto mt-5 relative">
            <div ref={refdiv}
                className={`  shadow-xl bg-white text-dark rounded-md py-5`}>
                <div className="flex items-center justify-center w-10/12 mx-auto mb-4">
                    <button onClick={() => setModal(false)}
                        className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md">
                        <IoReturnUpBackOutline className='text-2xl' />
                    </button>
                    <h1 className='text-center py-4 font-bold '>KYC submission from </h1>
                </div>

                {loading && <Loader />}
                <div className="flex w-11/12 mx-auto items-baseline">
                    <div className="flex flex-col gap-2 w-1/2">
                        <div className="">
                            <h1 className='text-sm'>First Name:</h1>
                            <h1 className='font-bold text-md'>{data?.user_kyc?.first_name}</h1>
                        </div>
                        <div className=" text-md">
                            <h1 className='text-sm'>Last Name:</h1>
                            <h1 className='font-bold '>{data?.user_kyc?.surname}</h1>
                        </div>
                        <div className="text-md">
                            <h1 className='text-sm'>Date Of Birth:</h1>
                            <h1 className='font-bold '>{data?.date_of_birth}</h1>
                        </div>

                    </div>
                    <div className="">

                        <div className="">
                            <h1>ID Card Type</h1>
                            <h1 className='capitalize font-bold '>{data.id_type}</h1>
                        </div>
                        <div className="">
                            <h1>ID Card No</h1>
                            <h1 className='font-bold '>{data.id_number}</h1>
                        </div>

                    </div>
                </div>
                <div className="w-11/12 items-center flex-col lg:flex-row gap-10 mx-auto mt-6  flex ">
                    <div className="lg:w-1/2 ">
                        <h1>ID Front Photo</h1>
                        <img src={`${imageurl}/identities/${data?.front_image}`} className='w-full md:h-96 object-contain' alt="kyc front image" />
                    </div>
                    <div className="lg:w-1/2">
                        <h1>ID Back Photo</h1>
                        <img src={`${imageurl}/identities/${data?.back_image}`} className='w-full md:h-96 object-contain' alt="kyc back image" />
                    </div>
                </div>
                {data?.status === 'processing' && <div className="w-11/12 mt-10 mb-5 mx-auto flex items-center justify-between">
                    <button onClick={() => setDecline(prev => !prev)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Decline Kyc</button>
                    <button onClick={() => setApprove(prev => !prev)} className='px-4 py-2 bg-green-500 text-white rounded-md'>Approve Kyc</button>
                </div>
                }
                {decline &&
                    <ModalLayout setModal={setDecline} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                        <div className="p-5  bg-white shadow-xl rounded-md">
                            <div className="text-base text-center mb-3">Are you sure you want to decline</div>
                            <div className="my-2">
                                <FormInput name={`msg`} value={form.msg} onChange={handleMsg} formtype='textarea' label={`Enter reason for decline (required!)`} />
                            </div>
                            <div className="flex items-center justify-between">
                                <button onClick={() => setDecline(false)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Cancel</button>
                                <button onClick={DeclineKyc} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm Decline</button>
                            </div>

                        </div>
                    </ModalLayout>
                }
                {approve &&
                    <ModalLayout setModal={setApprove} clas={`lg:w-[50%] w-10/12 mx-auto`}>
                        <div className="p-5  bg-white shadow-xl rounded-md">
                            <div className="text-base text-center mb-3">Are you sure you want to approve</div>
                            <div className="flex items-center justify-between">
                                <button onClick={() => setApprove(false)} className='px-4 py-2 bg-red-500 text-white rounded-md'>Cancel</button>
                                <button onClick={ApproveKyc} className='px-4 py-2 bg-green-500 text-white rounded-md'>Confirm Approval</button>
                            </div>

                        </div>
                    </ModalLayout>
                }

            </div>
        </div>
    )
}


export default KycModal