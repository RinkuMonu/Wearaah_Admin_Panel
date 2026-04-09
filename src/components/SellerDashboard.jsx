import { useEffect, useState } from "react";
import api from "../serviceAuth/axios";
import {
  TrendingUp,
  Receipt,
  IndianRupee,
  Boxes,
  ShoppingCart,
  RotateCcw,
  Package,
  Wallet,
  CreditCard,
  CheckCircle,
  XCircle,
  Truck,
  Clock,
  AlertCircle,
  DollarSign,
} from "lucide-react";

export default function SellerDashboard() {
  const [data, setData] = useState(null);
  const [startDate, setStartDate] = useState("2026-02-09");
  const [endDate, setEndDate] = useState("2026-02-15");

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/das/sellerDashboard");
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (!data) return <p>Loading...</p>;

  // Static stats combining API and static data
  const stats = [
    {
      title: "Total Products",
      value: data.totalProducts || 0,
      icon: Package,
      color: "bg-emerald-100",
    },
    {
      title: "Total Orders",
      value: data.totalOrders || 0,
      icon: ShoppingCart,
      color: "bg-sky-100",
    },
    {
      title: "Pending Orders",
      value: data.pendingOrders || 0,
      icon: Clock,
      color: "bg-violet-100",
    },
    {
      title: "Delivered Orders",
      value: data.deliveredOrders || 0,
      icon: CheckCircle,
      color: "bg-amber-100",
    },
    {
      title: "Cancelled Orders",
      value: data.cancelledOrders || 0,
      icon: XCircle,
      color: "bg-rose-100",
    },
    {
      title: "Shipped Orders",
      value: data.shippedOrders || 0,
      icon: Truck,
      color: "bg-cyan-100",
    },
    {
      title: "Returned Orders",
      value: data.returnedOrders || 0,
      icon: RotateCcw,
      color: "bg-indigo-100",
    },
    {
      title: "Total Revenue",
      value: `₹${data.totalRevenue || 0}`,
      icon: IndianRupee,
      color: "bg-lime-100",
    },
    {
      title: "Wallet Balance",
      value: `₹${data.walletBalance || 0}`,
      icon: Wallet,
      color: "bg-fuchsia-100",
    },
    {
      title: "Locked Balance",
      value: `₹${data.lockedBalance || 0}`,
      icon: CreditCard,
      color: "bg-teal-100",
    },
    {
      title: "Low Stock Products",
      value: data.lowstock || 0,
      icon: AlertCircle,
      color: "bg-orange-100",
    },
    {
      title: "Average Order Value",
      value: `₹${data.totalOrders ? Math.round(data.totalRevenue / data.totalOrders) : 0}`,
      icon: DollarSign,
      color: "bg-purple-100",
    },
  ];

  // Static data for products (you can replace with real API)
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

  const orderStatusData = [
    { name: "Pending", value: data.pendingOrders || 0, color: "#f97316" },
    { name: "Delivered", value: data.deliveredOrders || 0, color: "#10b981" },
    { name: "Cancelled", value: data.cancelledOrders || 0, color: "#ef4444" },
    { name: "Shipped", value: data.shippedOrders || 0, color: "#3b82f6" },
    { name: "Returned", value: data.returnedOrders || 0, color: "#8b5cf6" },
  ];

  return (
    <div className="space-y-8 mt-5 p-6">
      <h1 className="text-2xl font-bold text-gray-800">Seller Dashboard</h1>

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

      {/* Financial Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 shadow-md rounded-xl">
          <h2 className="font-bold text-gray-700 mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <span className="text-gray-600">Total Revenue</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{data.totalRevenue || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <span className="text-gray-600">Wallet Balance</span>
              <span className="text-xl font-semibold text-blue-600">
                ₹{data.walletBalance || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
              <span className="text-gray-600">Locked Balance</span>
              <span className="text-xl font-semibold text-purple-600">
                ₹{data.lockedBalance || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="bg-white p-5 shadow-md rounded-xl">
          <h2 className="font-bold text-gray-700 mb-4">Order Status Distribution</h2>
          <div className="space-y-3">
            {orderStatusData.map((status, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: status.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{status.name}</span>
                </div>
                <span className="font-semibold">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Products Overview */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white p-5 shadow-md rounded-xl">
          <h2 className="font-bold text-gray-700 mb-4">Products Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-500" />
                <span>Total Products Listed</span>
              </div>
              <span className="text-2xl font-bold">{data.totalProducts || 0}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <span>Low Stock Products</span>
              </div>
              <span className="text-2xl font-bold text-red-600">
                {data.lowstock || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Best Selling Products Preview */}
        <div className="bg-white p-5 shadow-md rounded-xl">
          <h2 className="font-bold text-gray-700 mb-4">Top Products</h2>
          <div className="space-y-3">
            {bestProducts.slice(0, 3).map((product, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-sm">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.qty} units sold</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{product.amount}</p>
                  <p className="text-xs text-green-600">{product.percent}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Summary */}
      <div className="bg-white p-5 shadow-md rounded-xl">
        <h2 className="font-bold text-gray-700 mb-4">Orders Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{data.totalOrders || 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold text-orange-600">{data.pendingOrders || 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Delivered</p>
            <p className="text-2xl font-bold text-green-600">{data.deliveredOrders || 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Shipped</p>
            <p className="text-2xl font-bold text-cyan-600">{data.shippedOrders || 0}</p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm">Returned</p>
            <p className="text-2xl font-bold text-purple-600">{data.returnedOrders || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
}