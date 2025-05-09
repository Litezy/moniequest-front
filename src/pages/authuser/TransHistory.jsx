import React, { useCallback, useEffect, useState } from 'react'
import { CiSearch } from "react-icons/ci";
import TransComp from '../../AuthComponents/TransComp';
import AuthPageLayout from '../../AuthComponents/AuthPageLayout';
import { Apis, AuthGetApi } from '../../services/API';

const TransHistory = () => {
  const tags = ['All', 'Crypto', 'GiftCards', 'Withdrawal']
  const [active, setActive] = useState(tags[0])
  const [searchValue, setSearchValue] = useState('')
  const [transData, setTransData] = useState([])
  const [transactions, setTransactions] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(10)
  const [length, setLength] = useState(0)

  const fetchTrans = async () => {
    try {
      const res = await AuthGetApi(Apis.transaction.all_trans)
      if (res.status !== 200) return;
      const data = res.data
      setTransData(data)
      setTransactions(data)
      setLength(data.length)
    } catch (error) {
      //
    } finally {
      setDataLoading(false)
    }
  }

  useEffect(() => {
    fetchTrans()
  }, []);

  const filterTrans = () => {
    const mainData = transData;

    if (searchValue.length > 1) {
      const filtered = mainData.filter(trans => {
        const lowerSearch = searchValue.toLowerCase();

        return (
          String(trans.type).toLowerCase().startsWith(lowerSearch) ||
          String(trans.trans_id).toLowerCase().startsWith(lowerSearch) ||
          String(trans.tag).toLowerCase().startsWith(lowerSearch) ||
          String(trans.order_no).toLowerCase().startsWith(lowerSearch) ||
          String(trans.amount).startsWith(lowerSearch) ||
          (
            trans.tag === 'bank'
              ? String(trans.amount).includes(searchValue)
              : trans.type === 'buy'
                ? String((trans.amount + trans.gas_fee) * trans.rate).includes(searchValue)
                : String(trans.amount * trans.rate).includes(searchValue)
          )
        );
      });
      setTransactions(filtered);
    } else {
      setTransactions(mainData);
    }
  };

  useEffect(() => {
    setVisibleCount(10)
    const filtered = transactions.filter((trx) => active === tags[1] ? trx.tag === 'crypto' : active === tags[2] ? trx.tag === 'giftcard' : active === tags[3] ? trx.tag === 'bank' : trx)
    setLength(filtered.length)
  }, [active, transactions])


  return (
    <AuthPageLayout>

      <div className="w-11/12 mx-auto">
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
                      {transactions.slice(0, visibleCount).map((trans, i) => {
                        return (
                          <TransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                  {active === tags[1] &&
                    <>
                      {transactions.filter((trx) => trx.tag === 'crypto').slice(0, visibleCount).map((trans, i) => {
                        return (
                          <TransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                  {active === tags[2] &&
                    <>
                      {transactions.filter((trx) => trx.tag === 'giftcard').slice(0, visibleCount).map((trans, i) => {
                        return (
                          <TransComp key={i} trans={trans} />
                        )
                      })}
                    </>
                  }
                  {active === tags[3] &&
                    <>
                      {transactions.filter((trx) => trx.tag === 'bank').slice(0, visibleCount).map((trans, i) => {
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
              {visibleCount < length &&
                <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center capitalize rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto'>show older transactions</button>
              }
            </>
          }
        </div>
      </div>
    </AuthPageLayout>
  )
}

export default TransHistory