import React, { useCallback, useEffect, useRef, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import FormInput from '../../utils/FormInput'
import ModalLayout from '../../utils/ModalLayout'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import FormButton from '../../utils/FormButton'
import { FaEdit } from 'react-icons/fa'
import { FiUploadCloud } from 'react-icons/fi'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API'
import Loader from '../../GeneralComponents/Loader'


const AdminAddGiftcards = () => {
    const [loading, setLoading] = useState({ status: false, val: '' })
    const [add, setAdd] = useState(false)
    const [data, setData] = useState([])
    const [dataloading, setDataLoading] = useState(true)
    const [selected, setSelected] = useState({})
    const [del, setDel] = useState(false)
    const cardref = useRef(null)
    const [forms, setForms] = useState({
        name: '',
    })
    const [cardImage, setCardImage] = useState({
        img: null,
        image: null
    })

    const handleImageUpload = (e) => {
        const file = e.target.files[0]
        if (!file.type.startsWith('image/')) {
            cardref.current.value = null
            return ErrorAlert('File error, upload a valid image format (jpg, jpeg, png, svg)')
        }
        setCardImage({
            img: URL.createObjectURL(file),
            image: file
        })
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'rate') {
            if (!/^\d*$/.test(value)) return;
        }
        else if (name === 'regrex') {
            if (value.length > 1) return;
        }

        setForms({
            ...forms,
            [name]: value
        });
    };

    const addCard = () => {
        setForms({ name: '', })
        setAdd(true)
    }
    const navigate = useNavigate()
    const fetchCards = useCallback(async () => {
        try {
            const res = await AuthGetApi(Apis.admin.get_giftcards)
            if (res.status !== 200) return;
            const data = res.data
            // console.log(data)
            setData(data)
            setForms({ ...forms, name: data?.name, })
            setCardImage({ ...cardImage, img: data?.image })
        } catch (error) {
            console.log(`error in fetching giftcards`, error)
        } finally {
            setDataLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchCards()
    }, [])



    const crudCard = async (val) => {
        const tags = ['create', 'delete']
        if (!tags.includes(val)) return ErrorAlert('Invalid tag found')
        if (val === 'create') {
            if (!forms.name) return ErrorAlert('Please fill in the card name')
            if (!cardImage.img) return ErrorAlert('Please upload giftcard image')

            setAdd(false)
            const formdata = new FormData()
            formdata.append('name', forms.name)
            formdata.append('image', cardImage.image)
            setLoading({ status: true, val: 'create' })
            try {
                const res = await AuthPostApi(Apis.admin.add_giftcard, formdata)
                if (res.status !== 200) return ErrorAlert(res.msg)
                fetchCards()
                SuccessAlert(res.msg)
                setForms({ name: '', rate: '', regrex: '' })
                setCardImage({ img: null, image: null })
                navigate(`/admin/utilities/manage_giftcards/${res.data.id}`)
                await new Promise((resolve) => setTimeout(resolve, 2000))
            } catch (error) {
                console.log(`error in creating giftcard`, error)
            } finally { setLoading({ status: false, val: '' }) }
        }

        else {
            // return console.log(selected)
            if (!selected?.id) return ErrorAlert('Card ID not found')
            const id = selected?.id
            setDel(false)
            setLoading({ status: true, val: 'delete' })
            try {
                const res = await AuthPostApi(`${Apis.admin.delete_giftcard}/${id}`)
                if (res.status !== 200) return ErrorAlert(res.msg)
                data.filter((id) => id !== selected?.id)
                fetchCards()
                SuccessAlert(res.msg)
                await new Promise((resolve) => setTimeout(resolve, 2000))
            } catch (error) {
                console.log(`error in updating giftcard`, error)
            } finally { setLoading({ status: false, val: '' }) }
        }
    }

    const Topheaders = [`Name`, 'Image', 'Date Added', 'More', 'Delete']






    return (
        <AdminPageLayout>

            {loading.status && loading.val === 'create' &&
                <Loader title={`creating gitfcard`} />
            }
            {loading.status && loading.val === 'update' &&
                <Loader title={`updating gitfcard`} />
            }
            {loading.status && loading.val === 'delete' &&
                <Loader title={`deleting gitfcard`} />
            }
            

            {add &&
                <ModalLayout setModal={setAdd} clas={`w-11/12 mx-auto lg:w-1/2`}>
                    <div className="w-full p-5 bg-white text-dark rounded-md">
                        <div className="w-full flex items-center flex-col gap-5">
                            <div className="capitalize font-semibold">Add below new giftcard</div>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput label={`Giftcard Name`} name={`name`} value={forms.name} onChange={handleChange} />
                            </div>
                            <label className='cursor-pointer w-full'>
                                {cardImage.img ?
                                    <div className='relative'>
                                        <img src={cardImage.img} alt={`giftcarrd image`} className='w-full h-32 object-contain'></img>
                                        <div className="absolute top-0 left-52 main font-bold">
                                            <FaEdit className='text-2xl text-lightgreen' />
                                        </div>
                                    </div>
                                    :
                                    <div className='w-full h-32 border border-gray-400 border-dashed rounded-xl flex flex-col gap-2 items-center justify-center'>
                                        <div className='bg-gray-400 rounded-full p-4'><FiUploadCloud /></div>
                                        <span>click to add image</span>
                                    </div>
                                }
                                <input ref={cardref} type="file" onChange={handleImageUpload} hidden />
                            </label>
                            <div className="w-11/12 mx-auto  ">
                                <FormButton type='button' onClick={() => crudCard('create')} title={`Add Giftcard`} />
                            </div>
                        </div>
                    </div>
                </ModalLayout>
            }


            {del &&
                <ModalLayout setModal={setDel} clas={`w-11/12 mx-auto lg:w-1/2`}>
                    <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                        <div className="flex flex-col gap-4 w-full">
                            <div className="text-center">Are you sure you want to delete {selected?.name} giftcard?</div>
                            <div className="flex w-full items-center justify-between ">
                                <button onClick={() => setDel(false)} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                                <button onClick={() => crudCard('delete')} type='button' className='px-4 py-1.5 rounded-md bg-green-600 text-white'>confirm delete</button>
                            </div>
                        </div>
                    </div>
                </ModalLayout>
            }



            <div className="w-11/12 mx-auto mb-10 ">
                <div className=" text-center text-3xl mb-5 font-bold text-">Manage your Giftcards </div>
                <div className="flex items-center justify-between w-full">
                    <Link to={`/admin/utilities`} className='px-4 py-1.5 rounded-md bg-ash'>back to utilities</Link>
                </div>
                <div className="mt-10 text-center text-base md:ttext-lg mb-5 capitalize font-bold">Lists of available giftcards</div>

                <div className="w-fit ml-auto">
                    <button onClick={addCard} className="px-4 py-2 rounded-md text-sm text-dark bg-white">Add Giftcard</button>
                </div>
                {!dataloading ?
                    <div className="relative overflow-x-auto rounded-md mt-10">
                        <table className="w-full text-sm text-center rtl:text-right">
                            <thead className=" bg-primary text-base poppins ">
                                <tr>
                                    {Topheaders.map((item, i) => (
                                        <th key={i} scope="col" className="px-3 text-sm truncate text-white font-bold py-3">{item}</th>
                                    ))}

                                </tr>
                            </thead>
                            <tbody className='relative'>
                                {data.length > 0 ? data.map((item, i) => (
                                    <tr className=" border-b relative" key={i}>
                                        <td scope="row" className="px-6 text-white py-4 font-medium  whitespace-nowrap ">
                                            {item?.name}
                                        </td>
                                        <td className="px-3 py-3 truncate flex items-center justify-center">
                                            <img src={item?.image} alt={`${item.name}  image`}
                                                className='w-10 h-10 object-contain'
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            {moment(item?.createdAt).format(`DD-MM-YYYY a`)}
                                        </td>
                                        <td
                                            onClick={() => navigate(`/admin/utilities/manage_giftcards/${item?.id}`)}
                                            className="px-1 text-dark relative">
                                            <button
                                                className="w-full h-fit bg-white rounded-md py-1.5">explore</button>
                                        </td>
                                        <td className="px-1 text-white relative">
                                            <button
                                                onClick={() => { setDel(true); setSelected(item) }} className="w-full h-fit bg-red-600 rounded-md py-1.5">delete</button>
                                        </td>

                                    </tr>
                                )) :
                                    <tr className=" w-full text-lg  font-semibold ">
                                        <td colSpan='7' className='text-center py-2'>No giftcard  added  </td>
                                    </tr>
                                }

                            </tbody>
                        </table>
                    </div>
                    :
                    <div className="w-full">
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
        </AdminPageLayout>
    )
}

export default AdminAddGiftcards