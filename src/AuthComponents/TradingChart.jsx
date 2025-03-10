import React, { useState, useEffect } from "react";
import { AreaChart, Area, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import SelectComp from "../GeneralComponents/SelectComp";
import { useAtom } from "jotai";
import { USER_CHARTS } from "../services/store";

const calender = ["daily", "monthly", "yearly"];
const tradeOverviewFilter = [
  "All Trades",
  "All Coins",
  "Crypto Buys",
  "Crypto Sells",
  "Gift Cards",
];

export default function TradingChart() {
  const [charts] = useAtom(USER_CHARTS);
  const [active, setActive] = useState(calender[0]); // Default: Daily
  const [selectedData, setSelectedData] = useState([]);
  const [select, setSelect] = useState({
    overview: tradeOverviewFilter[0],
  });

  useEffect(() => {
    if (!charts.length) return;

    let transactions = [];

    if (select.overview === "All Trades") {
      transactions = charts.find((item) => item.allTrades)?.allTrades || [];
    } else if (select.overview === "Crypto Buys") {
      transactions = charts.find((item) => item.buys)?.buys || [];
    } else if (select.overview === "Crypto Sells") {
      transactions = charts.find((item) => item.sells)?.sells || [];
    } else if (select.overview === "All Coins") {
      transactions = charts.find((item) => item.allcoins)?.allcoins || [];
    } else if (select.overview === "Gift Cards") {
      transactions = charts.find((item) => item.gifts)?.gifts || [];
    }

    // Ensure every transaction has a valid date
    transactions = transactions.map((item, index) => ({
      ...item,
      date: item.createdAt ? new Date(item.createdAt) : new Date(2025, 0, index + 1),
    }));

    let groupedData = [];

    //  Group transactions based on the selected calendar filter
    if (active === "daily") {
      groupedData = ensureTwoPoints(groupByDaily(transactions));
    } else if (active === "monthly") {
      groupedData = ensureTwoPoints(groupByMonthly(transactions));
    } else if (active === "yearly") {
      groupedData = ensureTwoPoints(groupByYearly(transactions));
    }

    setSelectedData(groupedData);
  }, [select.overview, active, charts]);

  //Function to group data by day
  const groupByDaily = (transactions) => {
    return transactions.reduce((acc, item) => {
      const day = item.date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
      if (!acc[day]) acc[day] = { name: day, uv: 0 };
      acc[day].uv += Number(item.amount);
      return acc;
    }, {});
  };

  // Function to group data by month
  const groupByMonthly = (transactions) => {
    return transactions.reduce((acc, item) => {
      const month = item.date.toISOString().slice(0, 7); // Format: YYYY-MM
      if (!acc[month]) acc[month] = { name: month, uv: 0 };
      acc[month].uv += Number(item.amount);
      return acc;
    }, {});
  };

  //Function to group data by year
  const groupByYearly = (transactions) => {
    return transactions.reduce((acc, item) => {
      const year = item.date.getFullYear().toString(); // Extracts year (e.g., "2024")
      if (!acc[year]) acc[year] = { name: year, uv: 0 };
      acc[year].uv += Number(item.amount);
      return acc;
    }, {});
  };

  // Ensure at least two points exist for proper chart rendering
  const ensureTwoPoints = (groupedData) => {
    let dataArray = Object.values(groupedData);

    if (dataArray.length === 1) {
      const { name, uv } = dataArray[0];

      if (active === "daily") {
        dataArray.push({ name: `${name} (extra)`, uv }); // Add a duplicate entry
      } else if (active === "monthly") {
        const [year, month] = name.split("-");
        let nextMonth = parseInt(month) + 1;
        let nextYear = parseInt(year);

        if (nextMonth > 12) {
          nextMonth = 1;
          nextYear += 1;
        }

        dataArray.push({ name: `${nextYear}-${String(nextMonth).padStart(2, "0")}`, uv: 0 });
      } else if (active === "yearly") {
        dataArray.push({ name: (parseInt(name) - 1).toString(), uv: 0 }); // Add previous year
      }
    }

    return dataArray;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="text-2xl capitalize font-bold">Your Trading Overview</div>
      <div className="bg-primary h-fit w-full px-4 pt-4 flex flex-col gap-2 overflow-hidden">
        <div className="flex justify-between gap-2">
          <SelectComp
            options={tradeOverviewFilter}
            style={{ bg: "#171828", color: "lightgrey", font: "0.8rem" }}
            value={select.overview}
            handleChange={(e) => setSelect({ ...select, overview: e.target.value })}
          />

          <div className="flex items-center">
            {calender.map((item, i) => (
              <div
                key={i}
                onClick={() => setActive(item)}
                className={`w-fit h-fit md:px-4 px-3 py-1.5 md:text-sm text-xs capitalize cursor-pointer ${active === item && "bg-[#143f75] rounded-full"
                  }`}
              >
                {item}
              </div>
            ))}
          </div>
        </div>


        <div className="flex w-full flex-col items-start">
          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={selectedData}>
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="uv" stroke="#8884d8" fill="#143f75" />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-sm my-2 text-zinc-400">
            NB: All y-axis amounts are in ($)
          </div>
        </div>
      </div>
    </div>
  );
}
