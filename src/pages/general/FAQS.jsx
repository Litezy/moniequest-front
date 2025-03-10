import React from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { airdropsfaqs, exchangefaqs, generalfaqs, profitfaqs } from '../../utils/pageUtils'

const FAQS = () => {
    return (
        <PageLayout>
            <div className="bg-dark text-zinc-300 ">
                <div className="">
                    <div className="w-full h-full pt-5 pb-8">
                        <div className="md:text-4xl text-3xl font-bold text-white text-center capitalize">
                            FAQs
                        </div>
                    </div>
                </div>
                <div className="w-11/12 mx-auto text-lg">
                    <div className="flex items-start gap-16 pb-10 flex-col">
                        <div className="flex items-start gap-4 flex-col">
                            <div className="md:text-3xl text-2xl font-bold text-lightgreen">General Questions</div>
                            <div className='flex flex-col gap-4'>
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                    {generalfaqs.map((que, i) => {
                                        return (
                                            <div key={i} className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                                <div className="flex items-start gap-1 mb-5 flex-col ">
                                                    <div className="text-lightgreen">{que.title}</div>
                                                    <div className="text-base">{que.desc}</div>
                                                </div>
                                            </div>

                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 flex-col">
                            <div className="md:text-3xl text-2xl font-bold text-lightgreen">Airdrop Questions</div>
                            <div className='flex flex-col gap-4'>
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                    {airdropsfaqs.map((que, i) => {
                                        return (
                                            <div key={i} className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                                <div className="flex items-start gap-1 mb-5 flex-col ">
                                                    <div className="text-lightgreen">{que.title}</div>
                                                    <div className="text-base">{que.desc}</div>
                                                </div>
                                            </div>

                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 flex-col">
                            <div className="md:text-3xl text-2xl font-bold text-lightgreen">Exchange Questions</div>
                            <div className='flex flex-col gap-4'>
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                    {exchangefaqs.map((que, i) => {
                                        return (
                                            <div key={i} className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                                <div className="flex items-start gap-1 mb-5 flex-col ">
                                                    <div className="text-lightgreen">{que.title}</div>
                                                    <div className="text-base">{que.desc}</div>
                                                </div>
                                            </div>

                                        )
                                    })}

                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 flex-col">
                            <div className="md:text-3xl text-2xl font-bold text-lightgreen">Profit Tools Questions</div>
                            <div className='flex flex-col gap-4'>
                                <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                    {profitfaqs.map((que, i) => {
                                        return (
                                            <div key={i} className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                                <div className="flex items-start gap-1 mb-5 flex-col ">
                                                    <div className="text-lightgreen">{que.title}</div>
                                                    <div className="text-base">{que.desc}</div>
                                                </div>
                                            </div>

                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default FAQS