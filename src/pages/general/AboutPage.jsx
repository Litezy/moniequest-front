import React from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { aboututils } from '../../utils/pageUtils'

const AboutPage = () => {
  return (
    <PageLayout>
      <div className='pb-20 bg-dark w-full text-gray-200'>
        <div className=''>
          <div className='w-11/12 mx-auto py-3 '>
            <div className='text-2xl md:text-4xl font-bold text-white text-center capitalize'><span className='text-lightgreen'>MonieQuest:</span> Redefining Earning in the Digital Age</div>
          </div>
        </div>
        <div className="flex w-11/12 text-lg  text-gray-300 mx-auto  items-start mt-5 flex-col gap-8">
          <div className="">At MonieQuest, we empower individuals to explore new opportunities for earning and growth in the cryptocurrency and digital finance world. From completing surveys and participating in airdrops to redeeming gift cards and utilizing profit-enhancing tools, our platform bridges the gap between effort and reward.</div>
          <div className="flex items-start flex-col gap-1">
            <div className="">Our Mision</div>
            <div className="">To provide a trustworthy, user-centric platform where individuals can earn, grow, and thrive. We aim to simplify access to digital financial opportunities while inspiring innovation and productivity through cutting-edge tools and resources.</div>
          </div>
          <div className="flex items-start flex-col gap-1">
            <div className="">Our Vision</div>
            <div className="">To become the go-to platform for individuals seeking to maximize their earning potential in a secure, accessible, and rewarding environment.</div>
          </div>
          <div className="flex items-start flex-col gap-1">
            <div className="">Our Core Features</div>
            <div className="w-full lg:ml-10">{aboututils.map((item, i) => {
              return (
                <ul key={i} className='flex  flex-col w-11/12 lg:w-full mx-auto items-start lg:flex-row lg:items-center gap-1 mb-3'>
                  <li className='list-disc text-lightgreen'>{item.title}</li>
                  <li >{item.desc}</li>
                </ul>
              )
            })}
            </div>
          </div>
          <div className="">Join MonieQuest today and unlock a world of possibilities at your fingertips.</div>
        </div>
      </div>
    </PageLayout>
  )
}

export default AboutPage