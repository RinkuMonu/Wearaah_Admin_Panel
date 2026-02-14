import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Receipt,
  IndianRupee,
  Boxes,
  Percent,
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

export default function Dashboard() {

  // 🔹 Best Selling Products (Top one will go in Card)
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
  <div className="space-y-8">

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

    {/* ================= GRAPH SECTION ================= */}
    <div className="grid md:grid-cols-2 gap-6">

      {/* 🔵 SALES VS PURCHASE */}
      <div className="bg-white p-5 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-700">
            Sales V/S Purchase
          </h2>

          <div className="flex gap-2 text-sm mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 px-2 py-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 px-2 py-1"
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

      {/* 🟣 TRANSACTION */}
      <div className="bg-white p-5 shadow-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-gray-700">
            Transaction
          </h2>
          <div className="flex gap-2 text-sm mb-4">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-200 px-2 py-1"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-200 px-2 py-1"
            />
          </div>
        </div>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={filteredTransaction}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="cash" fill="#d93030" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>

  </div>
);
}