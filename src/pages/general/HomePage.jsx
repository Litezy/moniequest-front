import React, { useEffect, useMemo, useState } from 'react';
import PageLayout from '../../GeneralComponents/PageLayout';
import AirdropDiv from '../../GeneralComponents/AirdropDiv';
import FormButton from '../../utils/FormButton';
import { Link } from 'react-router-dom';
import { examplefaqs, MoveToTop } from '../../utils/pageUtils';
import { FiPlus, FiMinus } from "react-icons/fi";
import Testimonials from '../../GeneralComponents/Testimonials';
import { Apis, GetApi } from '../../services/API';
import '../../styles/HomePage.css'

const HomePage = () => {
  const [airdrops, setAirdrops] = useState([]);
  const [faq, setFaq] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    const FetchAllOpenAirdrops = async () => {
      try {
        const response = await GetApi(Apis.admin.all_open_airdrops);
        if (response.status === 200) {
          setAirdrops(response.msg);
        }
      } catch (error) {
        console.log(error)
      } finally {
        setDataLoading(false);
      }
    };
    FetchAllOpenAirdrops();
  }, []);

  const deFiAirdrops = useMemo(() => airdrops.filter((ele) => ele.category === 'deFi'), [airdrops]);
  const featuredAirdrops = useMemo(() => airdrops.filter((ele) => ele.category === 'featured'), [airdrops]);
  const newAirdrops = useMemo(() => airdrops.filter((ele) => ele.category === 'new'), [airdrops]);
  const NFTAirdrops = useMemo(() => airdrops.filter((ele) => ele.category === 'NFT'), [airdrops]);
  const potentialAirdrops = useMemo(() => airdrops.filter((ele) => ele.category === 'potential'), [airdrops]);
  const earnCryptoAirdrops = useMemo(() => airdrops.filter((ele) => ele.category === 'earn_crypto'), [airdrops]);

  const handleQuestions = (i) => {
    setFaq(faq === i ? '' : i);
  }

  return (
    <PageLayout>
      <div className="pb-20 w-full bg-dark">
        {/* Hero Section */}
        <div className="pageBg min-h-96 md:h-[25rem] overflow-hidden  md:w-full">
          <div className="w-full h-full  bg-dark/70 md:bg-dark/10  ">
            <div className="w-full h-full md:pt-16 pb-10 pt-12 px-4">
              <div className="w-11/12 mx-auto text-center md:mr-10">
                <h1 className="md:text-4xl text-2xl capitalize md:mb-5 mb-3 font-extrabold text-white lg:w-3/5 mx-auto glowing-text">
                  <span className="text-gradient">Get paid</span> for participating in Airdrops
                </h1>
                <div className="flex items-center justify-center">
                  <div className="flex items-center  text-base md:text-lg font-bold text-white flex-col gap-2" data-aos="fade-up">
                    <p className='hidden lg:block'>Our platform ensures you are always ahead in the crypto space and maximizing your earnings.</p>
                    <p>With over <span className="text-lightgreen font-bold ">500 updates</span> available, you could earn up to <span className="text-lightgreen font-bold">$2,000</span> per month by just participating.</p>
                    <p>The simplest and fastest way of making money online.</p>
                    <p className="text-base md:text-xl lg:text-2xl">Also trade your <span className="text-lightgreen font-bold">Coins</span> and <span className="text-lightgreen font-bold">Gift Cards</span> with us today</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Airdrop Section */}
        <div className="w-11/12 mx-auto">
          <div className="flex flex-col gap-8 mt-6" data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
            {dataLoading ? (
              <>
                <div className="flex md:gap-32 gap-10 items-center justify-center">
                  {new Array(2).fill(0).map((_, i) => (
                    <div key={i} className="w-36 h-12 rounded-md bg-slate-400 animate-shimmer"></div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-14 justify-center">
                  {new Array(3).fill(0).map((_, i) => (
                    <div className="flex flex-col gap-2" key={i}>
                      <div className="flex flex-col gap-4">
                        {new Array(2).fill(0).map((_, j) => (
                          <div key={j} className="w-72 h-40 rounded-md bg-slate-400 animate-shimmer"></div>
                        ))}
                      </div>
                      <div className="w-full h-14 rounded-md bg-slate-400 animate-shimmer"></div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="flex md:gap-32 gap-10 items-center justify-center">
                  <Link to="/airdrops" onClick={MoveToTop}>
                    <FormButton title="Browse for Airdrops" className="!text-sm !rounded-md !py-2 md:!py-3 !px-3 md:!px-4 !w-fit glow-button" />
                  </Link>
                  <Link to="/airdrops?category=potential" onClick={MoveToTop}>
                    <FormButton title="Potential Airdrops" className="!text-sm !capitalize !rounded-md !py-2 md:!py-3 !px-4 md:!px-6 !w-fit glow-button" />
                  </Link>
                </div>
                <div className="flex flex-wrap gap-14 justify-center text-gray-200">
                  {deFiAirdrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lightgreen font-bold text-xl neon-title">DeFi Airdrops</h3>
                      <div className="flex flex-col gap-4">
                        {deFiAirdrops.slice(0, 2).map((item, i) => (
                          <AirdropDiv key={i} item={item} className="airdrop-card" />
                        ))}
                      </div>
                      <Link to="/airdrops/deFi" onClick={MoveToTop}>
                        <FormButton title="Show More DeFi Airdrops" className="!text-sm !capitalize !rounded-md !py-4 pulse-button" />
                      </Link>
                    </div>
                  )}
                  {featuredAirdrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lightgreen font-bold text-xl neon-title">Featured Airdrops</h3>
                      <div className="flex flex-col gap-4">
                        {featuredAirdrops.slice(0, 2).map((item, i) => (
                          <AirdropDiv key={i} item={item} className="airdrop-card" />
                        ))}
                      </div>
                      <Link to="/airdrops/featured" onClick={MoveToTop}>
                        <FormButton title="Show More Featured Airdrops" className="!text-sm !capitalize !rounded-md !py-4 pulse-button" />
                      </Link>
                    </div>
                  )}
                  {newAirdrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lightgreen font-bold text-xl neon-title">New Airdrops</h3>
                      <div className="flex flex-col gap-4">
                        {newAirdrops.slice(0, 2).map((item, i) => (
                          <AirdropDiv key={i} item={item} className="airdrop-card" />
                        ))}
                      </div>
                      <Link to="/airdrops/new" onClick={MoveToTop}>
                        <FormButton title="Show More New Airdrops" className="!text-sm !capitalize !rounded-md !py-4 pulse-button" />
                      </Link>
                    </div>
                  )}
                  {NFTAirdrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lightgreen font-bold text-xl neon-title">NFT Airdrops</h3>
                      <div className="flex flex-col gap-4">
                        {NFTAirdrops.slice(0, 2).map((item, i) => (
                          <AirdropDiv key={i} item={item} className="airdrop-card" />
                        ))}
                      </div>
                      <Link to="/airdrops/NFT" onClick={MoveToTop}>
                        <FormButton title="Show More NFT Airdrops" className="!text-sm !capitalize !rounded-md !py-4 pulse-button" />
                      </Link>
                    </div>
                  )}
                  {potentialAirdrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lightgreen font-bold text-xl neon-title">Potential Airdrops</h3>
                      <div className="flex flex-col gap-4">
                        {potentialAirdrops.slice(0, 2).map((item, i) => (
                          <AirdropDiv key={i} item={item} className="airdrop-card" />
                        ))}
                      </div>
                      <Link to="/airdrops/potential" onClick={MoveToTop}>
                        <FormButton title="Show More Potential Airdrops" className="!text-sm !capitalize !rounded-md !py-4 pulse-button" />
                      </Link>
                    </div>
                  )}
                  {earnCryptoAirdrops.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-lightgreen font-bold text-xl neon-title">Earn Crypto Airdrops</h3>
                      <div className="flex flex-col gap-4">
                        {earnCryptoAirdrops.slice(0, 2).map((item, i) => (
                          <AirdropDiv key={i} item={item} className="airdrop-card" />
                        ))}
                      </div>
                      <Link to="/airdrops/earn_crypto" onClick={MoveToTop}>
                        <FormButton title="Show More Earn Crypto Airdrops" className="!text-sm !capitalize !rounded-md !py-4 pulse-button" />
                      </Link>
                    </div>
                  )}
                  <div className="max-w-[18rem] h-fit bg-primary p-4 how-it-works">
                    <div className="font-bold text-center text-white">How it Works for Airdrop Farmers</div>
                    <div className="flex flex-col gap-4 mt-6 pb-4">
                      <div className="flex flex-col gap-2">
                        <div className="text-lightgreen uppercase"><span className="step-badge">1</span>Browse Airdrops</div>
                        <div className="text-sm pl-5">Use advanced filters to easily search through airdrop opportunities.</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-lightgreen uppercase"><span className="step-badge">2</span>Select and Participate</div>
                        <div className="text-sm pl-5">Choose a crypto airdrop campaign and follow the guide.</div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <div className="text-lightgreen uppercase"><span className="step-badge">3</span>Stay Updated</div>
                        <div className="text-sm pl-5">Enable notifications for real-time alerts.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Exchange Section */}
          <div className="mt-20 h-fit w-full bg-primary text-white py-10 px-4 flex flex-col gap-8 justify-center items-center exchange-section" data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
            <div className="relative w-fit">
              <h2 className="md:text-5xl text-3xl font-bold capitalize py-2 glowing-text">Exchange</h2>
              <div className="border-t-4 border-zinc-300 md:w-36 w-24 absolute top-0 left-0 slide-in"></div>
              <div className="border-b-4 border-zinc-300 md:w-36 w-24 absolute bottom-0 right-0 slide-in"></div>
            </div>
            <p className="text-center md:text-lg max-w-2xl mx-auto">Easily Buy & Sell Gift Cards and Crypto instantly using bank transfers. <span className="text-lightgreen">Simple, fast and reliable.</span></p>
            <Link to="/login">
              <FormButton title="Tap and Trade" className="!w-fit !px-10 !rounded-md glow-button bounce-button" onClick={MoveToTop} />
            </Link>
          </div>

          {/* FAQ Section */}
          <div className="flex flex-col gap-10 mt-20">
            <div className="relative w-fit mx-auto text-white">
              <h2 className="md:text-5xl text-3xl font-bold capitalize py-2 glowing-text">FAQ</h2>
              <div className="border-t-4 border-zinc-500 md:w-16 w-10 absolute top-0 right-0 slide-in"></div>
              <div className="border-b-4 border-zinc-500 md:w-16 w-10 absolute -bottom-2 left-0 slide-in"></div>
            </div>
            <div className="h-fit w-full md:px-20 xl:px-28 px-6 pt-10 pb-10 bg-gradient-to-tr from-primary to-secondary text-white faq-section" data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine" data-aos-duration="600">
              <h3 className="text-center md:text-4xl text-2xl font-bold capitalize">Trade, upload and earn with us</h3>
              <p className="text-center text-semi-white md:text-lg text-sm font-semibold md:w-3/4 mx-auto mt-4">Below are some frequently asked questions. For more, see all <Link to="/faqs" className="text-lightgreen">FAQs</Link></p>
              <div className="flex flex-col md:gap-10 gap-7 mt-10">
                {examplefaqs.map((item, i) => (
                  <div className={`w-full h-fit flex flex-col gap-4 faq-item ${faq === i ? 'active p-2' : ''}`} key={i}>
                    <div onClick={() => handleQuestions(i)} className="flex justify-between gap-4 items-center w-full h-fit cursor-pointer md:text-2xl text-lg font-bold">
                      <span className="text-zinc-400">{item.title}</span>
                      <div className="md:text-2xl text-lg text-lightgreen faq-icon">{faq !== i ? <FiPlus /> : <FiMinus />}</div>
                    </div>
                    <div className={`md:text-base text-sm ${faq === i ? 'block slide-down' : 'hidden'}`}>{item.desc}</div>
                  </div>
                ))}
              </div>
              <div className="w-full ml-auto mt-10">
                <Link to="/faqs" onClick={MoveToTop} className="w-fit px-4 py-2 rounded-xl bg-ash glow-button">View More</Link>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <div className="flex flex-col gap-10 mt-20">
            <div className="relative w-fit mx-auto">
              <h2 className="md:text-5xl text-3xl font-bold capitalize py-2 text-white glowing-text">Testimonials</h2>
              <div className="border-t-4 border-zinc-500 md:w-44 w-28 absolute top-0 left-0 slide-in"></div>
              <div className="border-b-4 border-zinc-500 md:w-44 w-28 absolute bottom-0 right-0 slide-in"></div>
            </div>
            <Testimonials className="testimonial-section" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default HomePage;