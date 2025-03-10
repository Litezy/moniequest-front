import React from 'react'
import { LineChart, Line, ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend } from "recharts";

const Sparklines = ({ data }) => {
    const formattedData = data.map((price, index) => ({ index, price }));
    const lineColor = formattedData[formattedData.length - 1]?.price >= formattedData[0]?.price 
        ? '#22c55e'
        : '#ef4444';

    return (
        <ResponsiveContainer width="100%" height={200} >
            <LineChart data={data.map((price, index) => ({ index, price }))}>
                <Line type="monotone"
                    dataKey="price"
                    stroke={lineColor}
                    strokeWidth={2}
                    dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}

export default Sparklines

