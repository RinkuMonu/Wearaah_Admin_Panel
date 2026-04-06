import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, Tooltip } from "recharts";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Wallet,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";

export default function WaveGraphSection() {
  // 📊 Different data for each filter
  const chartData = {
    Weekly: [
      { value: 20 },
      { value: 40 },
      { value: 15 },
      { value: 60 },
      { value: 30 },
      { value: 55 },
      { value: 70 },
    ],
    Monthly: [
      { value: 100 },
      { value: 140 },
      { value: 90 },
      { value: 180 },
      { value: 120 },
      { value: 160 },
      { value: 200 },
    ],
    Yearly: [
      { value: 400 },
      { value: 600 },
      { value: 450 },
      { value: 800 },
      { value: 500 },
      { value: 750 },
      { value: 900 },
    ],
  };

  const [selectedFilter, setSelectedFilter] = useState([
    "Weekly",
    "Monthly",
    "Yearly",
    "Yearly",
  ]);

  const [openDropdown, setOpenDropdown] = useState(null);

  const cards = [
    {
      title: "Total Earnings",
      value: "334,945",
      trend: "up",
      icon: DollarSign,
      color: "#22c55e",
      bg: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: "2,802",
      trend: "down",
      icon: ShoppingBag,
      color: "#f97316",
      bg: "bg-orange-500",
    },
    {
      title: "Customers",
      value: "4,945",
      trend: "up",
      icon: Users,
      color: "#8b5cf6",
      bg: "bg-purple-500",
    },
    {
      title: "My Balance",
      value: "4,945",
      trend: "up",
      icon: Wallet,
      color: "#3b82f6",
      bg: "bg-blue-500",
    },
  ];

  const handleFilterChange = (index, filter) => {
    const updated = [...selectedFilter];
    updated[index] = filter;
    setSelectedFilter(updated);
    setOpenDropdown(null);
  };

  return (
    <div className="p-6 bg-gray-100">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          const isUp = card.trend === "up";

          return (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-sm p-4 relative"
            >
              {/* Dropdown */}
              <div className="relative inline-block mb-2">
                <div className="flex items-center text-sm text-gray-500 select-none">
                  Montly
                </div>
              </div>

              {/* Top Section */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${card.bg}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>

                  <div>
                    <h4 className="text-gray-500 text-sm font-medium">
                      {card.title}
                    </h4>

                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gray-900">
                        {card.value}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graph */}
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData[selectedFilter[index]]}>
                    <defs>
                      <linearGradient
                        id={`color-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={card.color}
                          stopOpacity={0.4}
                        />
                        <stop
                          offset="100%"
                          stopColor={card.color}
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                      }}
                      cursor={{ strokeDasharray: "3 3" }}
                    />

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke={card.color}
                      strokeWidth={3}
                      fill={`url(#color-${index})`}
                      dot={false}
                      activeDot={{
                        r: 6,
                        strokeWidth: 2,
                        fill: card.color,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
