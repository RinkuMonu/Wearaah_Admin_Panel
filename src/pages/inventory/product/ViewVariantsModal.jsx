// pages/inventory/product/ViewVariantsModal.jsx
import { useState, useEffect } from "react";
import { X, Edit2, Trash2 } from "lucide-react";
import api from "../../../serviceAuth/axios";

export default function ViewVariantsModal({ product, onClose }) {
  const [variants, setVariants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product?._id) {
      fetchVariants();
    }
  }, [product]);

  const fetchVariants = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/variant/products/${product._id}/variants`);
      if (response.data.success) {
        setVariants(response.data.variants || []);
      }
    } catch (error) {
      console.error('Error fetching variants:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-md shadow-2xl border border-[#e6dcc7] p-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-4 border-b border-[#e6dcc7] pb-3">
          <h2 className="text-xl font-semibold text-[#5c5042]">
            Variants for {product?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-[#927f68] hover:text-[#5c5042] text-2xl transition"
          >
            &times;
          </button>
        </div>

        {/* Variants Table */}
        {loading ? (
          <div className="text-center py-8">Loading variants...</div>
        ) : variants.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-md">
            <p className="text-gray-500">No variants found for this product</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">S.No</th>
                  <th className="px-4 py-3 text-left">Title</th>
                  <th className="px-4 py-3 text-left">Color</th>
                  <th className="px-4 py-3 text-left">Size</th>
                  <th className="px-4 py-3 text-right">MRP</th>
                  <th className="px-4 py-3 text-right">Selling Price</th>
                  <th className="px-4 py-3 text-right">Discount</th>
                  <th className="px-4 py-3 text-right">Stock</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {variants.map((variant, index) => (
                  <tr key={variant._id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{variant.variantTitle}</td>
                    <td className="px-4 py-3 capitalize">{variant.attributes?.color || variant.color}</td>
                    <td className="px-4 py-3 uppercase">{variant.attributes?.size || variant.size}</td>
                    <td className="px-4 py-3 text-right">₹{variant.pricing?.mrp}</td>
                    <td className="px-4 py-3 text-right">₹{variant.pricing?.sellingPrice}</td>
                    <td className="px-4 py-3 text-right">{variant.pricing?.discountPercent}%</td>
                    <td className="px-4 py-3 text-right">{variant.stock}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button className="text-blue-600 hover:text-blue-800">
                          <Edit2 size={16} />
                        </button>
                        <button className="text-red-600 hover:text-red-800">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Close Button */}
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-[#927f68] text-white hover:bg-[#7b6b57]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}