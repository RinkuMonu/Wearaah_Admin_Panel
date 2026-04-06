import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  IndianRupee,
  Boxes,
  Percent,
  ShoppingCart,
  Users,
  RotateCcw,
  Package,
  Wallet,
  CreditCard,
  CalendarDays,
} from "lucide-react";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import {
  PieChart,
  Pie,
  Cell,
} from "recharts";
import WaveGraphSection from "../components/WaveGraph";

export default function Dashboard() {


  const bestProducts = [
    {
      name: "Co Men's plain satin shirt",
      bills: 10,
      qty: 17,
      amount: 22706.5,
      profit: 22706.5,
      percent: 17.91,
    },
    {
      name: "Co Men's Straight fit",
      bills: 7,
      qty: 12,
      amount: 31709.55,
      profit: 31709.55,
      percent: 25.01,
    },
    {
      name: "Boot Cut Formal Pant",
      bills: 5,
      qty: 5,
      amount: 9895.85,
      profit: 9895.85,
      percent: 7.8,
    },
  ];

  // 🔹 Least Selling Products
  const leastProducts = [
    {
      name: "Half Shirt",
      bills: 1,
      qty: 1,
      amount: 1102.15,
      profit: 1102.15,
      percent: 4.11,
    },
    {
      name: "T-shirt",
      bills: 1,
      qty: 1,
      amount: 799.2,
      profit: 799.2,
      percent: 2.98,
    },
    {
      name: "Naylon Tery Cargo",
      bills: 1,
      qty: 1,
      amount: 974.25,
      profit: 974.25,
      percent: 3.63,
    },
  ];



   const salesData = [
    { date: "2026-02-14", amount: 5000, qty: 3, customer: 1 },
    { date: "2026-02-10", amount: 8000, qty: 5, customer: 2 },
    { date: "2026-01-25", amount: 12000, qty: 7, customer: 3 },
  ];

  const [filter, setFilter] = useState("today");
  const [customRange, setCustomRange] = useState({
    start: "",
    end: "",
  });

  const today = new Date().toISOString().split("T")[0];

  // Filter Logic
  const filteredData = useMemo(() => {
    const now = new Date();

    return salesData.filter((item) => {
      const itemDate = new Date(item.date);

      if (filter === "today") {
        return item.date === today;
      }

      if (filter === "lastWeek") {
        const lastWeek = new Date();
        lastWeek.setDate(now.getDate() - 7);
        return itemDate >= lastWeek;
      }

      if (filter === "lastMonth") {
        const lastMonth = new Date();
        lastMonth.setMonth(now.getMonth() - 1);
        return itemDate >= lastMonth;
      }

      if (filter === "custom") {
        if (!customRange.start || !customRange.end) return true;
        return (
          itemDate >= new Date(customRange.start) &&
          itemDate <= new Date(customRange.end)
        );
      }

      return true;
    });
  }, [filter, customRange]);

  // Calculations
  const totalSales = filteredData.reduce((sum, item) => sum + item.amount, 0);
  const totalQty = filteredData.reduce((sum, item) => sum + item.qty, 0);
  const totalCustomers = filteredData.reduce(
    (sum, item) => sum + item.customer,
    0
  );

const stats = [
  {
    title: "Total Sales",
    value: `₹200`,
    icon: IndianRupee,
    color: "bg-emerald-100",
  },
  {
    title: "Total Invoice",
    value: filteredData.length,
    icon: Receipt,
    color: "bg-sky-100",
  },
  {
    title: "Sold Qty",
    value: totalQty,
    icon: ShoppingCart,
    color: "bg-violet-100",
  },
  {
    title: "Total Customers",
    value: totalCustomers,
    icon: Users,
    color: "bg-amber-100",
  },
  {
    title: "Sales Return",
    value: "₹0",
    icon: RotateCcw,
    color: "bg-rose-100",
  },
  {
    title: "Total Products",
    value: 56,
    icon: Package,
    color: "bg-cyan-100",
  },
  {
    title: "Stock Qty",
    value: 915,
    icon: Boxes,
    color: "bg-indigo-100",
  },
  {
    title: "Cash in Hand",
    value: "2.23L",
    icon: Wallet,
    color: "bg-lime-100",
  },
  {
    title: "Bank Accounts",
    value: 65279,
    icon: CreditCard,
    color: "bg-fuchsia-100",
  },
  {
    title: "Gross Profit",
    value: "₹0",
    icon: TrendingUp,
    color: "bg-teal-100",
  },
  {
    title: "Avg. Profit Margin",
    value: "0%",
    icon: Percent,
    color: "bg-orange-100",
  },
];



   const [startDate, setStartDate] = useState("2026-02-09");
  const [endDate, setEndDate] = useState("2026-02-15");

  // ==========================
  // 📊 GRAPH DATA (Sample)
  // ==========================
  const salesPurchaseData = [
    { date: "2026-02-09", label: "09 Feb", sales: 2200, purchase: 0 },
    { date: "2026-02-10", label: "10 Feb", sales: 27000, purchase: 0 },
    { date: "2026-02-11", label: "11 Feb", sales: 1800, purchase: 0 },
    { date: "2026-02-12", label: "12 Feb", sales: 0, purchase: 0 },
    { date: "2026-02-13", label: "13 Feb", sales: 7800, purchase: 0 },
    { date: "2026-02-14", label: "14 Feb", sales: 0, purchase: 0 },
    { date: "2026-02-15", label: "15 Feb", sales: 0, purchase: 0 },
  ];

  const transactionData = [
    { date: "2026-02-09", label: "09 Feb", cash: 2200 },
    { date: "2026-02-10", label: "10 Feb", cash: 27000 },
    { date: "2026-02-11", label: "11 Feb", cash: 1800 },
    { date: "2026-02-12", label: "12 Feb", cash: 0 },
    { date: "2026-02-13", label: "13 Feb", cash: 7800 },
    { date: "2026-02-14", label: "14 Feb", cash: 0 },
    { date: "2026-02-15", label: "15 Feb", cash: 0 },
  ];

  // ==========================
  // 🔥 FILTER LOGIC
  // ==========================
  const filteredSalesPurchase = useMemo(() => {
    return salesPurchaseData.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
  }, [startDate, endDate]);

  const filteredTransaction = useMemo(() => {
    return transactionData.filter(
      (item) => item.date >= startDate && item.date <= endDate
    );
  }, [startDate, endDate]);





  // 🔹 Product Card (Top 1 Product Only)
  const ProductCard = ({ product, type }) => (
    <div className="bg-white shadow-md p-5 border border-gray-300 hover:shadow-lg transition mb-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-800 text-lg">
            {product.name}
          </h3>
          <p className="text-sm text-gray-500">
            {type === "best"
              ? "High Performing Product"
              : "Low Performing Product"}
          </p>
        </div>

        {type === "best" ? (
          <TrendingUp className="w-10 h-10 text-green-500" />
        ) : (
          <TrendingDown className="w-10 h-10 text-red-500" />
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Receipt size={18} className="text-blue-500" />
          <span>No. of Bills: <b>{product.bills}</b></span>
        </div>

        <div className="flex items-center gap-2">
          <Boxes size={18} className="text-purple-500" />
          <span>Sales Qty: <b>{product.qty}</b></span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee size={18} className="text-emerald-500" />
          <span>Sales: <b>₹{product.amount}</b></span>
        </div>

        <div className="flex items-center gap-2">
          <IndianRupee size={18} className="text-yellow-500" />
          <span>Profit: <b>₹{product.profit}</b></span>
        </div>

        <div className="flex items-center gap-2 col-span-2">
          <Percent size={18} className="text-orange-500" />
          <span>Sales %: <b>{product.percent}%</b></span>
        </div>
      </div>
    </div>
  );

  // 🔹 Table for Remaining Products
const ProductTable = ({ products }) => (
  <div className="bg-white shadow-md  h-[350px] flex flex-col">
    
    {/* Table Header */}
    <div className="overflow-hidden">
      <table className="w-full table-fixed text-sm text-left">
        <thead className="bg-blue-50 text-gray-600 uppercase text-xs">
          <tr className="h-12">
            <th className="px-3 w-[6%]">#</th>
            <th className="px-3 w-[30%]">Product Name</th>
            <th className="px-3 w-[10%]">Bills</th>
            <th className="px-3 w-[10%]">Qty</th>
            <th className="px-3 w-[14%]">Amount</th>
            <th className="px-3 w-[10%]">Profit</th>
            <th className="px-3 w-[6%]">sales(%)</th>
          </tr>
        </thead>
      </table>
    </div>

    {/* Scrollable Body */}
    <div className="flex-1 overflow-y-auto">
      <table className="w-full table-fixed text-sm text-left">
        <tbody>
          {products.map((product, index) => (
            <tr
              key={index}
              className="border-t hover:bg-gray-50 transition h-12"
            >
              <td className="px-3 w-[6%]">{index + 2}</td>
              <td className="px-3 w-[30%] truncate text-[#464135] font-medium">
                {product.name}
              </td>
              <td className="px-3 w-[10%]">{product.bills}</td>
              <td className="px-3 w-[10%]">{product.qty}</td>
              <td className="px-3 w-[14%] font-semibold">
                ₹{product.amount}
              </td>
              <td className="px-3 w-[10%] font-semibold">
                ₹{product.profit}
              </td>
              <td className="px-3 w-[6%]">{product.percent}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

  const sections = [
    {
      title: "Best Selling Product",
      type: "best",
      products: bestProducts,
    },
    {
      title: "Least Selling Product",
      type: "least",
      products: leastProducts,
    },
  ];

return (
  <div className="space-y-8 mt-5">

  <WaveGraphSection />

  




    {/* ================= GRAPH SECTION ================= */}
  <div className="grid md:grid-cols-2 gap-6">

  {/* 🔵 SALES VS PURCHASE (Keep As It Is) */}
  <div className="bg-white p-5 shadow-md rounded-xl">
    <div className="flex justify-between items-center mb-4">
      <h2 className="font-bold text-gray-700">
        Sales V/S Purchase
      </h2>

      <div className="flex gap-2 text-sm">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-200 px-2 py-1 rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-200 px-2 py-1 rounded"
        />
      </div>
    </div>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={filteredSalesPurchase}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="sales" fill="#864396" />
        <Bar dataKey="purchase" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  </div>

  {/* 🟣 RIGHT SIDE CARDS */}
<div className="flex flex-col lg:flex-row gap-6">

    {/* 🔥 Promotional Sales Card */}
    <div className="bg-white p-5 shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700">
          Promotional Sales
        </h2>
        <select className="border border-gray-200 px-2 py-1 rounded text-sm">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      {/* Donut Chart */}
      <div className="relative h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={[
                { name: "Social Media", value: 400 },
                { name: "Website", value: 300 },
                { name: "Store", value: 300 },
              ]}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              <Cell fill="#f97316" />
              <Cell fill="#3b82f6" />
              <Cell fill="#8b5cf6" />
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-gray-500 text-sm">Store</p>
          <h3 className="text-xl font-bold">1,016</h3>
          <p className="text-green-500 text-sm">+2.1%</p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
          Social Media
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          Website
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          Store
        </div>
      </div>
    </div>

    {/* 🏆 Top Sale Card */}
    <div className="bg-white p-5 shadow-md rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-bold text-gray-700">
          Top Sale
        </h2>
        <select className="border border-gray-200 px-2 py-1 rounded text-sm">
          <option>Weekly</option>
          <option>Monthly</option>
          <option>Yearly</option>
        </select>
      </div>

      <div className="space-y-4">
        {[
          {
            name: "Neptune Longsleeve",
            price: "138",
            sales: 952,
            img: "https://i.pravatar.cc/50?img=1",
          },
          {
            name: "Ribbed Tank Top",
            price: "108",
            sales: 902,
            img: "https://i.pravatar.cc/50?img=2",
          },
          {
            name: "Oversized Motif T",
            price: "98",
            sales: 882,
            img: "https://i.pravatar.cc/50?img=3",
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center border-b pb-3"
          >
            <div className="flex items-center gap-3">
              <img
                src={item.img}
                alt={item.name}
                className="w-10 h-10 rounded object-cover"
              />
              <div>
                <p className="font-medium text-sm">
                  {item.name}
                </p>
                <p className="text-xs text-gray-500">
                  {item.price}
                </p>
              </div>
            </div>
            <p className="text-sm font-semibold">
              {item.sales} Sales
            </p>
          </div>
        ))}
      </div>
    </div>

  </div>
</div>
    

    


   <div className="p-6 border border-gray-300 rounded-lg bg-white shadow-md">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        {/* Date Filter */}
        <div className="flex items-center gap-3">
          <CalendarDays className="w-5 h-5 text-gray-600" />
          <select
            className="border px-3 py-2 rounded-lg text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="lastWeek">Last Week</option>
            <option value="lastMonth">Last Month</option>
            <option value="custom">Custom Range</option>
          </select>

          {filter === "custom" && (
            <div className="flex gap-2">
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange({ ...customRange, start: e.target.value })
                }
              />
              <input
                type="date"
                className="border px-2 py-1 rounded"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange({ ...customRange, end: e.target.value })
                }
              />
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
        {stats.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`p-5 rounded-2xl shadow-sm hover:shadow-md transition ${item.color}`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm text-gray-600">{item.title}</h3>
                <Icon className="w-5 h-5 text-gray-700" />
              </div>
              <p className="text-2xl font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>



  {/* ================= PRODUCT SECTION ================= */}
    <div className="grid md:grid-cols-2 gap-6">
      {sections.map((section, i) => {
        const topProduct = section.products[0];
        const remainingProducts = section.products.slice(1);

        return (
          <div key={i}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-700">
                {section.title}
              </h2>
              <div className="bg-gray-100 px-3 py-1 text-sm">
                {startDate} - {endDate}
              </div>
            </div>

            {topProduct && (
              <ProductCard
                product={topProduct}
                type={section.type}
              />
            )}

            {remainingProducts.length > 0 && (
              <ProductTable products={remainingProducts} />
            )}
          </div>
        );
      })}
    </div>


  </div>




);
}