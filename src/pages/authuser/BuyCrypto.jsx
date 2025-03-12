import React, { useEffect, useState } from 'react'
import { TbSwitch2 } from "react-icons/tb";
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import FormInput from '../../utils/FormInput';
import { currencies, instructions } from '../../AuthComponents/AuthUtils';
import ModalLayout from '../../utils/ModalLayout';
import { BsInfoCircleFill } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import Loader from '../../GeneralComponents/Loader';
import { Apis, AuthGetApi, AuthPostApi } from '../../services/API';
import ExchangeLayout from '../../AuthComponents/ExchangeLayout';
import { useAtom } from 'jotai';
import { CRYPTOS, PROFILE, UTILS } from '../../services/store';


const BuyCrypto = () => {
    const [screen, setScreen] = useState(1)
    const [check, setCheck] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isPageLoading, setIsPageLoading] = useState(!navigator.onLine);
    const [modal, setModal] = useState(false)
    const [utils] = useAtom(UTILS)
    const [user] = useAtom(PROFILE)
    const [cryptos] = useAtom(CRYPTOS)
    const navigate = useNavigate()

    const [forms, setForms] = useState({
        crypto: '',
        amount: '',
        network: '',
        wallet_add: '',
        isExpired: 'No',
        minimum: '',
        limit: ''
    })
    const rate = utils?.exchange_buy_rate
    const verified = user?.kyc_verified
    const kyc_threshhold = utils?.kyc_threshold

    const handleChange = (e) => {
        setForms({
            ...forms,
            [e.target.name]: e.target.value
        })
    }

    const handleAmount = (e) => {
        const rawValue = e.target.value.replace(/,/g, '');
        if (!isNaN(rawValue)) {
            const numericValue = Number(rawValue);
            setForms({
                ...forms,
                amount: numericValue.toLocaleString(),
            });
        }
    }

    const [selectedCurr, setSelectedCurr] = useState({
        name: currencies[0].name,
        symbol: currencies[0].symbol
    })

    const proceedFunc = () => {
        if (!forms.wallet_add) return ErrorAlert(`Please input your wallet address`)
        setModal(true)
    }

    const submit = (e) => {
        e.preventDefault()
        const amt = forms.amount.replace(/,/g, '')
        if (!forms.crypto) return ErrorAlert('crypto currency is required')
        if (!forms.amount) return ErrorAlert('amount is required')
        if (amt < forms.minimum) return ErrorAlert(`Minimum ${forms.crypto} buy amount is $${forms.minimum}`)
        if (amt > forms.limit) return ErrorAlert(`Sorry, you can't buy above $${forms.limit.toLocaleString()}`)
        if (amt > kyc_threshhold) {
            if (verified === 'false') {
                return ErrorAlert(`Please complete your kyc to be able to trade this amount!`)
            }
        }
        setScreen(2)
    }

    const [inNaira, setInNaira] = useState('')
    useEffect(() => {
        if (forms.amount) {
            const naira = parseInt(forms.amount.replace(/,/g, '')) * rate
            setInNaira(naira.toLocaleString())
        }
    }, [forms.amount, rate])


    const fetchOrders = async () => {
        try {
            const res = await AuthGetApi(Apis.transaction.crypto_order_history)
            if (res.status !== 200) {
                console.log(res.msg)
                return;
            }
            return res.data
        } catch (error) {
            console.log(error)
        }
    }

    const confirmAndBuy = async (e) => {
        e.preventDefault();
        setModal(false);

        const formdata = {
            crypto_currency: forms.crypto,
            type: 'buy',
            wallet_address: forms.wallet_add,
            network: forms.network,
            amount: forms.amount,
            wallet_exp: forms.isExpired,
            rate: rate
        };

        setLoading(true);
        try {
            const response = await AuthPostApi(Apis.transaction.buy_crypto, formdata);
            if (response.status !== 201) return ErrorAlert(res.msg)
            fetchOrders();
            await new Promise((resolve) => setTimeout(resolve, 2000));
            SuccessAlert(response.msg);
            navigate(`/user/exchange/orders`);

        } catch (error) {
            ErrorAlert(error.message);
        } finally {
            setLoading(false);
        }
    };

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


    const SelectCrypto = (e) => {
        const { value } = e.target;
        const crypto = cryptos.find((coin) => coin.name === String(value));
        if (crypto) {
            setForms((prevForms) => ({
                ...prevForms,
                crypto: crypto.name,
                network: crypto.network,
                symbol: crypto.symbol,
                minimum: crypto.buy_min,
                limit: crypto.buy_max
            }));
        } else {
            console.error("Selected crypto not found.");
        }
    };


    return (
        <ExchangeLayout>
            <div className='w-full'>
                {loading &&
                    <Loader title={`submitting order`} />
                }

                {isPageLoading &&
                    <div className="mt-10 w-11/12  lg:w-2/3 mx-auto">
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

                {!isPageLoading && <div className="w-11/12 mx-auto lg:w-full">
                    {screen === 1 &&
                        <div className="w-full  lg:w-2/3 mx-auto flex items-center justify-center">
                            <div className="flex w-full  mx-auto mt-5 items-start gap-5 flex-col">
                                <div className="flex items-start gap-2 flex-col w-full">
                                    <div className="font-bold text-lg">Crypto Currency:</div>
                                    <select onChange={SelectCrypto} className='bg-dark w-full text-white border border-gray-300 rounded-md py-2 px-4'>
                                        <option value="" disabled selected>
                                            -- select --
                                        </option>
                                        {cryptos &&
                                            cryptos.map((coin, i) => (
                                                <option value={coin.name} key={i} className="outline-none">
                                                    {coin.name}
                                                </option>
                                            ))}
                                    </select>
                                    <div className="text-red-600 text-xs">Please Note: you can only buy a minimum of ${forms.minimum} and maximum of ${forms.limit.toLocaleString()}. verify your account to increase limit</div>
                                </div>
                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Amount:</div>
                                    <div className="w-full items-center flex pr-2 gap-2 border border-gray-400 rounded-lg">
                                        <div className="w-full">
                                            <FormInput name={`amount`} border={false} value={forms.amount} onChange={handleAmount} placeholder={selectedCurr.symbol} />
                                        </div>
                                        <div className="">{selectedCurr.name}</div>
                                    </div>

                                </div>
                                <div className="flex item-center justify-between w-full">
                                    <div className="text-sm">Amount in Naira</div>
                                    <div className="flex items-center gap-1">
                                        <div className="text-sm">{inNaira}</div>
                                        <TbSwitch2 className='text-lightgreen ' />
                                    </div>
                                </div>
                                <div className="flex w-full item-center text-base lg:text-sm justify-between">
                                    <div className="text-sm">Buying rate</div>
                                    <div className="">{rate}/$</div>
                                </div>
                                <button onClick={submit} className={`bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-full h-fit py-3.5 text-lg rounded-xl`}>Buy Crypto</button>

                            </div>
                        </div>
                    }
                    {screen === 2 &&
                        <div className="w-full  flex items-center justify-center">
                            <div className="flex w-11/12 lg:w-2/3  mx-auto mt-5 items-start gap-5 flex-col">
                                {modal &&

                                    <ModalLayout setModal={setModal} clas={`w-11/12 lg:w-1/2 mx-auto`}>
                                        <div className="w-full flex flex-col items-center gap-5 bg-white text-dark py-10 rounded-md px-10  ">
                                            <div className="w-full flex flex-col items-center justify-center">
                                                <BsInfoCircleFill className='text-2xl lg:text-3xl ' />
                                                <div className="text-xl font-bold">Please read the instructions below</div>
                                            </div>
                                            <div className="flex flex-col items-start gap-2 mt-2">
                                                {instructions.map((inst, i) => {
                                                    return (
                                                        <ul key={i} className=" list-disc text-sm">
                                                            <li>{inst}</li>
                                                        </ul>
                                                    )
                                                })}
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <input checked={check} type="checkbox" onChange={(e) => setCheck(e.target.checked)} />
                                                <p>I agree to the instructions above and want to proceed to the payment window.</p>
                                            </div>
                                            <button onClick={confirmAndBuy} className='mt-10 w-full rounded-md bg-ash hover:bg-lightgreen text-white py-3'>Confirm</button>
                                        </div>
                                    </ModalLayout>
                                }
                                <div className="flex items-start gap-2 flex-col w-full">
                                    <div className="text-center  w-full text-2xl">Buying <span className='text-lightgreen font-bold'>{currencies[0].symbol}{forms.amount}</span> worth of {forms.symbol} at <br /> <span className='text-lightgreen font-bold'>{currencies[1].symbol}{inNaira}</span></div>
                                </div>
                                <div className="text-sm text-center w-full">kindly provide your wallet address</div>

                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Network</div>
                                    <div className="w-full ">
                                        <FormInput read={true} value={forms.network} />

                                        <div className="text-red-600 mt-1 text-sm">Please ensure that the network you select matches the wallet address provided to prevent any loss of funds.</div>

                                    </div>
                                </div>
                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Wallet Address</div>
                                    <div className="w-full flex items-center gap-1 border rounded-md  px-2">
                                        <div className="w-full">
                                            <FormInput name={`wallet_add`} border={false} value={forms.wallet_add} onChange={handleChange} />
                                        </div>
                                        <div
                                            onClick={() =>
                                                navigator.clipboard.readText().then((text) => {
                                                    setForms((prevForms) => ({
                                                        ...prevForms,
                                                        wallet_add: text,
                                                    }));
                                                })

                                            }
                                            className="text-sm cursor-pointer text-lightgreen">paste</div>
                                    </div>
                                </div>
                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Does this wallet expire?</div>
                                    <div className="w-full ">
                                        <select onChange={(e) => setForms({ ...forms, isExpired: e.target.value })} className=" border-gray-300 bg-dark   
                                    w-full text-white border   rounded-md py-2 px-4">
                                            <option value={`no`} className="outline-none">No</option>
                                            <option value={`yes`} className="outline-none bg-transparent">Yes</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between w-full gap-10">
                                    <button onClick={() => setScreen(1)} className='w-1/2 bg-primary text-lg rounded-xl py-3'>back</button>
                                    <button onClick={proceedFunc} className={`bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-1/2 h-fit py-3 text-lg rounded-xl`}>Confirm</button>
                                </div>

                            </div>
                        </div>
                    }


                </div>}

            </div>
        </ExchangeLayout>
    )
}

export default BuyCrypto