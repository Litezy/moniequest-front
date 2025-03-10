import React, { useCallback, useEffect, useState } from 'react'
import { SlSocialDropbox } from 'react-icons/sl'
import { HiCheckCircle } from "react-icons/hi2";
import { FaXmark } from "react-icons/fa6";
import { MdError } from 'react-icons/md';
import moment from 'moment';
import { Link } from 'react-router-dom'
import AuthPageLayout from '../../AuthComponents/AuthPageLayout';
import { Apis, AuthGetApi, AuthPostApi, AuthPutApi } from '../../services/API';

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const [dataLoading, setDataLoading] = useState(true)
  const [visibleCount, setVisibleCount] = useState(10)

  const FetchNotifications = useCallback(async () => {
    try {
      const response = await AuthGetApi(Apis.notification.all_notis)
      if (response.status === 200) {
        setNotifications(response.msg)
      }
    } catch (error) {
      //
    } finally {
      setDataLoading(false)
    }
  }, [])

  useEffect(() => {
    FetchNotifications()
  }, [FetchNotifications])

  const MarkAllRead = async () => {
    try {
      const response = await AuthPutApi(Apis.notification.update_all_notis)
      if (response.status === 200) {
        FetchNotifications()
      }
    } catch (error) {
    }
  }

  const MarkSingleRead = async (id) => {
    try {
      const response = await AuthPutApi(Apis.notification.update_single_notis, { notification_id: id })
      if (response.status === 200) {
        FetchNotifications()
      }
    } catch (error) {
    }
  }

  const DeleteNotification = async (id) => {
    try {
      const response = await AuthPostApi(Apis.notification.delete_notis, { notification_id: id })
      if (response.status === 200) {
        FetchNotifications()
      }
    } catch (error) {
    }
  }


  return (
    <AuthPageLayout>
      <div className="w-11/12 mx-auto">
        <div className='flex justify-between gap-4 items-center'>
          <div className='text-3xl font-bold'>Notifications</div>
          <div className='text-sm capitalize cursor-pointer hover:text-lightgreen' onClick={MarkAllRead}>mark all as read</div>
        </div>
        <div className='mt-8'>
          {dataLoading ?
            <div className='w-full h-32 rounded-md bg-slate-500 animate-pulse'>
            </div>
            :
            <>
              {notifications.length > 0 ?
                <div className='flex flex-col gap-8'>
                  <div className='flex flex-col gap-4'>
                    {notifications.slice(0, visibleCount).map((item, i) => (
                      <div key={i} className={`${item.read === 'true' ? 'bg-primary' : 'bg-[#212144]'} relative w-full h-fit text-sm cursor-pointer rounded-md overflow-hidden shadow_auth`} onClick={() => MarkSingleRead(item.id)} >
                        <Link to={item.url} className='flex flex-col gap-2 w-full h-full p-3'>
                          <div className='flex flex-col gap-3'>
                            <div className='flex gap-1 items-center border-b border-[grey] w-fit'>
                              <div className='capitalize text-base font-extrabold'>{item.title}</div>
                              {item.status !== 'failed' ?
                                <HiCheckCircle className='text-lightgreen' />
                                :
                                <MdError className='text-red-600' />}
                            </div>
                            <div className='font-medium'>{item.content}</div>
                          </div>
                          <div className=' text-xs text-gray-300 font-bold mt-2 ml-auto'>{moment(item.createdAt).fromNow()}</div>
                        </Link>
                        <div className='absolute top-1 right-1 text-gray-300 hover:text-lightgreen p-1 cursor-pointer bg-secondary rounded-full text-xs' onClick={() => DeleteNotification(item.id)}>
                          <FaXmark />
                        </div>
                      </div>
                    ))}
                  </div>
                  {visibleCount < notifications.length &&
                    <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto'>See previous notifications</button>
                  }
                </div>
                :
                <div className='mt-10 flex flex-col gap-2 items-center justify-center'>
                  <SlSocialDropbox className='md:text-4xl text-6xl' />
                  <div>no notification found</div>
                </div>
              }
            </>
          }
        </div>
      </div>
    </AuthPageLayout>
  )
}

export default Notification