import React, { useCallback, useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import TransComp from '../../AuthComponents/TransComp';
import AuthPageLayout from '../../AuthComponents/AuthPageLayout';
import { Apis, AuthGetApi } from '../../services/API';

const TransHistory = () => {
  const tags = ['All', 'Crypto', 'GiftCards', 'Withdrawal']
  const [active, setActive] = useState(tags[0])
  const [searchValue, setSearchValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [transData, setTransData] = useState([])
  const [transactions, setTransactions] = useState([])

  const fetchTrans = useCallback(async () => {
    const res = await AuthGetApi(Apis.transaction.all_trans)
    if (res.status !== 200) {
      setLoading(true)
    };
    const data = res.data
    setTransData(data)
  }, [loading])

  useEffect(() => {
    fetchTrans()
  }, []);

  useEffect(() => {
    setTransactions(transData)
  }, [transData])

  const filterTrans = () => {
    const mainData = transData
    if (searchValue.length > 1) {
      const filtered = mainData.filter(trans => String(trans.amount).toLowerCase().startsWith(searchValue.toLocaleLowerCase()) || String(trans.type).toLowerCase().startsWith(searchValue.toLocaleLowerCase()) || 
      String(trans.trans_id).toLowerCase().startsWith(searchValue.toLocaleLowerCase()) || 
      String(trans.tag).toLowerCase().startsWith(searchValue.toLocaleLowerCase()) || 
      String(trans.order_no).toLocaleLowerCase().startsWith(searchValue.toLocaleLowerCase()))
      setTransactions(filtered)
    } else {
      setTransactions(mainData)
    }
  }


  return (
    <AuthPageLayout>
      {loading &&

        <div className="flex w-11/12 mx-auto mt-20 items-start animate-pulse gap-3 flex-col">
          {
            new Array(5).fill(0).map((_, i) => {
              return (
                <div key={i} className="w-full mb-3 flex items-center gap-2">
                  <div className="w-14 rounded-full h-14 bg-gray-500"></div>
                  <div className="bg-gray-500 w-3/4 h-14 rounded-md"></div>
                </div>
              )
            })
          }

        </div>

      }

      {!loading && <div className="w-11/12 mx-auto">

        <div className="w-full my-2">
          <div className="w-full lg:w-2/3 flex gap-2 pr-2 mx-auto items-center border border-zinc-500 rounded-lg ">
            <input type="text" onChange={(e) => setSearchValue(e.target.value)} onKeyUp={filterTrans}
              placeholder='Search by amount, type, Transaction ID or Order ID '
              value={searchValue}
              className='outline-none focus-within:outline-none focus:outline-none focus:ring-0 bg-transparent border-none focus:border-none focus:border w-[95%]' />
            <div className="">
              <CiSearch onClick={filterTrans} className='text-xl cursor-pointer text-white' />
            </div>
          </div>
        </div>
        <div className="my-5 text-2xl font-bold lg:text-center text-lightgreen">Recent Transactions</div>
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
          {transData.length > 0 ?
            <>
              {active === tags[0] &&
                <>
                  {transactions.length > 0 && transactions.map((trans, i) => {
                    return (
                      <TransComp key={i} trans={trans} />
                    )
                  })}
                </>
              }
              {active === tags[1] &&
                <>
                  {transactions.filter((trx) => trx.tag === 'crypto').map((trans, i) => {
                    return (
                      <TransComp key={i} trans={trans} />
                    )
                  })}
                </>
              }
              {active === tags[2] &&
                <>
                  {transactions.filter((trx) => trx.tag === 'giftcard').map((trans, i) => {
                    return (
                      <TransComp key={i} trans={trans} />
                    )
                  })}
                </>
              }
              {active === tags[3] &&
                <>
                  {transactions.filter((trx) => trx.tag === 'bank').map((trans, i) => {
                    return (
                      <TransComp key={i} trans={trans} />
                    )
                  })}
                </>
              }
            </>
            :
            <div className="w-full text-gray-400 text-center">No record found...</div>
          }
        </div>
      </div>}
    </AuthPageLayout>
  )
}

export default TransHistory