import { useEffect, useRef, useState } from "react";
import AirdropDiv from "./AirdropDiv";
import { GiArrowScope } from "react-icons/gi";
import { Link } from "react-router-dom";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { MoveToTop } from "../utils/pageUtils";

const AirdropCarousel = ({ array, feature }) => {
    const containerRef = useRef(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);
    const scrollAmount = 500

    useEffect(() => {
        const container = containerRef.current;

        const checkScroll = () => {
            if (!container) return;
            setAtStart(container.scrollLeft <= 0);
            setAtEnd(container.scrollLeft + container.clientWidth >= container.scrollWidth);
        };

        container.addEventListener("scroll", checkScroll);
        checkScroll()

        return () => container.removeEventListener("scroll", checkScroll);
    }, []);

    const scrollLeft = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
        }
    };

    const scrollRight = () => {
        if (containerRef.current) {
            containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
        }
    };

    return (
        <div className="relative w-full">
            <div className='flex flex-col gap-4 pb-8 border-b border-gray-600'>
                <div className='flex justify-between gap-4 items-center'>
                    <div className='flex gap-3 items-center text-xl'>
                        <GiArrowScope />
                        <span className='capitalize font-bold'>{feature === 'earn_crypto' ? 'earn crypto' : feature} airdrops</span>
                    </div>
                    <div className='flex gap-4 items-center'>
                        <Link to={`/airdrops/${feature}`} className='capitalize text-sm hover:text-lightgreen' onClick={MoveToTop}>view all</Link>
                        <div className='md:flex gap-2 items-center hidden'>
                            <button className={`${atStart ? 'cursor-default' : 'cursor-pointer hover:bg-[#2f2f47]'} bg-primary  w-fit h-fit p-2 outline-none rounded-[3px] text-lightgreen text-sm prev-btn`} onClick={scrollLeft} disabled={atStart}><LuChevronLeft /></button>
                            <button className={`${atEnd ? 'cursor-default' : 'cursor-pointer hover:bg-[#2f2f47]'} bg-primary w-fit h-fit p-2 outline-none rounded-[3px] text-lightgreen text-sm next-btn`} onClick={scrollRight} disabled={atEnd}><LuChevronRight /></button>
                        </div>
                    </div>
                </div>
                <div ref={containerRef} className='overflow-x-auto whitespace-nowrap scroll-smooth flex gap-4 airdrop-container scrollsdown'>
                    {array.map((item, i) => (
                        <AirdropDiv key={i} item={item} className={`flex-none`} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AirdropCarousel;
