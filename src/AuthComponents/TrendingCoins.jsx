import React, { useEffect, useState } from 'react'
import axios from "axios";
import SelectComp from '../GeneralComponents/SelectComp'
import Sparklines from './Sparklines';
import { currencies } from './AuthUtils';

const TrendingCoins = () => {
    const [coins, setCoins] = useState([]);
    const localName = 'Coins';
    const localData = JSON.parse(localStorage.getItem(localName))
    const tradingAnalyticFilter = [
        "Popular", "Top Gainers", "Top Losers", "Most Traded"
    ];
    const [select, setSelect] = useState({
        analytics: tradingAnalyticFilter[0],
    });
    useEffect(() => {
        if (!localData) {
            localStorage.setItem(localName, JSON.stringify([]));
        }
    }, [])
    const getCryptoData = async () => {
        try {
            const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
                params: {
                    vs_currency: 'usd',
                    per_page: 50,
                    sparkline: true,
                    page: 1,
                },
            });

            const data = response.data;
            localStorage.setItem(localName, JSON.stringify(data) || []);
            return data;
        } catch (error) {
            console.error("Error fetching crypto data:", error);
            return [];
        }
    };


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem(localName));
        if (!storedData.length > 0) {
            getCryptoData().then(data => {
                setCoins([...data].sort((a, b) => b.market_cap - a.market_cap).slice(0, 4));
            });
        } else {
            let filteredCoins = [];
            if (select.analytics === "Popular") {
                filteredCoins = [...storedData].sort((a, b) => b.market_cap - a.market_cap).slice(0, 4);
            } else if (select.analytics === "Top Gainers") {
                filteredCoins = [...storedData].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h).slice(0, 4);
            } else if (select.analytics === "Top Losers") {
                filteredCoins = [...storedData].sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h).slice(0, 4);
            } else if (select.analytics === "Most Traded") {
                filteredCoins = [...storedData].sort((a, b) => b.total_volume - a.total_volume).slice(0, 4);
            }

            setCoins(filteredCoins);
        }
    }, [select.analytics]);

    
    return (
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between items-center'>
                <div className='text-2xl capitalize font-bold px-2'>trading analytics</div>
                <SelectComp
                    options={tradingAnalyticFilter}
                    style={{ bg: '#212134', color: 'lightgrey', font: '0.8rem' }}
                    value={select.analytics}
                    handleChange={(e) => setSelect({ ...select, analytics: e.target.value })}
                />
            </div>
            <div className='grid grid-cols-2 gap-4 px-2'>
                {coins.length > 0 ? coins.map((item, i) => (
                    <div key={i} className="w-full flex items-start bg-primary rounded-md flex-col p-2 mb-2">
                        <div className="flex items-center gap-2">
                            <img src={item.image} className='w-12' alt="" />
                            <div className="flex items-start flex-col">
                                <div className="font-bold">{item.name}</div>
                                <div className="uppercase text-sm ">{item.symbol}</div>
                            </div>
                        </div>
                        <div className="w-1/2 ml-auto">
                            <div className="w-full h-14 md:h-16 ">
                                <Sparklines data={item?.sparkline_in_7d?.price} />
                            </div>
                        </div>
                        <div className="flex flex-col items-start gap-1">
                            <div className="font-bold">{currencies[0].symbol}{item?.current_price?.toFixed(2)}</div>
                        </div>
                    </div>
                )) : new Array(4).fill(0).map((_, k) => (
                    <div className='w-full bg-primary h-44 animate-pulse' key={k}></div>
                ))}
            </div>
        </div>
    );
}

export default TrendingCoins;
