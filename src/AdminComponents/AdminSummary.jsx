import React from 'react'
import { currencySign } from '../utils/pageUtils';

const AdminSummary = ({ item }) => {
    const colorClasses = {
        red: 'bg-red-500',
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        pink: 'bg-pink-500',
        indigo: 'bg-indigo-500',
        teal: 'bg-teal-500',
        orange: 'bg-orange-500',
        cyan: 'bg-cyan-500',
        amber: 'bg-amber-500',
        lime: 'bg-lime-500',
        gray: 'bg-gray-500',
        orangee:'bg-orange-300',
        greene:'bg-green-300'
    };

    return (
        <div className="shadow-md rounded-e-xl h-32 mb-5 bg-primary">
            <div className={`w-full ${colorClasses[item?.color]} rounded-lg h-1/2  flex font-bold px-3  items-center justify-center`}>
                <h1 className='text-base lg:text-lg capitalize text-center'>{item?.title}</h1>
            </div>
            <div className="h-1/2 flex items-center text-base lg:text-lg font-bold justify-center">{item?.cur && currencySign[0]}{item?.naira && currencySign[1]}{item?.value && item.value.toLocaleString()}</div>
        </div>
    )
}

export default AdminSummary