export function SellerModal({ seller, onClose }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const renderFile = (file) => {
    if (!file) return null;

    if (file.endsWith(".pdf")) {
      return (
        <a
          href={baseUrl + file}
          target="_blank"
          className="text-blue-600 text-xs underline hover:text-blue-800"
        >
          View PDF
        </a>
      );
    }

    return (
      <img
        src={baseUrl + file}
        className="w-24 h-24 object-cover rounded-lg border hover:scale-105 transition"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-[750px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-5 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            {seller.shopName}
          </h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* BASIC INFO */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-gray-700 mb-3">Basic Info</h3>

          <div className="grid grid-cols-2 gap-3 text-sm text-gray-700">
            <p><b>Owner:</b> {seller.userId?.name || "-"}</p>
            <p><b>Mobile:</b> {seller.userId?.mobile || "-"}</p>
            <p><b>Business:</b> {seller.businessType || "-"}</p>
            <p>
              <b>KYC:</b>{" "}
              <span
                className={`px-2 py-1 rounded text-xs ${
                  seller.kycStatus === "verified"
                    ? "bg-green-100 text-green-600"
                    : seller.kycStatus === "pending"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {seller.kycStatus}
              </span>
            </p>
          </div>
        </div>

        {/* ADDRESS */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Address</h3>
          <p className="text-sm text-gray-600">
            {seller.pickupDelivery?.street || "-"}
          </p>
          <p className="text-sm text-gray-600">
            {seller.pickupDelivery?.city || "-"}
          </p>
        </div>

        {/* BANK DETAILS */}
        <div className="bg-gray-50 p-4 rounded-xl mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Bank Details</h3>
          <p className="text-sm text-gray-600">
            <b>Account:</b> {seller.bankDetails?.accountNumber || "-"}
          </p>
          <p className="text-sm text-gray-600">
            <b>IFSC:</b> {seller.bankDetails?.IFSC || "-"}
          </p>
        </div>

        {/* DOCUMENTS */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <h3 className="font-semibold text-gray-700 mb-3">Documents</h3>

          <div className="grid grid-cols-3 gap-4">
            {Object.entries(seller.kycDocuments || {}).map(([key, val]) => (
              <div
                key={key}
                className="border rounded-lg p-2 text-center hover:shadow-sm transition"
              >
                <p className="text-xs text-gray-500 mb-1">{key}</p>
                {renderFile(val)}
              </div>
            ))}
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}