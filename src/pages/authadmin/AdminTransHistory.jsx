import React, { useEffect, useState } from 'react'
import AdminPageLayout from '../../AdminComponents/AdminPageLayout'
import { CiSearch } from 'react-icons/ci'
import AdminTransComp from '../../AdminComponents/AdminTransComp'
import { Apis, AuthGetApi } from '../../services/API'
import { ErrorAlert } from '../../utils/pageUtils'

const AdminTransHistory = () => {
  const tags = ['All', 'Crypto', 'GiftCards', 'Withdrawal']
  const [active, setActive] = useState(tags[0])
  const [searchValue, setSearchValue] = useState('')
  const [dynamicData, setDynamicData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  const fetchTrans = async () => {
    try {
      const res = await AuthGetApi(Apis.admin.get_trans_history)
      if (res.status !== 200) return ErrorAlert(res.msg)
      const data = res.data
      setDynamicData(data)
      setTransactions(data)
    } catch (error) {
      console.log(error)
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    fetchTrans()
  }, []);

  const filterTrans = () => {
    const mainData = dynamicData
    if (searchValue.length > 1) {
      const filtered = mainData.filter(trans => String(trans.tag).toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase()) || String(trans.type).toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase()) || String(trans.trans_id).toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase()))
      if (filtered) {
        setTransactions(filtered)
      }
    } else {
      setTransactions(mainData)
    }
  }


  return (
    <AdminPageLayout>
      <div className='w-11/12 mx-auto'>
        <div className="w-full my-2">
          <div className="w-full lg:w-2/3 flex gap-2 pr-2 mx-auto items-center border border-zinc-500 rounded-lg ">
            <input type="text" onChange={(e) => setSearchValue(e.target.value)} onKeyUp={filterTrans}
              placeholder='Search by tag , type or ID '
              value={searchValue}
              className='outline-none focus-within:outline-none focus:outline-none focus:ring-0 bg-transparent border-none focus:border-none focus:border w-[95%]' />
            <div className="">
              <CiSearch onClick={filterTrans} className='text-xl cursor-pointer text-white' />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <div className="grid md:grid-cols-6 grid-cols-1 gap-2 items-center mt-4">
            <div className="text-zinc-300 font-semibold capitalize text-sm lg:text-base col-span-1">sort transactions:</div>
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
          <div className="text-zinc-400 mt-5">{active ? active === 'Withdrawal' ? 'Bank Withdrawal' : active : 'All'} Transactions</div>
        </div>
        <div className="w-full mt-5">
          {dataLoading ?
            <div className='flex items-center lg:grid lg:grid-cols-3 justify-between border-b border-slate-400 pb-1 w-full animate-pulse'>
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
            :
            <>
              {transactions.length > 0 ?
                <>
                  {active === tags[0] &&
                    <>
                      {transactions.length > 0 && transactions.map((trans, i) => {
                        return (
                          <AdminTransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                  {active === tags[1] &&
                    <>
                      {transactions.filter((trx) => trx.tag === 'crypto').map((trans, i) => {
                        return (
                          <AdminTransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                  {active === tags[2] &&
                    <>
                      {transactions.filter((trx) => trx.tag === 'giftcard').map((trans, i) => {
                        return (
                          <AdminTransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                  {active === tags[3] &&
                    <>
                      {transactions.filter((trx) => trx.tag === 'bank').map((trans, i) => {
                        return (
                          <AdminTransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                </>
                :
                <div className="w-full text-gray-400 text-center">No record found...</div>
              }
            </>
          }
        </div>
      </div>
    </AdminPageLayout>
  )
}

export default AdminTransHistory