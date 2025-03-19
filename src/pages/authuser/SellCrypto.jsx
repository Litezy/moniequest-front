import React, { useEffect, useState } from 'react'
import { TbSwitch2 } from "react-icons/tb";
import { ErrorAlert, SuccessAlert } from '../../utils/pageUtils';
import FormInput from '../../utils/FormInput';
import { coinDetails, currencies, sellInstruction } from '../../AuthComponents/AuthUtils';
import ModalLayout from '../../utils/ModalLayout';
import { BsInfoCircleFill } from "react-icons/bs";
import { FaCopy } from 'react-icons/fa';
import { TfiTimer } from "react-icons/tfi";
import { useNavigate } from 'react-router-dom';
import Loader from '../../GeneralComponents/Loader';
import ExchangeLayout from '../../AuthComponents/ExchangeLayout';
import { Apis, AuthPostApi } from '../../services/API';
import { useAtom } from 'jotai';
import { CRYPTOS, UTILS } from '../../services/store';


const SellCrypto = () => {
    const [screen, setScreen] = useState(1)
    const [check, setCheck] = useState(false)
    const tags = ['BUY', 'SELL']
    const [modal, setModal] = useState(false)
    const [isPageLoading, setIsPageLoading] = useState(!navigator.onLine) 
    const [loading, setLoading] = useState(false)
    const [utils] = useAtom(UTILS)
    const [cryptos] = useAtom(CRYPTOS)
    const [forms, setForms] = useState({
        amount: '',
        trans_hash: '',
        symbol: '',
        crypto: "",
        network: '',
        wallet_add: '',
        minimum: '',
        limit: '',
        gas_fee: ''
    })
    const [active, setActive] = useState(tags[0])
    const [confirm, setConfirm] = useState(false)
    const rate = utils?.exchange_sell_rate

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

    const handleChange = (e) => {
        setForms({
            ...forms, [e.target.name]: e.target.value
        })
    }

    const [selectedCurr, setSelectedCurr] = useState({
        name: currencies[0].name,
        symbol: currencies[0].symbol
    })

    const [inNaira, setInNaira] = useState('')
    const [amountToReceive, setAmountToReceive] = useState('')
    useEffect(() => {
        if (forms.amount && forms.gas_fee) {
            const toPay = parseFloat(forms.amount.replace(/,/g, '')) - parseFloat(forms.gas_fee)
            setAmountToReceive(toPay.toLocaleString())
            const naira = toPay * rate
            setInNaira(naira.toLocaleString())
        }
    }, [forms.amount, rate, forms.gas_fee])

    const submit = (e) => {
        e.preventDefault()
        const amt = forms.amount.replace(/,/g, '')
        if (!forms.amount) return ErrorAlert('amount is required')
        if (amt < forms.minimum) return ErrorAlert(`Minimum ${forms.crypto} sell amount is $${forms.minimum}`)
        if (!forms.network) return ErrorAlert('coin network is required')
        if (amt > forms.limit) return ErrorAlert(`Sorry, you can't sell above $${forms.limit.toLocaleString()}`)
        setModal(true)
    }

    const copyToClip = () => {
        navigator.clipboard.writeText(forms.wallet_add)
            .then(() => { SuccessAlert('wallet address copied successfully') })
            .catch(() => { console.log(`failed to copy wallet address`) })
    }

    const navigate = useNavigate()
    const confirmAndSell = () => {
        if (!check) return ErrorAlert(`Please accept the intructions below to proceed`)
        setModal(false)
        setScreen(2)
    }

    const confirmOrder = async () => {
        if (!forms.trans_hash) return ErrorAlert(`Please input your transaction hash as proof of transfer`)
        if (forms.trans_hash.length < 64) return ErrorAlert(`Please input a valid transaction hash.`)
        setConfirm(false)
        setLoading(true)
        const formdata = {
            amount: parseFloat(forms.amount),
            gas_fee: parseFloat(forms.gas_fee),
            crypto_currency: forms.crypto,
            type: 'sell',
            trans_hash: forms.trans_hash,
            network: forms.network,
            rate: rate
        }

        try {
            const res = await AuthPostApi(Apis.transaction.sell_crypto, formdata)
            if (res.status !== 201) return ErrorAlert(res.msg)
            await new Promise((resolve) => setTimeout(resolve, 2000));
            SuccessAlert(res.msg);
            setScreen(1);
            navigate('/user/exchange/orders');
        } catch (error) {
            ErrorAlert(error.message)
        } finally {
            setLoading(false)
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


    const SelectCrypto = (e) => {
        const { value } = e.target;
        const crypto = cryptos.find((coin) => coin.name === String(value));
        if (crypto) {
            setForms((prevForms) => ({
                ...prevForms,
                crypto: crypto.name,
                network: crypto.network,
                symbol: crypto.symbol,
                wallet_add: crypto.wallet_add,
                minimum: crypto.sell_min,
                limit: crypto.sell_max,
                gas_fee: crypto.gas_fee
            }));
        } else {
            setForms({ ...forms, network: '', wallet_add: '' });
            console.error("Selected crypto not found.");
        }
    };

    return (
        <ExchangeLayout>

            <div className='w-full'>
                {loading &&
                    <Loader title={`processing`} />
                }
                {confirm &&
                    <ModalLayout setModal={setConfirm} clas={`w-11/12 mx-auto lg:w-1/2`}>
                        <div className="w-full p-5 bg-white text-dark rounded-md flex items-center flex-col justify-center">
                            <div className="flex flex-col gap-4 w-full">
                                <div className="font-semibold text-center">To confirm you've sent crypto asset, input the transaction hash below</div>
                                <div className="text-xs text-green-500">NB: this transaction hash can be found on the blockchain, kindly go through the history of wallet used to get it. </div>
                                <FormInput value={forms.trans_hash.trim()} name={`trans_hash`} onChange={handleChange} />
                                <div className="flex w-full items-center justify-between ">
                                    <button onClick={() => setConfirm(false)} className='px-4 py-1.5 rounded-md bg-red-600 text-white'>cancel</button>
                                    <button onClick={confirmOrder} className='px-4 py-1.5 rounded-md bg-green-600 text-white'>confirm</button>
                                </div>
                            </div>
                        </div>
                    </ModalLayout>

                }

                {modal &&

                    <ModalLayout setModal={setModal} clas={`w-11/12 lg:w-1/2 mx-auto`}>
                        <div className="w-full flex flex-col items-center gap-5 bg-white text-dark py-10 rounded-md px-10  ">
                            <div className="w-full flex flex-col items-center justify-center">
                                <BsInfoCircleFill className='text-2xl lg:text-3xl ' />
                                <div className="text-xl font-bold">Please read the instructions below</div>
                            </div>
                            <div className="flex flex-col items-start gap-2 mt-2">
                                {sellInstruction.map((inst, i) => {
                                    return (
                                        <ul key={i} className=" list-disc text-sm">
                                            <li>{inst}</li>
                                        </ul>
                                    )
                                })}
                            </div>
                            <div className="flex items-start gap-3">
                                <input type="checkbox" checked={check} onChange={(e) => setCheck(e.target.checked)} />
                                <p>I agree to the instructions above and want to proceed to the payment window.</p>
                            </div>
                            <button onClick={confirmAndSell} className='mt-10 w-full rounded-md bg-ash hover:bg-lightgreen text-white py-3'>Confirm</button>
                        </div>
                    </ModalLayout>
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

                {!isPageLoading && <div className="w-11/12 mx-auto lg:w-full ">
                    {screen === 1 && active === 'BUY' &&
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
                                    <div className="w- text-red-600 text-xs">Please Note: you can only sell a minimum of ${forms.minimum} and maximum of ${forms.limit.toLocaleString()}. verify your account to increase limit</div>
                                </div>
                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Amount:</div>
                                    <div className="w-full items-center flex px-2 gap-2 border border-gray-400 rounded-lg">
                                        <div className="w-full">
                                            <FormInput name={`amount`} border={false} value={forms.amount} onChange={handleAmount} placeholder={selectedCurr.symbol} />
                                        </div>
                                        <div className="">{selectedCurr.name}</div>
                                    </div>

                                </div>
                                <div className="flex w-full item-center text-sm justify-between">
                                    <div>Gas fee</div>
                                    <div>${forms.gas_fee}</div>
                                </div>
                                <div className="flex w-full item-center text-sm justify-between">
                                    <div>Amount to receive</div>
                                    <div>${amountToReceive}</div>
                                </div>
                                <div className="flex item-center text-sm justify-between w-full">
                                    <div>Amount in Naira</div>
                                    <div>₦{inNaira}</div>
                                </div>
                                <div className="flex w-full item-center text-base lg:text-sm justify-between">
                                    <div className="text-sm">Selling rate</div>
                                    <div className="">{rate}/$</div>
                                </div>
                                <button onClick={submit} className={`bg-red-600 hover:bg-lightgreen text-white hover:text-ash w-full h-fit py-3.5 text-lg rounded-xl`}>Sell Crypto</button>

                            </div>
                        </div>
                    }
                    {screen === 2 &&
                        <div className="w-full  flex items-center justify-center">
                            <div className="flex w-11/12 lg:w-2/3  mx-auto mt-5 items-start gap-5 flex-col">

                                <div className="flex items-start gap-2 flex-col w-full">
                                    <div className="text-center  w-full text-2xl">Selling <span className='text-red-600 font-bold'>{currencies[0].symbol}{forms.amount.toLocaleString()}(${amountToReceive.toLocaleString()})</span> worth of {forms.symbol} at <br /> <span className='text-red-600 font-bold'>{currencies[1].symbol}{inNaira}</span></div>
                                </div>
                                <div className="text-sm text-center w-full">kindly send tokens to the wallet address below</div>

                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Network</div>
                                    <div className="w-full ">
                                        <input readOnly={true} type="text" value={forms.network}
                                            className='w-full bg-dark focus:border-zinc-300 focus-ring-0 outline-none '
                                        />
                                    </div>
                                </div>
                                <div className="flex w-full items-start gap-2 flex-col  ">
                                    <div className="font-bold text-lg">Wallet Address</div>
                                    <div className="w-full flex items-center gap-1 rounded-md ">
                                        <div className="w-full">
                                            <input readOnly={true} type="text" value={forms.wallet_add}
                                                className='w-full bg-dark focus:border-zinc-300 focus-ring-0 outline-none '
                                            />
                                        </div>
                                        <FaCopy onClick={copyToClip} className='text-white text-xl cursor-pointer' />

                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full gap-10">
                                    <button onClick={() => setScreen(1)} className='w-1/2 bg-primary text-lg rounded-xl py-3'>back</button>
                                    <button onClick={() => setConfirm(true)} className={`bg-green-500 hover:bg-lightgreen text-white hover:text-ash w-1/2 h-fit py-3 text-lg rounded-xl`}>I have sent crypto</button>
                                </div>

                            </div>
                        </div>
                    }

                    {screen === 3 &&
                        <div className="">
                            <div className="w-11/12 mx-auto min-h-[70dvh] flex items-center justify-center">

                                <div className="w-full flex items-center  flex-col">
                                    <div className="rounded-full h-20 w-20 flex items-center justify-center border border-lightgreen">
                                        <TfiTimer className='text-2xl text-lightgreen' />
                                    </div>
                                    <div className="mt-10 flex flex-col items-center gap-2">
                                        <div className="">Your transaction is being processed, keep an eye on your dashboard.
                                        </div>
                                        <button onClick={() => navigate('/user/dashboard')} className={`bg-green-500  mt-10 hover:bg-lightgreen text-white hover:text-ash py-2 text-center rounded-md w-full`}>
                                            Go back to dashboard
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    }

                </div>}

            </div>
        </ExchangeLayout>
    )
}

export default SellCrypto