import React, { useEffect, useRef, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { Link, useParams } from 'react-router-dom'
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API'
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import Loader from '../../GeneralComponents/Loader'
import FormInput from '../../utils/FormInput'
import SelectComp from '../../GeneralComponents/SelectComp'
import FormButton from '../../utils/FormButton'
import { FaEdit } from 'react-icons/fa'
import { FiUploadCloud } from 'react-icons/fi'
import ModalLayout from '../../utils/ModalLayout'
import { IoCloseSharp } from 'react-icons/io5'
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";

const AdminManageSingleCard = () => {

    const { id } = useParams()
    const [loading, setLoading] = useState({ status: false, val: "" })
    const [data, setData] = useState([])
    const [forms, setForms] = useState({
        name: '', currency: '', country: '', card_pic: false, min_value: '', max_value: '', rate: '', regrex: '', has_code: ''
    })
    const [cardImage, setCardImage] = useState({
        img: null,
        image: null
    })
    const fetchSingleCard = async () => {
        setLoading({ status: true, val: 'loading' })
        try {
            const res = await AuthGetApi(`${Apis.admin.get_single_card}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            const data = res.data
            setData(data)
            setForms({ name: data?.name, })
            setCardImage({ img: data?.image, image: null })
        } catch (error) {
            console.log(`error in fetching card`, error)
        } finally {
            setLoading({ status: false, val: '' })
        }
    }

    useEffect(() => {
        fetchSingleCard()
    }, [])

    const options = ['yes', 'no']
    const cardref = useRef(null)
    const [addcategory, setAddCategory] = useState(false)
    const [del, setDel] = useState(false)
    const [selected, setSelected] = useState({})
    const [updatecategory, setUpdateCategory] = useState(false)
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
    const handleValues = (e) => {
        const { name, value } = e.target
        if (!/^\d*$/.test(value)) return;
        if (name.includes("rate") && value.length > 4) return;
        setForms((prev) => ({
            ...prev,
            [name]: value,
        }));
    }


    const createNewCategory = () => {
        setForms({
            name: '', currency: '', country: '', card_pic: false, min_value: '', max_value: '', rate: '', regrex: '', has_code: ''
        })
        setAddCategory(true)
    }

    const handleRegrex = (e) => {
        const { name, value } = e.target
        if (!/^\d*$/.test(value)) return;
        if (value.length > 1) return
        setForms((prev) => ({
            ...prev,
            [name]: value,
        }));
    }
    useEffect(() => {
        if (!addcategory) {
            setForms({ ...forms, has_code: '' })
        }
    }, [addcategory])

    const addOrUpdateCardCategory = async (tag) => {
        const tags = ['new', 'update']
        if (!tags.includes(tag)) return ErrorAlert('Invalid Tag passed')
        const reqFields = [forms.country, forms.currency, forms.max_value, forms.min_value, forms.rate]
        if (reqFields.some((field) => !field)) return ErrorAlert('Please fill all fields')
        if (forms.has_code === 'yes' && (!forms.regrex || forms.regrex.trim() === '')) {
            return ErrorAlert(`Since the category requires code, add a regrex number`);
        }

        const formdata = {
            country: forms.country,
            id: tag === 'new' ? id : selected?.id,
            currency: forms.currency,
            card_pic: forms.has_code === 'no' || forms.has_code === '' ? 'true' : 'false',
            min_value: parseFloat(forms.min_value),
            max_value: parseFloat(forms.max_value),
            rate: parseFloat(forms.rate),
            regrex: forms.has_code === 'yes' ? forms.regrex : null
        }
        if (tag === 'new') {
            setAddCategory(false)
            // return console.log(formdata)
            setLoading({ status: true, val: 'category' })
            try {
                const res = await AuthPostApi(Apis.admin.addcard_category, formdata)
                if (res.status !== 200) return ErrorAlert(res.msg)
                fetchSingleCard()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(res.msg)
            } catch (error) {
                console.log(`error in adding a category`, error)
            } finally {
                setLoading({ status: false, val: '' })
            }
        } else {

            const formdata = {
                country: forms.country,
                id: selected?.id,
                currency: forms.currency,
                card_pic: forms.has_code === 'no' || forms.has_code === '' ? 'true' : 'false',
                min_value: parseFloat(forms.min_value),
                max_value: parseFloat(forms.max_value),
                rate: parseFloat(forms.rate),
                regrex: forms.has_code === 'yes' ? forms.regrex : null
            }
            // return console.log(formdata)
            setUpdateCategory(false)
            setLoading({ status: true, val: 'update' })
            try {
                const res = await AuthPostApi(Apis.admin.updatecard_category, formdata)
                if (res.status !== 200) return ErrorAlert(res.msg)
                fetchSingleCard()
                await new Promise((resolve) => setTimeout(resolve, 2000))
                SuccessAlert(res.msg)
            } catch (error) {
                console.log(`error in adding a category`, error)
            } finally {
                setLoading({ status: false, val: '' })
            }
        }
    }

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

    const filterCategory = (val) => {
        if (Object.keys(selected).length === 0) {
            setSelected(val)
        }
        setForms({
            currency: val.currency,
            country: val.country,
            card_pic: val.card_pic,
            min_value: val.min_value,
            max_value: val.max_value,
            rate: val.rate,
            regrex: val.regrex,
            has_code: val.regrex ? 'yes' : 'no'
        });
        setUpdateCategory(true);
    };

    const deleteCategory = async (id) => {
        if (!id) return ErrorAlert(`Category ID missing`)
        setLoading({ status: true, val: 'delete' })
        setDel(false)
        try {
            const res = await AuthPostApi(`${Apis.admin.deletecard_category}/${id}`)
            if (res.status !== 200) return ErrorAlert(res.msg)
            fetchSingleCard()
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
        } catch (error) {
            console.log(`error in deleting category`, error)
        } finally {
            setLoading({ status: false, val: '' })
        }

    }


    const updateCard = async () => {
        if (!forms.name) return ErrorAlert('Please fill in the card name and rate')
        if (!cardImage.img) return ErrorAlert('Please upload giftcard image')
        const formdata = new FormData()
        formdata.append('name', forms.name)
        formdata.append('id', id)
        if (cardImage.image) {
            formdata.append('image', cardImage.image)
        }
        setLoading({ status: true, val: 'update-card' })
        try {
            const res = await AuthPostApi(Apis.admin.update_giftcard, formdata)
            if (res.status !== 200) return ErrorAlert(res.msg)
            fetchSingleCard()
            await new Promise((resolve) => setTimeout(resolve, 2000))
            SuccessAlert(res.msg)
        } catch (error) {
            console.log(`error in updating giftcard`, error)
        } finally { setLoading({ status: false, val: '' }) }
    }

    return (
        <AdminPageLayout>
            <div className='w-full'>
                {loading.status && loading.val === 'loading' &&
                    <Loader title={`loading data`} />
                }
                {loading.status && loading.val === 'update-card' &&
                    <Loader title={`updating card`} />
                }
                {loading.status && loading.val === 'category' &&
                    <Loader title={`adding category`} />
                }
                {loading.status && loading.val === 'update' &&
                    <Loader title={`updating category`} />
                }
                {loading.status && loading.val === 'deleting' &&
                    <Loader title={`deleting category`} />
                }
                <div className="w-11/12 mx-auto mb-10 ">

                    <div className="flex items-center justify-between w-full">
                        <Link to={`/admin/utilities/manage_giftcards`} className='px-4 py-1.5 rounded-md bg-ash'>back to giftcards</Link>
                    </div>
                    <div className=" text-center text-3xl my-5 font-bold text-">Manage your {data?.name} giftcard </div>
                    {/* <div className="mt-10 text-center text-base md:ttext-lg mb-5 capitalize font-bold">Lists of available giftcards</div> */}

                    {del &&
                        <ModalLayout setModal={setDel} clas={`w-11/12 mx-auto lg:w-1/2`}>
                            <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                                <div className="flex flex-col gap-4 w-full">
                                    <div className="text-center">Are you sure you want to delete category?</div>
                                    <div className="flex w-full items-center justify-between ">
                                        <button onClick={() => setDel(false)} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                                        <button onClick={() => deleteCategory(selected?.id)} type='button' className='px-4 py-1.5 rounded-md bg-green-600 text-white'>confirm delete</button>
                                    </div>
                                </div>
                            </div>
                        </ModalLayout>
                    }

                    {updatecategory &&
                        <ModalLayout setModal={setUpdateCategory} clas={`w-11/12 mx-auto relative lg:w-2/3`}>
                            <div onClick={() => setUpdateCategory(false)} className="absolute right-5 cursor-pointer w-fit p-2 rounded-full bg-red-100 top-5">
                                <IoCloseSharp className='text-xl text-red-600' />
                            </div>
                            <div className="w-full p-5 bg-white text-dark rounded-md">
                                <div className="text-center">Update Category To {data?.name} Card</div>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                    <FormInput label={`Country:`} placeholder={'country'} name={`country`} value={forms.country} onChange={handleChange} />
                                    <FormInput label={`Currency Symbol:`} placeholder={`currency`} name={`currency`} value={forms.currency} onChange={handleChange} />
                                    <FormInput label={`Rate (NGN):`} placeholder={`rate`} name={`rate`} value={forms.rate} onChange={handleValues} />
                                    <FormInput label={`Min Value:`} placeholder={`min_value`} name={`min_value`} value={forms.min_value} onChange={handleValues} />
                                    <FormInput label={`Max Value:`} placeholder={`max_value`} name={`max_value`} value={forms.max_value} onChange={handleValues} />
                                    <div className="flex items-start flex-col">
                                        <div className="">Does this category require E-code?</div>
                                        <SelectComp
                                            options={options}
                                            style={{ bg: "#ffff", color: "grey", font: "0.8rem" }}
                                            value={forms.has_code}
                                            handleChange={(e) => setForms({ ...forms, has_code: e.target.value })}
                                        />
                                    </div>
                                    {forms.has_code === 'yes' &&
                                        <FormInput label={`Regrex:`} placeholder={`regrex`} name={`regrex`} value={forms.regrex} onChange={handleRegrex} />
                                    }


                                </div>
                                <div className="w-11/12 mx-auto  mt-10">
                                    <FormButton type='button' onClick={() => addOrUpdateCardCategory('update')} title={`Update Category`} />
                                </div>
                            </div>
                        </ModalLayout>
                    }
                    {addcategory &&
                        <ModalLayout setModal={setAddCategory} clas={`w-11/12 mx-auto relative lg:w-2/3`}>
                            <div onClick={() => setAddCategory(false)} className="absolute right-5 cursor-pointer w-fit p-2 rounded-full bg-red-100 top-5">
                                <IoCloseSharp className='text-xl text-red-600' />
                            </div>
                            <div className="w-full p-5 bg-white text-dark rounded-md">
                                <div className="text-center">Add New Category To {data?.name} Card</div>
                                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mt-5">
                                    <FormInput label={`Country:`} placeholder={'country'} name={`country`} value={forms.country} onChange={handleChange} />
                                    <FormInput label={`Currency Symbol:`} placeholder={`currency`} name={`currency`} value={forms.currency} onChange={handleChange} />
                                    <FormInput label={`Rate (NGN):`} placeholder={`rate`} name={`rate`} value={forms.rate} onChange={handleValues} />
                                    <FormInput label={`Min Value:`} placeholder={`min_value`} name={`min_value`} value={forms.min_value} onChange={handleValues} />
                                    <FormInput label={`Max Value:`} placeholder={`max_value`} name={`max_value`} value={forms.max_value} onChange={handleValues} />
                                    <div className="flex items-start flex-col">
                                        <div className="">Does this category require E-code?</div>
                                        <SelectComp
                                            options={options}
                                            style={{ bg: "#ffff", color: "grey", font: "0.8rem" }}
                                            value={forms.has_code}
                                            handleChange={(e) => setForms({ ...forms, has_code: e.target.value })}
                                        />
                                    </div>
                                    {forms.has_code === 'yes' &&
                                        <FormInput label={`Regrex:`} placeholder={`regrex`} name={`regrex`} value={forms.regrex} onChange={handleRegrex} />
                                    }


                                </div>
                                <div className="w-11/12 mx-auto  mt-10">
                                    <FormButton type='button' onClick={() => addOrUpdateCardCategory('new')} title={`Add Card Category`} />
                                </div>
                            </div>
                        </ModalLayout>
                    }

                    <div className="w-full  text-white rounded-md">
                        <div className="w-full flex items-center flex-col gap-5">
                            <div className="capitalize font-semibold">Update {data?.name} Giftcard</div>
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                                <FormInput label={`Giftcard Name`} name={`name`} value={forms.name} onChange={handleChange} />
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

                            </div>
                            <div className="mt-10 w-full h-fit overflow-auto ">
                                <div onClick={createNewCategory} className="w-fit cursor-pointer ml-auto text-base px-3 py-1.5 rounded-full bg-white text-dark">add category</div>
                                <div className="font-semibold">Added Categories</div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 my-5 gap-3">
                                    {Array.isArray(data?.card_categories) && data?.card_categories.length > 0 ?

                                        data?.card_categories.map((card, i) => (
                                            <div className="flex md:justify-between md:flex-row flex-col gap-2 items-center p-2 rounded-md border" key={i}>
                                                <div className="flex gap-1 items-center">
                                                    <div className="">{card?.country}</div>
                                                    <div className="">({card?.card_pic === 'true' ? 'card-pic' : 'E-code'})</div>
                                                    <div className="flex items-center">
                                                        <div className="">{card?.currency}</div>
                                                        <div className="">{card?.min_value}</div>
                                                    </div>
                                                    <div className="">To</div>
                                                    <div className="flex items-center">
                                                        <div className="">{card?.currency}</div>
                                                        <div className="">{card?.max_value}</div>
                                                    </div>
                                                    <div className="">At</div>
                                                    <div className="">{card?.rate}</div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        onClick={() => {
                                                            filterCategory(card);
                                                        }}
                                                        onMouseOver={() => setSelected(card)}
                                                        className="w-fit p-3 rounded-full bg-white text-dark cursor-pointer"
                                                    >
                                                        <CiEdit />
                                                    </div>

                                                    <div onClick={() => { setDel(true), setSelected(card) }} className="w-fit p-3 rounded-full bg-red-100 text-red-600 cursor-pointer"><MdDelete /></div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <div className="">No categories added to this card</div>
                                    }
                                </div>
                            </div>
                            <div className="w-11/12 mx-auto  ">
                                <FormButton type='button' onClick={updateCard} title={`Update Card`} />
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </AdminPageLayout>
    )
}

export default AdminManageSingleCard