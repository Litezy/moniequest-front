import React from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { Policytutils } from '../../utils/pageUtils'

const PrivacyPolicy = () => {
  return (
    <PageLayout>
      <div className='bg-dark w-full'>
        <div className="pageBg">
          <div className="w-full h-full bg-[#212134cc] py-10">
            <div className="md:text-4xl text-3xl font-bold text-white text-center capitalize">
              our Privacy Policy
            </div>
          </div>
        </div>
        <div className='w-11/12 mx-auto text-lg pt-5 pb-10'>
          <div className='text-white'>We operate the MonieQuest platform and associated services (the "Service"). This Privacy Policy explains how we collect, use, and protect your personal information. By using the Service, you agree to the practices outlined below.</div>
          <div className="flex text-gray-300 items-start gap-3 flex-col mt-10">
            <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-4 rounded-3xl border-2 border-[#2f2f47]">
                <div className="w-full flex flex-col">
                  <div className="flex text-white mb-2 items-start flex-col gap-3">
                    <div className="text-lightgreen">1. Information We Collect</div>
                    <div className="">We collect the following information</div>
                  </div>
                  <div className="w-11/12 ml-1 text-base truncate ">
                    {Policytutils.slice(0, 3).map((item, i) => {
                      return (
                        <ul key={i} className='mb-2 text-gray-300 flex flex-col lg:flex-row gap-1  items-start'>
                          <li className='list-disc '>{item.title}</li>
                          <li className=''>{item.desc}</li>
                        </ul>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-[#2f2f47]">
                <div className="w-full flex flex-col">
                  <div className="flex text-white mb-2 items-start flex-col gap-3">
                    <div className="text-lightgreen">2. Use of Information</div>
                    <div className="">We use collected data to:</div>
                  </div>
                  <div className="w-11/12 ml-10 ">
                    {Policytutils.slice(3, Policytutils.length).map((item, i) => {
                      return (
                        <ul key={i} className='mb-2 text-gray-300 flex flex-col lg:flex-row gap-1  items-start'>
                          <li className='list-disc text-base '>{item.desc}</li>
                        </ul>
                      )
                    })}
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-[#2f2f47]">
                <div className="flex flex-col w-full gap-3">
                  <div className="text-lightgreen">3. Cookies</div>
                  <div className="text-base">Cookies help us personalize your experience. You can choose to disable cookies in your browser settings, though this may impact functionality.</div>
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-[#2f2f47]">
                <div className="flex flex-col w-full gap-3">
                  <div className="text-lightgreen">4. Third-Party Services</div>
                  <div className="text-base">Third-party providers may help us analyze usage patterns or deliver parts of our service. They are bound by confidentiality agreements and cannot use your information for any other purpose.</div>
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-[#2f2f47]">
                <div className="flex flex-col w-full gap-3">
                  <div className="text-lightgreen">5. Security</div>
                  <div className="text-base">We implement industry-standard measures to protect your information. However, no system is completely secure, and we advise caution when sharing sensitive details.</div>
                </div>
              </div>
              <div className="p-4 rounded-3xl border-2 border-[#2f2f47]">
                <div className="flex flex-col w-full gap-3">
                  <div className="text-lightgreen">6. Updates to this Policy</div>
                  <div className="text-base">We may update this policy from time to time. Changes will be reflected on this page, and significant updates will be communicated via email or platform notifications.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export default PrivacyPolicy