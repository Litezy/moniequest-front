import React from 'react'
import PageLayout from '../../GeneralComponents/PageLayout'
import handsImg from '../../assets/images/hands2.png'
import { IoTriangleSharp } from "react-icons/io5";
import { MoveToSection } from '../../utils/pageUtils';

const Jobs = [
    "Content Marketing Specialist", "Full-Stack Developer", "Project & Partnerships Coordinator", "Crypto & Financial Analyst", "Transaction Specialist (Customer Operations)", "Data & Reporting Specialist", "Multimedia Designer", "Payment & Security Specialist"
]

const Hire = [
    "Application Review", "Interviews", "Offer", "Onboarding"
]

const Hiring = () => {
    return (
        <PageLayout>
            <div className='pb-20 bg-dark w-full text-gray-200'>
                <div className='pageBg'>
                    <div className='w-full h-full bg-[#212134cc] py-10'>
                        <div className='md:text-4xl text-3xl capitalize font-bold text-white text-center'>we are hiring</div>
                    </div>
                </div>
                <div className="w-11/12 mx-auto mt-10">
                    <div className='flex flex-col gap-4 items-center justify-center'>
                        <div className='text-4xl font-bold capitalize text-center'>work at monieQuest.com</div>
                        <div onClick={() => MoveToSection(`jobs`, 100)}>
                            <button className='outline-none w-fit h-fit bg-ash px-6 py-2 capitalize rounded-md'>view jobs</button>
                        </div>
                    </div>
                    <div className='flex flex-col gap-10 mt-16'>
                        <div className='grid md:grid-cols-6 grid-cols-1 gap-12 items-center'>
                            <div className='md:col-span-4 col-span-1 border-2 border-[#2f2f47] p-4 rounded-3xl'>
                                <div className='flex flex-col gap-2'>
                                    <div className='text-3xl capitalize font-bold text-lightgreen'>our values</div>
                                    <div className='flex flex-col gap-4 text-lg'>
                                        <div>We prioritize honesty and ethical practices in all operations. Everything we do is centered on providing exceptional value and service to our customers. We strive for the highest standards in every task we undertake. We celebrate diverse ideas and perspectives.</div>
                                        <div>By living these values, we create an organization that earns trust, fosters meaningful relationships, and ensures every team member is aligned on delivering exceptional results with authenticity and respect for all.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='md:col-span-2 col-span-1 md:mx-0 mx-auto'>
                                <img src={handsImg} alt='joining_hands' className='w-auto h-56'></img>
                            </div>
                        </div>
                        <div className='flex flex-col gap-4'>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-xl capitalize font-bold text-lightgreen'>collaborations</div>
                                        <div className='flex flex-col gap-4'>
                                            <div>Even in a remote setting. We use tools like Slack and Trello to stay connected.
                                                We value open communication and encourage team members to share ideas freely.
                                                Every achievement is a team effort, and we celebrate milestones together.
                                            </div>
                                            <div>Strong collaboration ensures every voice is heard and contributions are valued, leading
                                                to a connected and empowered team that achieves more together than individually.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-xl capitalize font-bold text-lightgreen'>hardcore</div>
                                        <div className='flex flex-col gap-4'>
                                            <div>We’re looking for people who are excited about what they do, willing to push
                                                boundaries.
                                                We expect team members to take initiative and deliver results without
                                                micromanagement.
                                                Challenges are opportunities to grow—we tackle them head-on
                                            </div>
                                            <div>We don’t just meet challenges; we embrace them. Passion and accountability drive
                                                innovation, ensuring we thrive in even the toughest situations.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-xl capitalize font-bold text-lightgreen'>humility</div>
                                        <div className='flex flex-col gap-4'>
                                            <div>No one knows everything, and that’s okay. We value curiosity and a willingness to
                                                learn over ego.
                                                Success is a shared effort, and we celebrate the team, not individual accolades.
                                                We embrace constructive criticism and use it as fuel to grow.
                                                Everyone’s voice matters, whether you're the founder or an intern.
                                            </div>
                                            <div>A humble team creates an open, collaborative environment where everyone thrives
                                                and contributes freely.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-xl capitalize font-bold text-lightgreen'>freedom</div>
                                        <div className='flex flex-col gap-4'>
                                            <div>Work when and where you’re most productive—what matters is the result, not the
                                                clock.
                                                We trust our team members to take ownership of their tasks and make decisions
                                                without constant oversight.
                                                Whether you prefer structured processes or creative chaos, we support your unique
                                                approach as long as it gets results.

                                            </div>
                                            <div>Offering freedom empowers team members, fuels creativity, and fosters long-term
                                                loyalty and satisfaction.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='grid md:grid-cols-2 grid-cols-1 gap-4'>
                                <div className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-xl capitalize font-bold text-lightgreen'>user-Focused</div>
                                        <div className='flex flex-col gap-4'>
                                            <div>We put ourselves in the users' shoes to truly understand their needs and challenges.
                                                Every decision we make revolves around enhancing the user experience. We’re always
                                                listening and iterating based on feedback.
                                                We measure success by the value we bring to our users' lives, not just numbers.
                                                Building trust with our users is our ultimate priority; transparency and reliability guide
                                                us.
                                            </div>
                                            <div>This ensures every team member understands the importance of users and commits to
                                                delivering quality service.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='border-2 border-[#2f2f47] p-4 rounded-3xl w-full'>
                                    <div className='flex flex-col gap-2'>
                                        <div className='text-xl capitalize font-bold text-lightgreen'>who thrives at monieQuest</div>
                                        <div className='flex flex-col gap-4'>
                                            <div>We’re looking for individuals who exhibit:
                                                Self-Starter Attitude: We value individuals who can take initiative and work
                                                independently.
                                            </div>
                                            <div>Continuous Learners: Those who seek growth, stay curious, and adapt thrive in our
                                                culture.
                                                Accountability: We take ownership of our tasks and responsibilities.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='italic w-5/6 mx-auto'>"At <span className='text-lightgreen'>MonieQuest</span>, we believe in building a team that grows together, supports each other, and drives innovation. We’re not just hiring employees;
                            we’re building a family of creators, dreamers, and doers who want to leave a lasting impact on the world of crypto, finance, and productivity."
                        </div>
                    </div>
                    <div className='flex flex-col gap-10 mt-16' id='jobs'>
                        <div className='flex flex-col gap-2'>
                            <div className='capitalize font-bold text-3xl text-lightgreen'>choose your jobs</div>
                            <div className='text-lg'>Choose the position that best matches your interests and expertise.</div>
                        </div>
                        <div className='grid md:grid-cols-3 grid-cols-1 gap-6'>
                            {Jobs.map((item, i) => (
                                <div key={i} className='flex flex-col gap-2'>
                                    <div className='font-bold capitalize'>{item}</div>
                                    <div className='capitalize text-gray-300'>global / remote</div>
                                    <a href={`mailto:corporate@moniequest.com?subject=Job%20Application`}>
                                        <button className='outline-none w-fit h-fit py-1.5 px-5 bg-ash rounded-md text-sm'>Apply</button>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='flex flex-col gap-10 mt-16'>
                        <div className='flex flex-col gap-2'>
                            <div className='capitalize font-bold text-3xl text-lightgreen'>how we hire</div>
                            <div className='text-lg'>The interview process typically spans 2 to 4 weeks and involves four separate interviews</div>
                        </div>
                        <div className='grid grid-cols-4'>
                            {Hire.map((item, i) => (
                                <div key={i} className='flex flex-col gap-2'>
                                    <div className="w-full overflow-x-auto scrollsdown cursor-all-scroll">
                                        <div className='w-fit text-sm md:text-lg font-semibold ml-2 truncate'>{item}</div>
                                    </div>
                                    <div className='flex items-center relative'>
                                        <div className='w-[6%] z-20'>
                                            <div className='size-6 bg-lightgreen rounded-full -ml-0.5'>
                                            </div>
                                        </div>
                                        <div className='w-[94%] flex items-center z-10'>
                                            <div className='border-b-[6px] w-full border-lightgreen'></div>
                                            {i === 3 && <IoTriangleSharp className='text-lightgreen text-lg rotate-90 -ml-1' />}
                                        </div>
                                    </div>
                                    <div className='md:text-3xl text-2xl font-semibold ml-2'>0{i + 1}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </PageLayout>
    )
}

export default Hiring