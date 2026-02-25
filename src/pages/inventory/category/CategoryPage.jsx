import { useState } from "react";
import CategoryTable from "./CategoryTable";
import AddProductModal from "../product/AddProductModal";

export default function CategoryPage() {
  const [tab, setTab] = useState("category");

  const [showAddProductModal, setShowAddProductModal] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header Section */}
      <div className="mb-6 bg-[#f5efdd] p-4 rounded-md">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <svg
            className="w-6 h-6 text-[#927f68]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
          Category Management
        </h1>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Table Container with Animation */}
        <div className="p-6">
          <div className="transition-all duration-300 ease-in-out">
            <CategoryTable />
          </div>
        </div>

        {/* Footer Stats (Optional) */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-600">Active</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span className="text-gray-600">Pending</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <span className="text-gray-600">Inactive</span>
              </div>
            </div>
            <div className="text-gray-400">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* <button
              onClick={() => setShowAddProductModal(true)}
              className="px-4 py-2 bg-[#927f68] text-white rounded-lg hover:bg-[#7b6b57] transition"
            >
              Data
            </button> */}
          </div>
        </div>
      </div>

      {showAddProductModal && (
        <AddProductModal onClose={() => setShowAddProductModal(false)} />
      )}

      {/* Add these styles to your global CSS or as a style tag */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
