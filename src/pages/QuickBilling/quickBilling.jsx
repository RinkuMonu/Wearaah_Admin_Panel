import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import api from "../../serviceAuth/axios";

export const QuickBilling = () => {
  const [variants, setVariants] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [billloading, setBillLoading] = useState(false);
  const [customer, setCustomer] = useState({
    name: "",
    mobile: "",
    email: "",
  });
  const [payment, setPayment] = useState("CASH");

  /* debounce search */
  useEffect(() => {
    if (!search) {
      setVariants([]);
      return;
    }

    const delayDebounce = setTimeout(() => {
      fetchVariants();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const fetchVariants = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/variant/admin/variants?search=${search}&limit=10`,
      );
      setVariants(res.data.variants);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  /* add to cart */
  const addToCart = (variant) => {
    const exist = cart.find((p) => p._id === variant._id);

    if (exist) {
      setCart(
        cart.map((p) =>
          p._id === variant._id ? { ...p, quantity: p.quantity + 1 } : p,
        ),
      );
    } else {
      setCart([
        ...cart,
        {
          ...variant,
          quantity: 1,
          discount: 0,
        },
      ]);
    }

    setSearch("");
    setVariants([]);
  };

  /* qty */
  const updateQty = (id, qty) => {
    if (qty < 1) return;
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: Number(qty) } : item,
      ),
    );
  };

  /* discount */
  const updateDiscount = (id, discount) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, discount: Number(discount) } : item,
      ),
    );
  };

  /* calc */
  const calcItem = (item) => {
    const mrp = item.pricing.mrp;
    const discountAmount = mrp * (item.discount / 100);
    const sellingPrice = mrp - discountAmount;
    const linePrice = sellingPrice * item.quantity;
    const taxPercent = item.pricing.taxPercent || 0;
    const taxable = linePrice / (1 + taxPercent / 100);
    const tax = linePrice - taxable;

    return {
      taxable,
      tax,
      total: linePrice,
    };
  };

  const subtotal = cart.reduce((sum, item) => sum + calcItem(item).taxable, 0);
  const gst = cart.reduce((sum, item) => sum + calcItem(item).tax, 0);
  const total = cart.reduce((sum, item) => sum + calcItem(item).total, 0);

  const generateInvoice = async () => {
    if (cart.length === 0) {
      alert("Add at least one product");
      return;
    }

    try {
      setBillLoading(true);
      const payload = {
        customerName: customer.name,
        customerMobile: customer.mobile,
        customerEmail: customer.email,
        paymentMode: payment,
        items: cart.map((item) => ({
          variantId: item._id,
          quantity: item.quantity,
          discountPercent: item.discount,
        })),
      };

      const res = await api.put("/order/offlinePurchase", payload);
      console.log(res);
      if (res.data?.success) {
        Swal.fire({
          title: "Success",
          text: res.data.message || "Invoice Generated Successfully",
          icon: "success",
        });
        setCart([]);
        setCustomer({
          name: "",
          mobile: "",
          email: "",
        });
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        title: "Alert",
        text: err.response.data.message || "Invoice generation failed",
        icon: "warning",
      });
    } finally {
      setBillLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4 md:p-6 animate-gradient-shift">
      <style>
        {`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 15s ease infinite;
          }
          @keyframes fade-in-up {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scale-in {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }
          @keyframes pulse-glow {
            0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
            50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.6s ease-out forwards;
          }
          .animate-fade-in {
            animation: fade-in 0.4s ease-out forwards;
          }
          .animate-scale-in {
            animation: scale-in 0.3s ease-out forwards;
          }
          .shimmer-effect {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }
          .card-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .card-hover:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
          }
          .input-luxury {
            transition: all 0.3s ease;
          }
          .input-luxury:focus {
            transform: scale(1.01);
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
          }
          .button-luxury {
            position: relative;
            overflow: hidden;
          }
          .button-luxury::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }
          .button-luxury:hover::before {
            width: 300px;
            height: 300px;
          }
          @keyframes slide-in-right {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animate-slide-in-right {
            animation: slide-in-right 0.4s ease-out forwards;
          }
          .glass-effect {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-1 bg-gradient-to-b from-blue-600 to-cyan-500 rounded-full"></div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Point of Sale
              </h1>
              <p className="text-slate-600 mt-1 text-sm md:text-base">
                Quick billing & invoice generation
              </p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Search & Cart */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search Card */}
            <div
              className="glass-effect rounded-2xl shadow-2xl overflow-hidden card-hover animate-fade-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#e7dcbade] to-[#F5EFDD]">
                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search Products
                </h2>
              </div>
              <div className="p-5">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Search by SKU, HSN Code, or Product Name..."
                    className="w-full pl-12 pr-4 py-4 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all input-luxury text-slate-800 placeholder-slate-400 font-medium"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <svg
                    className="absolute left-4 top-4.5 h-6 w-6 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {loading && (
                    <div className="absolute right-4 top-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-3 border-blue-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {variants.length > 0 && (
                  <div className="mt-4 border-2 border-slate-200 rounded-xl max-h-80 overflow-y-auto shadow-inner animate-scale-in">
                    {variants.map((v, index) => (
                      <div
                        key={v._id}
                        onClick={() => addToCart(v)}
                        className={`p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 cursor-pointer transition-all duration-300 ${
                          index !== variants.length - 1
                            ? "border-b border-slate-200"
                            : ""
                        } hover:scale-[1.02] hover:shadow-md`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-lg">
                                {v.productId?.name}
                              </span>
                              <span className="text-sm text-slate-600 font-medium">
                                - {v.variantTitle}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-2 text-sm">
                              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-medium">
                                SKU: {v.sku}
                              </span>
                              <span className="px-3 py-1 bg-slate-100 rounded-full text-slate-700 font-medium">
                                HSN: {v.hsnCode || "N/A"}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              ₹{v.pricing.mrp}
                            </span>
                            {v.pricing.taxPercent > 0 && (
                              <span className="block text-xs text-slate-500 font-medium mt-1">
                                GST: {v.pricing.taxPercent}%
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart Table */}
            <div
              className="glass-effect rounded-2xl shadow-2xl overflow-hidden card-hover animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-5 border-b border-slate-200 flex justify-between items-center  bg-gradient-to-r from-[#e7dcbade] to-[#F5EFDD]">
                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  Shopping Cart
                </h2>
                <span className="bg-white text-emerald-700 text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
                  {cart.length} {cart.length === 1 ? "Item" : "Items"}
                </span>
              </div>

              {cart.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-slate-100 to-slate-50">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-5 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Qty
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                          MRP
                        </th>
                        <th className="px-5 py-4 text-center text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Discount %
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                          GST
                        </th>
                        <th className="px-5 py-4 text-right text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {cart.map((item, index) => {
                        const calc = calcItem(item);
                        return (
                          <tr
                            key={item._id}
                            className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-300 animate-fade-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <td className="px-5 py-4">
                              <div className="text-sm font-bold text-slate-900">
                                {item.variantTitle}
                              </div>
                              <div className="text-xs text-slate-500 font-medium mt-1">
                                SKU: {item.sku}
                              </div>
                            </td>
                            <td className="px-5 py-4">
                              <input
                                type="number"
                                min="1"
                                value={item.quantity}
                                onChange={(e) =>
                                  updateQty(item._id, e.target.value)
                                }
                                className="w-20 text-center border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-luxury font-bold text-slate-800 py-2"
                              />
                            </td>
                            <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">
                              ₹{item.pricing.mrp}
                            </td>
                            <td className="px-5 py-4">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={item.discount}
                                onChange={(e) =>
                                  updateDiscount(item._id, e.target.value)
                                }
                                className="w-20 text-center border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 input-luxury font-bold text-slate-800 py-2"
                              />
                            </td>
                            <td className="px-5 py-4 text-right text-sm font-bold text-emerald-700">
                              ₹{calc.tax.toFixed(2)}
                            </td>
                            <td className="px-5 py-4 text-right text-base font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                              ₹{calc.total.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center text-slate-500 animate-fade-in">
                  <div className="inline-block p-6 bg-gradient-to-br from-slate-100 to-blue-50 rounded-full mb-4">
                    <svg
                      className="mx-auto h-16 w-16 text-slate-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-lg font-bold text-slate-700">
                    Your cart is empty
                  </p>
                  <p className="text-sm text-slate-500 mt-2">
                    Search and add products to start billing
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Customer & Payment */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div
              className="glass-effect rounded-2xl shadow-2xl overflow-hidden card-hover animate-slide-in-right"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="p-5 border-b border-slate-200  bg-gradient-to-r from-[#e7dcbade] to-[#F5EFDD]">
                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Customer Details
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.2s" }}
                >
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter customer name"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 input-luxury font-medium text-slate-800"
                    value={customer.name}
                    onChange={(e) =>
                      setCustomer({ ...customer, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 input-luxury font-medium text-slate-800"
                    value={customer.mobile}
                    onChange={(e) =>
                      setCustomer({ ...customer, mobile: e.target.value })
                    }
                    required
                  />
                </div>
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-amber-100 focus:border-amber-500 input-luxury font-medium text-slate-800"
                    value={customer.email}
                    onChange={(e) =>
                      setCustomer({ ...customer, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
            </div>

            {/* Bill Summary */}
            <div
              className="glass-effect rounded-2xl shadow-2xl overflow-hidden card-hover animate-slide-in-right"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="p-5 border-b border-slate-200  bg-gradient-to-r from-[#e7dcbade] to-[#F5EFDD]">
                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  Bill Summary
                </h2>
              </div>
              <div className="p-5 space-y-3">
                <div
                  className="flex justify-between text-sm animate-fade-in"
                  style={{ animationDelay: "0.3s" }}
                >
                  <span className="text-slate-600 font-medium">Subtotal:</span>
                  <span className="font-bold text-slate-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm animate-fade-in"
                  style={{ animationDelay: "0.35s" }}
                >
                  <span className="text-slate-600 font-medium">
                    CGST (50%):
                  </span>
                  <span className="font-bold text-emerald-700">
                    ₹{(gst / 2).toFixed(2)}
                  </span>
                </div>
                <div
                  className="flex justify-between text-sm animate-fade-in"
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="text-slate-600 font-medium">
                    SGST (50%):
                  </span>
                  <span className="font-bold text-emerald-700">
                    ₹{(gst / 2).toFixed(2)}
                  </span>
                </div>
                <div
                  className="border-t-2 border-slate-300 my-3 pt-3 animate-fade-in"
                  style={{ animationDelay: "0.45s" }}
                >
                  <div className="flex justify-between items-center bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl">
                    <span className="text-base font-bold text-slate-900">
                      Grand Total:
                    </span>
                    <span className="text-2xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      ₹{total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment & Action */}
            <div
              className="glass-effect rounded-2xl shadow-2xl overflow-hidden card-hover animate-slide-in-right"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="p-5 border-b border-slate-200  bg-gradient-to-r from-[#e7dcbade] to-[#F5EFDD]">
                <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Payment & Checkout
                </h2>
              </div>
              <div className="p-5 space-y-4">
                <div
                  className="animate-fade-in"
                  style={{ animationDelay: "0.35s" }}
                >
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Payment Method
                  </label>
                  <select
                    className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 input-luxury font-bold text-slate-800 bg-white"
                    value={payment}
                    onChange={(e) => setPayment(e.target.value)}
                  >
                    <option value="CASH">💵 Cash</option>
                    <option value="UPI">📱 UPI</option>
                    <option value="CARD">💳 Card</option>
                  </select>
                </div>

                <button
                  onClick={generateInvoice}
                  disabled={cart.length === 0 || billloading}
                  className={`w-full py-4 px-6 rounded-xl font-black text-green-700 text-lg transition-all duration-300 button-luxury relative ${
                    cart.length > 0
                      ? " cursor-pointer bg-gradient-to-r from-[#e7dcbade] to-[#F5EFDD] hover:from-emerald-700 hover:via-teal-700 hover:to-emerald-700 hover:text-gray-300 shadow-2xl hover:shadow-emerald-500/50 hover:scale-105 animate-fade-in"
                      : "bg-slate-400 cursor-not-allowed"
                  }`}
                  style={{ animationDelay: "0.4s" }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {billloading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-3 border-white border-t-transparent"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                        Generate Invoice
                      </>
                    )}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
