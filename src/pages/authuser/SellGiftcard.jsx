import React, { useEffect, useRef, useState } from 'react'
import FormInput from '../../utils/FormInput'
import { currencies } from '../../AuthComponents/AuthUtils'
import { currencySign, ErrorAlert, SuccessAlert } from '../../utils/pageUtils'
import { SlClock } from 'react-icons/sl'
import { Link, useNavigate } from 'react-router-dom'
import Loader from '../../GeneralComponents/Loader'
import { CardsArray } from '../../AuthComponents/GiftcardsArray'
import { MdRateReview } from "react-icons/md";
import { Apis, AuthPostApi } from '../../services/API'
import Giftcards from '../../AuthComponents/Giftcards'
import { useAtom } from 'jotai'
import { UTILS } from '../../services/store'
import { countries } from '../../utils/countries'
import handleOutsideClicks from '../../utils/handleOutsideClicks'



const SellGiftcard = () => {

    //defining states
    const [selectBrand, setSelectBrand] = useState(false)
    const [screen, setScreen] = useState(1)
    const [cards, setCards] = useState({
        brand: `--Select Brand--`,
        amount: '',
        code: '',
        pin: '',
        has_pin: 'no',
        country: ''
    })
    const [utils] = useAtom(UTILS)
    const rate = utils?.giftcard_rate
    const [carderror, setCarderror] = useState({
        status: false,
        msg: '',
        color: ''
    })
    const [proceed, setProceed] = useState(false)
    const [selectedCard, setSelectedCard] = useState({
        brand: '', length: '', regex: '', codelength: '', pin: ''
    })
    const [selectedCurr, setSelectedCurr] = useState({
        name: currencies[0].name,
        symbol: currencies[0].symbol
    })
    const [loading, setLoading] = useState({ status: false, param: "" })
    const [isPageLoading, setIsPageLoading] = useState(!navigator.onLine)
    const [selectedCountry, setSelectedCountry] = useState({})
    const [selectCountry, setSelectCountry] = useState(false)

    //defining refs
    const brandref = useRef(null)
   

    //defining functions

    useEffect(() => {
        const findcard = () => {
            if (cards.brand) {
                const findBrand = CardsArray.filter((b) => b.brand === cards.brand)
                setSelectedCard(findBrand[0])
                // console.log(findBrand)
            }
        }

        findcard()
    }, [cards.brand])

    const handleAmount = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (!isNaN(rawValue)) {
            const numericValue = Number(rawValue);
            setCards({
                ...cards,
                amount: numericValue.toLocaleString(),
            });
        }
    }

    const checkCode = () => {
        if (!cards.country) return ErrorAlert('please select country')
        if (!selectedCard || !selectedCard.brand) {
            return ErrorAlert("Please select a gift card brand ");
        }
        if (!selectedCard.codelength) {
            return ErrorAlert(`Please enter a valid ${selectedCard.brand} code or re-enter last digits of your code.`);
        }
        if (!cards.amount) return ErrorAlert('Please input a valid amount')
        const selectedBrand = CardsArray.find(item => item.brand === selectedCard.brand)
        if (!selectedBrand) return ErrorAlert("Invalid brand selected");
        if (parseInt(selectedCard.codelength) !== selectedBrand.length) {
            setCarderror({ status: true, msg: 'code too short', color: 'red-600' });
            ErrorAlert(`Code must be ${selectedCard.length} characters long`);
            return setTimeout(() => {
                setCarderror({ status: false, msg: '', color: '' })
            }, 4000)
        }
        if (selectedCard.regex.test(selectedCard.regex)) {
            console.log("Invalid code")
            return setCarderror({ status: true, msg: 'Invalid code' });
        }
        // If all validations pass
        setCarderror({ status: true, msg: "valid code", color: 'green-600' });
        SuccessAlert('valid code')
        setProceed(true)
        return setTimeout(() => {
            setCarderror({ status: false, msg: "", color: '' });
        }, 4000)
    }

    const handleCode = (e) => {
        let value = e.target.value.replace(/[^A-Za-z0-9]/g, '');
        const selectedBrand = selectedCard.brand
        if (!selectedBrand) ErrorAlert('please select a giftcard brand')
        value = value.substring(0, selectedCard.length);
        const formattedValue = value.match(/.{1,5}/g)?.join('-') || value;
        const newval = formattedValue.replace(/-/g, '')
        setCards({
            ...cards,
            code: formattedValue
        });
        setSelectedCard({
            ...selectedCard,
            codelength: newval.length
        })
    };

    const handlePin = (e) => {
        let value = e.target.value.replace(/[^0-9]/g, '');
        value = value.substring(0, 4);
        setCards({
            ...cards,
            pin: value
        });
        setSelectedCard({
            ...selectedCard,
            pin: newval
        })
    }
    const sellCard = (e) => {
        e.preventDefault()
        if (!cards.country) return ErrorAlert('country is required')
        if (!cards.brand) return ErrorAlert('giftcard brand is required')
        if (!cards.amount) return ErrorAlert('giftcard amount is required')
        if (!cards.code) return ErrorAlert('giftcard code is missing, try again')
        if (cards.has_pin === 'yes' && cards.pin === '') return ErrorAlert('giftcard pin is missing, try again')
        setLoading({ status: true, param: 'check' })
        return setTimeout(() => {
            setLoading({ status: false, param: '' })
            setScreen(2)
        }, 2000)

    }

    const handleChange = (e) => {
        setCards({
            ...cards,
            [e.target.name]: e.target.value
        })
    }

    const selectABrand = (val) => {
        setCards({ ...cards, brand: val })
        setSelectBrand(false)
    }

    const [inNaira, setInNaira] = useState('')
    useEffect(() => {
        if (cards.amount) {
            const naira = parseInt(cards.amount.replace(/,/g, '')) * rate
            setInNaira(naira.toLocaleString())
        }
    }, [cards.amount, rate])

    const navigate = useNavigate()
    const confirmSend = async () => {
        setLoading({ status: true, param: 'confirmed' })
        const formdata = {
            brand: cards.brand,
            amount: cards.amount,
            code: cards.code,
            pin: cards.pin,
            rate: rate,
            country: cards.country
        }
        // return console.log(formdata)
        try {
            const res = await AuthPostApi(Apis.transaction.sell_giftcard, formdata)
            if (res.status !== 201) return ErrorAlert(res.msg)
            setCards({ ...cards, type: '', amount: '', code: '', pin: '', has_pin: 'no' })
            await new Promise((resolve) => setTimeout(resolve, 2000));
            SuccessAlert(res.msg)
            navigate('/user/giftcards/orders');
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading({ status: false, param: '' })
        }

    }

    useEffect(() => {
        const handleOnline = () => {
            setIsPageLoading(false);
        };
        const handleOffline = () => {
            setIsPageLoading(true);
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const chooseCountry = (val) => {
        setCards({
            ...cards,
            country: val
        })

    }

    handleOutsideClicks(brandref, () => setSelectBrand(false))
  

    return (
        <Giftcards>
            <div className='w-11/12 mx-auto lg:w-8/12 mt-5 lg:mt-10'>
                {loading.status && loading.param === 'check' &&
                    <Loader title={`processing`} />
                }
                {loading.status && loading.param === 'confirmed' &&
                    <Loader title={`submitting order`} />
                }
                {isPageLoading &&
                    <div className="mt-10 w-11/12  lg:w-11/12 mx-auto">
                        {new Array(4).fill(0).map((_, i) => {
                            return (
                                <div key={i} className="flex animate-pulse mb-5 items-start gap-1 flex-col">
                                    <div className="w-32 h-8 rounded-sm bg-gray-500"></div>
                                    <div className="w-full h-10 bg-gray-500 rounded-sm"></div>
                                </div>
                            )
                        })}
                    </div>

                }
                {!isPageLoading && screen === 1 &&
                    <div className="w-full flex items-start flex-col gap-4">
                        <div className="flex items-start gap-2 flex-col w-full">
                            <div className="font-bold">Country</div>
                            <div className="relative w-full">
                                <select
                                    onClick={() => setSelectCountry(!selectCountry)}
                                    className="border border-gray-600 text-white rounded-md px-4 py-2 cursor-pointer bg-dark w-full"
                                    value={cards.country}
                                    onChange={(e) => chooseCountry(e.target.value)}
                                >
                                    <option value="">-- Select Country --</option>
                                    {countries.map((item, i) => (
                                        <option key={i} value={item.name}>
                                            {item.name}
                                        </option>
                                    ))}
                                </select>

                            
                            </div>


                        </div>
                        <div className="flex items-start gap-2 flex-col w-full">
                            <div className="font-bold">Gift-Card Brand</div>
                            <div className='w-full relative bg-secondary  rounded-md cursor-pointer' id="">
                                <input onClick={() => setSelectBrand(true)} className='outline-none focus-within:outline-none focus:outline-none focus:ring-0 focus:border-gray-400 focus:border cursor-pointer  bg-transparent w-full h-fit py-3 text-lightgreen px-4 lg:text-sm text-base rounded-md'
                                    type="text" name="brand" value={cards.brand} onChange={handleChange} />
                                {selectBrand &&
                                    <div 
                                    ref={brandref}
                                    className="absolute h-96 w-full border rounded-md border-gray-600 px-10 top-1 overflow-y-auto scroll z-50 bg-dark">
                                        
                                        {CardsArray.map((gift, i) => {
                                            return (
                                                <div onClick={() => selectABrand(gift.brand)} key={i}
                                                   
                                                    className="flex w-full py-2 border-b-gray-600 border-b  items-center justify-between ">
                                                    <div className='w-2/3 text-base text-lightgreen' >{gift.brand}</div>
                                                    <div className="w-2/3 ">
                                                        <img src={gift.image} className='h-16 w-fit bg-cover ' alt={`${gift.brand} image`} />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex w-full items-start gap-2 flex-col  ">
                            <div className="font-bold ">Amount ({currencySign[0]}):</div>
                            <div className="w-full items-center flex px-2 justify-center py-1 gap-2 border border-gray-400 rounded-lg">
                                <div className="w-full ">
                                    <FormInput name={`amount`} border={false} value={cards.amount} onChange={handleAmount} placeholder={selectedCurr.symbol} />
                                </div>
                                <div className="">{selectedCurr.name}</div>
                            </div>

                        </div>
                        <div className="flex item-center justify-between w-full">
                            <div className="font-bold">Amount in Naira</div>
                            <div className="flex items-center gap-1 cursor-pointer">
                                <div className="text-sm">{inNaira}</div>
                            </div>
                        </div>
                        <div className="flex w-full item-center text-base lg:text-sm justify-between">
                            <div className="font-bold">Buying rate</div>
                            <div className="">{rate}/$</div>
                        </div>
                        <div className="flex items-start gap-2 w-full flex-col">
                            <div className="font-bold">Giftcard Code</div>
                            <div className="w-full">
                                <input
                                    className={`outline-none focus-within:outline-none focus:outline-none focus:ring-0 focus:border-gray-400 uppercase focus:border ${carderror.status ? `border-2 border-${carderror.color}` : 'border border-gray-400'} bg-transparent w-full h-fit  px-4 lg:text-sm text-base rounded-md `}
                                    placeholder={`XXXX-XXXX-XXXX-XXXX`}
                                    onKeyUp={() => setProceed(false)}
                                    type={`text`}
                                    onChange={handleCode}
                                    name='code'
                                    value={cards.code}
                                >
                                </input>
                                {carderror.status && <div className={`text-${carderror.color} text-sm`}>{carderror.msg}</div>}
                            </div>
                        </div>
                        <div className="flex f w-full gap-2">
                            <div className="">Has PIN?</div>
                            <select onChange={handleChange}
                                className='w-1/4 bg-secondary' name="has_pin" value={cards.has_pin} id="">
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                        {cards.has_pin === 'yes' &&
                            <div className="flex items-center gap-2 ">
                                <div className="">Card PIN</div>
                                <input type="text"
                                    className={`outline-none  w-1/2 focus-within:outline-none focus:outline-none focus:ring-0 focus:border-gray-400 bg-dark `}
                                    placeholder={`XXXX`}
                                    onChange={handlePin}
                                    name='pin'
                                    value={cards.pin}
                                />
                            </div>
                        }
                        <div className="mt-5 w-full">
                            <button onClick={proceed ? sellCard : checkCode} className={`w-full bg-ash  py-3 font-bold rounded-md`}>{proceed ? 'Proceed' : 'Check Code'}</button>
                        </div>
                    </div>
                }
                {!isPageLoading && screen === 2 &&
                    <div className="w-full">
                        <div className='flex flex-col gap-7 items-center max-w-md mx-auto mt-10'>
                            <MdRateReview className='text-8xl' />
                            <div className='text-center mont font-bold text-2xl'>Review Your Order</div>
                            <div className="w-11/12 mx-auto  border border-gray-500 rounded-md p-5">
                                <div className="w-full flex-col gap-3 flex items-center justify-between">
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">GiftCard Brand</div>
                                        <div className="text- font-bold text-lightgreen">{cards.brand}</div>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Buying Rate</div>
                                        <div className="text- font-bold text-lightgreen">{currencies[1].symbol}{rate}</div>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Amount in (USD)</div>
                                        <div className="text- font-bold text-lightgreen">
                                            {currencies[0].symbol}{parseInt(inNaira.replace(/,/g, '')) / rate}</div>
                                    </div>
                                    <div className="flex items-center justify-between w-full">
                                        <div className="text-base">Amount in (NGN)</div>
                                        <div className="text- font-bold text-lightgreen">{currencies[1].symbol}{inNaira}</div>
                                    </div>
                                </div>
                            </div>
                            <div onClick={() => setScreen(1)} className="flex w-full items-center justify-between gap-4">
                                <button className='w-1/2 bg-primary py-2 rounded-md'>back</button>
                                <button type='button' onClick={confirmSend} className='w-1/2 py-2 rounded-md bg-ash'>Confirm & Sell</button>
                            </div>
                        </div>
                    </div>}
                {!isPageLoading && screen === 3 && <div className="w-full">
                    <div className='flex flex-col gap-7 items-center max-w-md mx-auto mt-20'>
                        <SlClock className='text-8xl' />
                        <div className='text-center'>Thank you for choosing us! Please relax and keep an eye on your dashboard as we process your payment.</div>
                        <Link to="/user/dashboard">
                            <button className='bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-fit h-fit py-3 px-16 rounded-lg outline-none uppercase font-bold'>go to dashboard</button>
                        </Link>
                        <button onClick={() => setScreen(1)} className='text-sm text-white px-4 py-2 rounded-md bg-red-600'>Sell another card</button>
                    </div>
                </div>}

            </div>
        </Giftcards>
    )
}

export default SellGiftcard