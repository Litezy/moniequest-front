import React, { useEffect, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import FormInput from '../../utils/FormInput';
import { Apis, AuthGetApi } from '../../services/API';
import AdminProductsLayout from '../../AdminComponents/AdminProductLayout';
import AdminProductComp from '../../AdminComponents/AdminProductComp';


const AdminAllProducts = () => {
    const tags = ['all', 'pending', 'approved', 'declined']
    const [active, setActive] = useState(tags[0])
    const [search, setSearch] = useState('')
    const [dataLoading, setDataLoading] = useState(true)
    const [staticData, setStaticData] = useState([])
    const [allProducts, setAllProducts] = useState([])
    const [visibleCount, setVisibleCount] = useState(10)
    const [length, setLength] = useState(0)

    useEffect(() => {
        const FetchAllProducts = async () => {
            try {
                const response = await AuthGetApi(Apis.admin.all_products)
                if (response.status === 200) {
                    setStaticData(response.msg)
                    setAllProducts(response.msg)
                    setLength(response.msg.length)
                }
            } catch (error) {
                //
            } finally {
                setDataLoading(false)
            }
        }
        FetchAllProducts()
    }, [])


    const pendingProducts = useMemo(() => {
        return allProducts.filter((ele) => ele.status === 'pending');
    }, [allProducts])
    const approvedProducts = useMemo(() => {
        return allProducts.filter((ele) => ele.status === 'approved');
    }, [allProducts])
    const declinedProducts = useMemo(() => {
        return allProducts.filter((ele) => ele.status === 'declined');
    }, [allProducts])

    const FilterProducts = () => {
        const mainData = staticData
        if (search.length > 1) {
            const filtered = mainData.filter(item => item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.gen_id.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
            setAllProducts(filtered)
        } else {
            setAllProducts(mainData)
        }
    }

    useEffect(() => {
        setVisibleCount(10)
        const filtered = allProducts.filter((item) => active === tags[1] ? item.status === 'pending' : active === tags[2] ? item.status === 'approved' : active === tags[3] ? item.status === 'declined' : item)
        setLength(filtered.length)
    }, [active, allProducts])

    return (
        <AdminProductsLayout>
            <div className='w-11/12 mx-auto'>
                <div className="w-full lg:w-2/3 mx-auto relative">
                    <FormInput placeholder='Search by Title and ID' value={search} onChange={(e) => setSearch(e.target.value)} className="!rounded-lg" onKeyUp={FilterProducts} />
                    <div className="absolute top-3 right-3">
                        <CiSearch className='text-xl cursor-pointer text-white' />
                    </div>
                </div>
                <div className="grid md:grid-cols-6 grid-cols-1 gap-2 items-center mt-4">
                    <div className="text-zinc-300 font-semibold capitalize text-sm lg:text-base col-span-1">Sort Products by:</div>
                    <div className='md:col-span-5 col-span-1'>
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-3 items-center lg:w-11/12 w-full mx-auto">
                            {tags.map((tag, i) => {
                                return (
                                    <div key={i} onClick={() => setActive(tag)}
                                        className={`w-full h-fit py-1 text-sm md:text-base flex items-center justify-center text-center rounded-md capitalize ${active === tag ? 'bg-ash' : 'bg-primary hover:bg-primary/50'} cursor-pointer`}>{tag}</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className='mt-10'>
                    {dataLoading ?
                        <div className='w-full h-fit'>
                            <div className='h-11 bg-slate-600 animate-pulse rounded-t-lg'></div>
                            <div className='md:h-24 h-40 bg-slate-500 animate-pulse rounded-b-lg'></div>
                        </div>
                        :
                        <>
                            {allProducts.length > 0 ?
                                <>
                                    <div className='flex flex-col gap-4'>
                                        {active === 'all' &&
                                            <>
                                                {allProducts.slice(0, visibleCount).map((item, i) => (
                                                    <AdminProductComp key={i} item={item} />
                                                ))}
                                            </>
                                        }
                                        {active === 'pending' &&
                                            <>
                                                {pendingProducts.length > 0 ?
                                                    <>
                                                        {pendingProducts.slice(0, visibleCount).map((item, i) => (
                                                            <AdminProductComp key={i} item={item} />
                                                        ))}
                                                    </>
                                                    :
                                                    <div className="text-gray-400 text-center">No record found...</div>
                                                }
                                            </>
                                        }
                                        {active === 'approved' &&
                                            <>
                                                {approvedProducts.length > 0 ?
                                                    <>
                                                        {approvedProducts.slice(0, visibleCount).map((item, i) => (
                                                            <AdminProductComp key={i} item={item} />
                                                        ))}
                                                    </>
                                                    :
                                                    <div className="text-gray-400 text-center">No record found...</div>
                                                }
                                            </>
                                        }
                                        {active === 'declined' &&
                                            <>
                                                {declinedProducts.length > 0 ?
                                                    <>
                                                        {declinedProducts.slice(0, visibleCount).map((item, i) => (
                                                            <AdminProductComp key={i} item={item} />
                                                        ))}
                                                    </>
                                                    :
                                                    <div className="text-gray-400 text-center">No record found...</div>
                                                }
                                            </>
                                        }
                                    </div>
                                </>
                                :
                                <div className="text-gray-400 text-center">No record found...</div>
                            }
                            {visibleCount < length &&
                                <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center capitalize rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto mt-6'>show older products</button>
                            }
                        </>
                    }
                </div>
            </div>
        </AdminProductsLayout>
    )
}

export default AdminAllProducts