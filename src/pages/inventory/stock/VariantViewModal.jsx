export const VariantViewModal = ({ show, onClose, variant }) => {
  if (!show || !variant) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Variant Details</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Images */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {variant.variantImages?.map((img, i) => (
            <img
              key={i}
              src={img}
              alt="variant"
              className="w-full h-28 object-cover rounded-lg border"
            />
          ))}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Product</p>
            <p className="font-semibold">{variant.productId?.name}</p>
          </div>

          <div>
            <p className="text-gray-500">Variant</p>
            <p className="font-semibold">{variant.variantTitle}</p>
          </div>

          <div>
            <p className="text-gray-500">Color</p>
            <p className="font-semibold">{variant.color}</p>
          </div>

          <div>
            <p className="text-gray-500">Size</p>
            <p className="font-semibold">{variant.size}</p>
          </div>

          <div>
            <p className="text-gray-500">MRP</p>
            <p>₹{variant.pricing?.mrp}</p>
          </div>

          <div>
            <p className="text-gray-500">Selling Price</p>
            <p className="text-green-600 font-semibold">
              ₹{variant.pricing?.sellingPrice}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Cost Price</p>
            <p>₹{variant.pricing?.costPrice}</p>
          </div>

          <div>
            <p className="text-gray-500">Stock</p>
            <p className="font-bold">{variant.stock}</p>
          </div>

          <div>
            <p className="text-gray-500">SKU</p>
            <p>{variant.sku}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
