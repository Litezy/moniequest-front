import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { NextButton, PrevButton, usePrevNextButtons } from './EmblaButtons'
import { Apis, AuthGetApi, imageurl } from '../services/API'

export default function Testimonials(props) {
    const [data, setData] = useState([])
    const localName = 'Testimonials';

    const fetchTestimonials = async () => {
        try {
            const res = await AuthGetApi(Apis.user.get_testimonials);
            if (res.status !== 200) return;
            const data = res.data;
            localStorage.setItem(localName, JSON.stringify(data));
            setData(data);
            return data;
        } catch (error) {
            console.error("Fetch Error:", error);
        }
    };

    useEffect(() => {
        fetchTestimonials()
        const storedData = JSON.parse(localStorage.getItem(localName));
        if (storedData) {
            setData(storedData)
        }
        else {
            localStorage.setItem(localName, JSON.stringify([]))
        }
    }, [])

    // embla slider
    // console.log(`${imageurl}/testimonials/${data[0]?.gen_id}/${data[0]?.image}`)

    const { slides, options } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options, [
        Autoplay({ playOnInit: true, delay: 3000 })
    ])
    const [isPlaying, setIsPlaying] = useState(true)
    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    const onButtonAutoplayClick = useCallback(
        (callback) => {
            const autoplay = emblaApi?.plugins()?.autoplay
            if (!autoplay) return

            const resetOrStop =
                autoplay.options.stopOnInteraction === false
                    ? autoplay.reset
                    : autoplay.stop

            resetOrStop()
            callback()
        },
        [emblaApi]
    )

    const toggleAutoplay = useCallback(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        const playOrStop = autoplay.isPlaying() ? autoplay.stop : autoplay.play
        playOrStop()
    }, [emblaApi])

    useEffect(() => {
        const autoplay = emblaApi?.plugins()?.autoplay
        if (!autoplay) return

        setIsPlaying(autoplay.isPlaying())
        emblaApi
            .on('autoplay:play', () => setIsPlaying(true))
            .on('autoplay:stop', () => setIsPlaying(false))
            .on('reInit', () => setIsPlaying(autoplay.isPlaying()))
    }, [emblaApi])

    const optimizeImageUrl = (url) => {
        if (!url || !url.includes('cloudinary.com')) return url; // Return unchanged if not Cloudinary
        const parts = url.split('/upload/');
        return `${parts[0]}/upload/q_auto,f_webp/${parts[1]}`; // Insert transformations
    };
    return (
        <div className="embla">
            <div className="embla__viewport" ref={emblaRef}>
                <div className="embla__container">
                    {data.map((item, index) => (
                        <div className="embla__slide border border-[grey] px-5 pt-5 lg:p-10 text-zinc-300" key={index}>
                            <div className="">
                                <img src={optimizeImageUrl(item.image)}
                                    alt={`${item.firstname} image`} className="size-28 object-cover border-4 border-white shadow-2xl rounded-full" />
                            </div>
                            <div className="font-bold text-xl  lg:text-2xl pt-10">{item.firstname} {item.lastname}</div>
                            <div className="pt-5 pb-10 lg:text-lg text-sm md:w-full w-3/4">{item.content}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="embla__controls text-white">
                <div className="embla__buttons">
                    <PrevButton
                        onClick={() => onButtonAutoplayClick(onPrevButtonClick)}
                        disabled={prevBtnDisabled}
                    />
                    <NextButton
                        onClick={() => onButtonAutoplayClick(onNextButtonClick)}
                        disabled={nextBtnDisabled}
                    />
                </div>
            </div>
        </div>
    )
}