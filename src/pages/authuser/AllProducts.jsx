import React, { useEffect, useMemo, useState } from 'react'
import { CiSearch } from 'react-icons/ci';
import FormInput from '../../utils/FormInput';
import { Apis, AuthGetApi } from '../../services/API';
import ProductsLayout from '../../AuthComponents/ProductsLayout';
import ProductComp from '../../AuthComponents/ProductComp';


const AllProducts = () => {
    const tags = ['all', 'pending', 'approved', 'declined']
    const [active, setActive] = useState(tags[0])
    const [search, setSearch] = useState('')
    const [staticData, setStaticData] = useState([])
    const [userProducts, setUserProducts] = useState([])
    const [dataLoading, setDataLoading] = useState(true)

    useEffect(() => {
        const FetchUserProducts = async () => {
            try {
                const response = await AuthGetApi(Apis.product.user_products)
                if (response.status === 200) {
                    setStaticData(response.msg)
                    setUserProducts(response.msg)
                }

            } catch (error) {
                //
            } finally {
                setDataLoading(false)
            }
        }
        FetchUserProducts()
    }, [])

    const pendingProducts = useMemo(() => {
        return userProducts.filter((ele) => ele.status === 'pending');
    }, [userProducts])
    const approvedProducts = useMemo(() => {
        return userProducts.filter((ele) => ele.status === 'approved');
    }, [userProducts])
    const declinedProducts = useMemo(() => {
        return userProducts.filter((ele) => ele.status === 'declined');
    }, [userProducts])

    const FilterProducts = () => {
        const mainData = staticData
        if (search.length > 1) {
            const filtered = mainData.filter(item => String(item.title).toLocaleLowerCase().startsWith(search.toLocaleLowerCase()) || String(item.gen_id).toLocaleLowerCase().startsWith(search.toLocaleLowerCase()))
            setUserProducts(filtered)
        } else {
            setUserProducts(mainData)
        }
    }

    return (
        <ProductsLayout>
            <div className='w-11/12 mx-auto'>
                <div className="w-full lg:w-2/3 mx-auto relative">
                    <FormInput placeholder='Search by title and ID' value={search} onChange={(e) => setSearch(e.target.value)} className="!rounded-lg" onKeyUp={FilterProducts} />
                    <div className="absolute top-3 right-3">
                        <CiSearch className='text-xl cursor-pointer text-white' />
                    </div>
                </div>
                <div className="grid md:grid-cols-6 grid-cols-1 gap-2 items-center mt-4">
                    <div className="text-zinc-300 font-semibold capitalize text-sm lg:text-base col-span-1">Sort products by:</div>
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
                            {userProducts.length > 0 ?
                                <>
                                    <div className='flex flex-col gap-4'>
                                        {active === 'all' &&
                                            <>
                                                {userProducts.map((item, i) => (
                                                    <ProductComp key={i} item={item} />
                                                ))}
                                            </>
                                        }
                                        {active === 'pending' &&
                                            <>
                                                {pendingProducts.length > 0 ?
                                                    <>
                                                        {pendingProducts.map((item, i) => (
                                                            <ProductComp key={i} item={item} />
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
                                                        {approvedProducts.map((item, i) => (
                                                            <ProductComp key={i} item={item} />
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
                                                        {declinedProducts.map((item, i) => (
                                                            <ProductComp key={i} item={item} />
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
                                <div className="w-full text-gray-400 text-center">No record found...</div>
                            }
                        </>
                    }
                </div>
            </div>
        </ProductsLayout>
    )
}

export default AllProducts