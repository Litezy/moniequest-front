import React, { useEffect, useState } from "react";
import PageLayout from "../../GeneralComponents/PageLayout";
import { FaCheckCircle } from "react-icons/fa";
import { IoIosSearch } from "react-icons/io";
import { IoCart } from "react-icons/io5";
import { Link, useSearchParams } from "react-router-dom";
import { MoveToSection, MoveToTop } from "../../utils/pageUtils";
import CartComponent from "../../GeneralComponents/CartComponent";
import FormInput from "../../utils/FormInput";
import { Apis, GetApi, imageurl } from "../../services/API";
import empty from '../../assets/images/empty.webp'
import { MdDoubleArrow } from "react-icons/md";


const ProductsPage = () => {
  const [staticData, setStaticData] = useState([])
  const [products, setProducts] = useState([])
  const localName = 'products'
  const localData = JSON.parse(localStorage.getItem(localName))
  const [cartItems, setCartItems] = useState(localData || []);
  const [dataLoading, setDataLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [submitBtn, setSubmitBtn] = useState(false)
  //pagination
  const [searchParams, setSearchParams] = useSearchParams()
  const active = Number(searchParams.get('page')) || 1
  const [currentPage, setCurrentPage] = useState(active)
  const productsPerPage = 12
  const totalPages = Math.ceil(products.length / productsPerPage)
  const startIndex = (currentPage - 1) * productsPerPage
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage)


  useEffect(() => {
    const FetchAllListedProducts = async () => {
      try {
        const response = await GetApi(Apis.admin.listed_products)
        if (response.status === 200) {
          setStaticData(response.msg)
          setProducts(response.msg)
        }
      } catch (error) {
        //
      } finally {
        setDataLoading(false)
      }
    }
    FetchAllListedProducts()
  }, [])

  useEffect(() => {
    if (!localData) {
      localStorage.setItem(localName, JSON.stringify([]))
    }
  }, [cartItems])

  const AddToCart = (item) => {
    const findIfCartExist = cartItems.find((ele) => ele.id === item.id);
    if (!findIfCartExist) {
      setCartItems([...cartItems, item]);
      const currentData = JSON.parse(localStorage.getItem(localName))
      currentData.push(item)
      localStorage.setItem(localName, JSON.stringify(currentData))
    }
  }

  const CartButton = (id) => {
    const exists = cartItems.some(ele => ele.id === id)
    return exists ? (
      <span>Added to Cart</span>
    ) : (
      <>
        <IoCart className="text-lg" />
        <span>Add to Cart</span>
      </>
    )
  }

  const FilterProducts = () => {
    const mainData = staticData
    if (search.length > 2) {
      const filtered = mainData.filter(item => item.title.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.gen_id.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.category.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.feature1.toLocaleLowerCase().includes(search.toLocaleLowerCase()) || item.feature2.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
      setProducts(filtered)
    } else {
      setProducts(staticData)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setSubmitBtn(true)
      } else {
        setSubmitBtn(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const GetPagination = () => {
    const pages = []
    const maxButtons = 2

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1)
      let leftLimit = Math.max(2, currentPage - 1)
      let rightLimit = Math.min(totalPages - 1, currentPage + 1)
      if (leftLimit > 2) pages.push("...")
      for (let i = leftLimit; i <= rightLimit; i++) pages.push(i)
      if (rightLimit < totalPages - 1) pages.push("...")
      pages.push(totalPages)
    }
    return pages
  }

  const ChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage)
      if (newPage > 1) {
        setSearchParams({ page: newPage })
      } else {
        setSearchParams({})
      }
    }
  }

  return (
    <PageLayout>
      {submitBtn &&
        <div
          data-aos='fade-up-left' data-aos-duration="1000"
          className="fixed z-40 rounded-full cursor-pointer right-5 top-1/2">
          <Link to={`/login`} className="w-fit px-4 py-2 bg-ash text-white rounded-md">Submit your product</Link>
        </div>}
      <div className="pb-20 bg-dark">
        <div className="pageBg">
          <div className="w-full h-full bg-[#212134cc] py-10">
            <div className="md:text-4xl text-3xl font-bold text-white text-center capitalize">
              products
            </div>
          </div>
        </div>
        <div className="w-11/12 mx-auto text-gray-200 mt-16">
          <CartComponent cartItems={cartItems} setCartItems={setCartItems} dataLoading={dataLoading} />
          <div className="flex flex-col gap-2 items-center mt-20" id="section">
            <div className="md:text-3xl text-2xl font-bold text-center">Say Goodbye to Stress, Simplify your Hustle, Maximize your Wealth!
            </div>
            <div className="md:text-lg font-bold text-center">“Products you can Trust, Knowledge that pays”</div>
            <div className="flex gap-2 items-center mt-2">
              <FormInput placeholder='Find available products and eBooks' className='md:!w-96 !w-64' value={search} onChange={(e) => setSearch(e.target.value)} onKeyUp={FilterProducts} />
              <button className="outline-none w-fit h-fit bg-ash py-2 px-4 text-2xl rounded-lg" onClick={FilterProducts}>
                <IoIosSearch />
              </button>
            </div>
            <div className="mt-2 lg:w-1/2 text-center">Equip yourself with tools and knowledge designed by experts to help you simplify your workflow, manage income effectively and turn your dreams into reality.
            </div>
          </div>
          <div className="mt-16">
            {dataLoading ?
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {new Array(4).fill(0).map((_, i) => (
                  <div key={i} className='w-72 h-80 rounded-[4px] bg-slate-400 animate-pulse p-1'>
                    <div className="w-full h-48 bg-slate-500 rounded-t-[4px]"></div>
                  </div>
                ))}
              </div>
              :
              <>
                {products.length > 0 ?
                  <div className="flex flex-col gap-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
                      {currentProducts.map((item, i) => {
                        const categories = item?.category ? JSON.parse(item.category) : []
                        const discountPrice = item?.discount_percentage && item?.price ? (100 - item.discount_percentage) / 100 * item.price : 0
                        return (
                          <div key={i} className="bg-primary h-fit md:w-full w-11/12 mx-auto rounded-[4px] relative z-10">
                            {item.discount_percentage &&
                              <>
                                <div className="bg-red-700 text-white text-[0.8rem] uppercase font-extrabold py-1.5 px-3 absolute -top-1 -left-3">
                                  {item?.discount_percentage}% off
                                </div>
                                <div className="edge"></div>
                              </>
                            }
                            <Link to={`/products/${item.id}/${item.slug}`} onClick={MoveToTop}>
                              <img
                                src={`${imageurl}/products/${item?.image}`}
                                alt='product image'
                                className="w-full h-48 rounded-t-[4px] object-cover object-center"
                              />
                            </Link>
                            <div className="flex flex-col gap-4 px-2 py-4">
                              <div className="flex justify-between items-center">
                                <div className="capitalize text-sm font-bold">
                                  {item?.title}
                                </div>
                                <FaCheckCircle className="text-lightgreen text-xl" />
                              </div>
                              <div className="flex justify-between gap-4 items-center">
                                {categories.length > 0 &&
                                  <div className="w-full overflow-x-auto scrollsdown cursor-all-scroll">
                                    <div className='w-fit flex gap-1 text-xs text-lightgreen truncate'>
                                      {categories.map((ele, i) => (
                                        <div key={i}>{ele}{i !== categories.length - 1 && ','}</div>
                                      ))}
                                    </div>
                                  </div>
                                }
                                <div className="flex gap-2 items-center text-sm font-extrabold">
                                  {item?.discount_percentage ?
                                    <>
                                      <div className="text-red-700 underline">
                                        ₦{discountPrice.toLocaleString()}
                                      </div>
                                      <div className="line-through">
                                        ₦{item.price && item.price.toLocaleString()}
                                      </div>
                                    </>
                                    :
                                    <div>₦{item.price && item.price.toLocaleString()}</div>
                                  }
                                </div>
                              </div>
                              <button
                                className="outline-none w-full h-fit flex gap-2 items-center justify-center py-2 bg-ash hover:bg-secondary uppercase text-sm font-semibold rounded-[4px] text-white tracking-wider"
                                onClick={() => AddToCart(item)}
                              >
                                {CartButton(item.id)}
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="flex justify-center gap-2 md:text-sm text-xs border-t border-[#333350] pt-6">
                      <button
                        onClick={() => { ChangePage(currentPage - 1); MoveToSection(`section`, 100, 'auto') }}
                        disabled={currentPage === 1}
                        className={`border md:px-3.5 px-2.5 py-2 border-[#333350] rounded-full ${currentPage !== 1 && 'hover:text-lightgreen'}`}><MdDoubleArrow className="rotate-180" /></button>
                      {GetPagination().map((page, i) => (
                        <button
                          key={i}
                          onClick={() => { ChangePage(page); MoveToSection(`section`, 100, 'auto') }}
                          disabled={page === "..."}
                          className={`py-1 md:px-3.5 px-2.5 rounded-full text-white border border-[#333350] ${currentPage === page ? "bg-ash" : "bg-none"}`}>{page}</button>
                      ))}
                      <button
                        onClick={() => { ChangePage(currentPage + 1); MoveToSection(`section`, 100, 'auto') }}
                        disabled={currentPage === totalPages}
                        className={`md:px-3.5 px-2.5 py-2 border border-[#333350] rounded-full ${currentPage !== totalPages && 'hover:text-lightgreen'}`}><MdDoubleArrow /></button>
                    </div>
                  </div>
                  :
                  <div className='flex gap-1 items-center justify-center col-span-4'>
                    <div className='text-center'>No products listed yet...</div>
                    <img src={empty} alt='empty img' className='size-8'></img>
                  </div>
                }
              </>
            }
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default ProductsPage;
