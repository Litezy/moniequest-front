import moment from 'moment';
import React, { useState } from 'react'
import { FaUser } from "react-icons/fa";
;

const Comments = ({ item }) => {
  return (
    <div className='w-full px-4 relative py-2 rounded-md bg-primary/20'>
      <div className="w-full flex-col gap-5 flex items-start">
        <div className="flex items-start gap-52 md:justify-between w-full">
          <div className="flex items-start gap-2">
            <div className="p-2 rounded-full bg-white ">
              <FaUser className='text-primary text-2xl' />
            </div>
            <div className="flex items-start flex-col text-base">
              <div className="text-white font-bold lg:text-xl">{item?.username}</div>
              <div className="text-xs text-gray-500">{moment(item?.createdAt).fromNow()}</div>
            </div>
          </div>
        </div>
        <div className="poppins ">{item?.content}</div>
      </div>
    </div>
  )
}

export default Comments