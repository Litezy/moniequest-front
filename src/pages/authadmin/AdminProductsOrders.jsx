import React, { useEffect, useState } from 'react'
import { GoArrowUpRight } from 'react-icons/go'
import ModalLayout from '../../utils/ModalLayout'
import moment from 'moment'
import { currencySign } from '../../utils/pageUtils'
import { Apis, AuthGetApi } from '../../services/API'
import AdminProductsLayout from '../../AdminComponents/AdminProductLayout'
import ProductsOrdersModal from '../../AdminComponents/ProductOrdersModal'
import FormInput from '../../utils/FormInput'
import { CiSearch } from 'react-icons/ci'


const AdminProductsOrders = () => {
    const [staticData, setStaticData] = useState([])
    const [productOrders, setProductOrders] = useState([])
    const [modal, setModal] = useState(false)
    const [selected, setSelected] = useState({})
    const [search, setSearch] = useState('')
    const [datatLoading, setDataLoading] = useState(true)
    const [visibleCount, setVisibleCount] = useState(5)

    useEffect(() => {
        const FetchProductOrders = async () => {
            try {
                const response = await AuthGetApi(Apis.admin.all_products_orders)
                if (response.status === 200) {
                    setStaticData(response.msg)
                    setProductOrders(response.msg)
                }
            } catch (error) {
                //
            } finally {
                setDataLoading(false)
            }
        }
        FetchProductOrders()
    }, [])

    const FilterOrders = () => {
        const mainData = staticData
        if (search.length > 1) {
            const filtered = mainData.filter(item => moment(item.createdAt).format('Do MMM YYYY').toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.gen_id.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
            setProductOrders(filtered)
        } else {
            setProductOrders(mainData)
        }
    }

    return (
        <AdminProductsLayout>
            <div className='w-11/12 mx-auto'>
                <div className="w-full lg:w-2/3 mx-auto relative">
                    <FormInput placeholder='Search by Date and ID' value={search} onChange={(e) => setSearch(e.target.value)} className="!rounded-lg" onKeyUp={FilterOrders} />
                    <div className="absolute top-3 right-3">
                        <CiSearch className='text-xl cursor-pointer text-white' />
                    </div>
                </div>
                {datatLoading ?
                    <div className='flex flex-col gap-10 mt-8 animate-pulse'>
                        <div className='md:w-96 w-64 md:h-5 h-4 rounded-md bg-slate-400'></div>
                        <div className='flex items-center lg:grid lg:grid-cols-3 justify-between border-b border-slate-400 pb-1 w-full'>
                            <div className='flex lg:gap-5 gap-2 items-start'>
                                <div className='w-12 h-12 rounded-full bg-slate-400'></div>
                                <div className='flex flex-col gap-5'>
                                    <div className='md:w-40 w-36 md:h-3.5 h-3 rounded-full bg-slate-400'></div>
                                    <div className='flex flex-col gap-2'>
                                        <div className='md:w-28 w-24 h-2 rounded-full bg-slate-400'></div>
                                        <div className='md:w-16 w-12 h-2 rounded-full bg-slate-400'></div>
                                    </div>
                                </div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <div className='md:w-12 w-10 h-2 rounded-full bg-slate-400'></div>
                            </div>
                            <div className='flex justify-center items-center'>
                                <div className='md:w-16 w-12 h-2 rounded-full bg-slate-400'></div>
                            </div>
                        </div>
                    </div>
                    :
                    <div className='flex flex-col gap-5 mt-8'>
                        <div className="text-2xl md:text-3xl font-bold text-gray-300 capitalize">latest products purchases</div>
                        {modal &&
                            <ModalLayout clas={`w-11/12 mx-auto lg:w-1/2 scroll rounded-md`} setModal={setModal}>
                                <div className="w-full p-5 lg:p-10 bg-primary">
                                    <div className="flex items-center justify-between">
                                        <ProductsOrdersModal selected={selected} />
                                    </div>
                                    <button className='mt-5 w-full text-center bg-red-600 py-2 rounded-md' onClick={() => setModal(false)} >close</button>
                                </div>
                            </ModalLayout>
                        }
                        {productOrders.length > 0 ?
                            <div className='flex flex-col gap-8'>
                                <div className='flex flex-col gap-5'>
                                    {productOrders.slice(0, visibleCount).map((item, i) => (
                                        <div key={i}>
                                            <div onClick={() => { setModal(true); setSelected(item) }} className="w-full flex items-center cursor-pointer lg:grid lg:grid-cols-3 justify-between border-b-primary pb-1 border-b mt-2">
                                                <div className="flex items-start gap-2 lg:gap-5 w-fit lg:w-full">
                                                    <div className="w-fit px-4 py-4 rounded-full bg-primary">
                                                        <GoArrowUpRight className='text-lightgreen' />
                                                    </div>
                                                    <div className="flex items-start flex-col gap-1">
                                                        <div><span className='font-bold'>ID:</span> {item?.gen_id}</div>
                                                        <div className="flex flex-col items-start gap-1 text-xs md:text-sm">
                                                            <div className="">{moment(item.createdAt).format('ddd')} {moment(item.createdAt).format('DD-MM-YYYY')}</div>
                                                            <div className="">{moment(item.createdAt).format('hh:mm a')}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={`flex items-center text-sm justify-center lg:w-full rounded-md text-lightgreen/90`}>{item?.status}</div>
                                                <div className=" font-bold lg:w-full flex items-center justify-center text-lightgreen">
                                                    {currencySign[1]}{item?.amount_paid && item.amount_paid.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {visibleCount < productOrders.length &&
                                    <button onClick={() => setVisibleCount(visibleCount + 5)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto'>See previous orders</button>
                                }
                            </div>
                            :
                            <div className="text-gray-400 text-center">No record found...</div>
                        }
                    </div>
                }
            </div>
        </AdminProductsLayout>
    )
}

export default AdminProductsOrders