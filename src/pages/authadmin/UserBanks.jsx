import React, { useState } from 'react';
import { IoReturnUpBackOutline } from 'react-icons/io5';
import FormInput from '../../utils/FormInput';
import AnimateHeight from 'react-animate-height';
import AdminPageLayout from '../../AdminComponents/AdminPageLayout';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { USERBANKS } from '../../services/store';


const UserBanks = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [userbanks] = useAtom(USERBANKS)
  const [visibleCount, setVisibleCount] = useState(10)
  const toggleActive = (index) => {
    setActiveIndex((prevIndex) => (prevIndex === index ? null : index));
  };

  return (
    <AdminPageLayout>
      <div className="w-11/12 mx-auto">
        <div className="w-full flex items-center justify-between">
          <Link to={`/admin/all_users`}
            className="w-fit cursor-pointer mr-auto bg-primary text-white px-3 py-1 rounded-md"
          >
            <IoReturnUpBackOutline className="text-2xl" />
          </Link>
          <div className="text-lg font-semibold">User Banks</div>
        </div>

        <div className="my-5 bg-white text-dark w-full h-fit p-5 rounded-md shadow-md">
          <div className="text-center text-xl font-semibold">
            {userbanks.length < 1
              ? `${userbanks.length} bank`
              : `${userbanks.length} banks`} submitted
          </div>
        </div>

        <div>
          {userbanks.length > 0 && userbanks.slice(0, visibleCount).map((item, index) => (
            <div
              className="z-10 w-full relative bg-white rounded-lg mb-3 p-2"
              key={index}
            >
              <div className="w-full text-primary flex items-start gap-2 flex-col">
                <div className="flex items-center w-11/12 mx-auto">
                  <div className="self-center md:text-xl text-base font-semibold">
                    {item?.account_name}'s Bank Details
                  </div>
                  <div className="w-fit ml-auto">
                    <button
                      onClick={() => toggleActive(index)}
                      className="text-white bg-dark px-4 py-1 rounded-md"
                    >
                      {activeIndex === index ? 'Hide' : 'View'}
                    </button>
                  </div>
                </div>

                <AnimateHeight
                  duration={300}
                  height={activeIndex === index ? 'auto' : 0}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex w-full items-center gap-10 lg:flex-row justify-between">
                      <div className="lg:w-[45%] md:text-base text-sm">Holder's Fullname:</div>
                      <FormInput read={true} value={item?.account_name} />
                    </div>
                    <div className="flex w-full items-center gap-10 lg:flex-row justify-between">
                      <div className="lg:w-[45%] md:text-base  text-sm">Bank Name:</div>
                      <FormInput read={true} value={item?.bank_name} />
                    </div>
                    <div className="flex w-full items-center gap-10` lg:flex-row justify-between">
                      <div className="lg:w-[45%] md:text-base  text-sm">Bank Account No:</div>
                      <FormInput read={true} value={item?.account_number} />
                    </div>
                  </div>
                </AnimateHeight>
              </div>
            </div>
          ))}
        </div>
        {visibleCount < userbanks.length &&
          <button onClick={() => setVisibleCount(visibleCount + 10)} className='md:w-1/2 w-full h-fit py-2 px-14 text-sm md:text-base flex items-center justify-center text-center capitalize rounded-md bg-ash hover:bg-primary cursor-pointer mx-auto mt-6'>show older banks</button>
        }
      </div>
    </AdminPageLayout>
  );
};

export default UserBanks;
