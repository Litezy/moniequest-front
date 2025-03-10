import React from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import { useNavigate } from 'react-router-dom'
import { services } from '../../utils/pageUtils'

const TermsPage = () => {
  const navigate = useNavigate()
  return (
    <PageLayout>
      <div className='bg-dark w-full'>
        <div className=''>
          <div className='w-full h-full py-5'>
            <div className='md:text-4xl capitalize text-2xl font-bold text-white text-center'>Our Terms of service</div>
          </div>
        </div>
        <div className='w-11/12 mx-auto text-lg pt-5 pb-10'>
          <div className='text-white md:text-xl text-lg'>Welcome to MonieQuest! By accessing our platform, you agree to the terms below.</div>
          <div className="flex text-gray-300 items-start gap-3 flex-col mt-10">
            <div className="w-full flex flex-col">
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 h-fit'>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">1. Acceptance of terms</div>
                  <div className="text-base">By using MonieQuest, you agree to these <span className='text-lightgreen'>Terms and Conditions</span> and our <span onClick={() => navigate('/privacy_policy')} className='text-lightgreen cursor-pointer'>Privacy Policy</span>.</div>
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">2. Account Registration</div>
                  {services.slice(0, 2).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>

                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">3. Earning Tasks and Rewards</div>
                  {services.slice(2, 4).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">4. MonieQuest Exchange</div>
                  {services.slice(4, 6).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">5. User-Contributed Tools</div>
                  {services.slice(6, 7).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">6. Liability Limitations</div>
                  {services.slice(7, 9).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">7. Governing Law</div>
                  {services.slice(9, 10).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full h-fit'>
                  <div className="text-lightgreen">8. Termination</div>
                  {services.slice(10, 11).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full h-fit'>
                  <div className="text-lightgreen">9. Fees</div>
                  {services.slice(11, 12).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
                      </div>
                    )
                  })}
                </div>
                <div className='border-2 border-[#2f2f47] flex items-start flex-col gap-2 p-4 rounded-3xl w-full'>
                  <div className="text-lightgreen">10. Modifications to Terms</div>
                  {services.slice(12, 13).map((que, i) => {
                    return (
                      <div className=''>
                        <ul key={i} className="flex items-start gap-1 mb-1 list-disc flex-col ">
                          <div className="text-base">{que}</div>
                        </ul>
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

export default TermsPage