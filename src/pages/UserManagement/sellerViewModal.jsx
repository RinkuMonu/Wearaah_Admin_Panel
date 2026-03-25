// components/SellerModal.jsx
export function SellerModal({ seller, onClose }) {
  const baseUrl = import.meta.env.VITE_BASE_URL;

  const renderFile = (file) => {
    if (!file) return null;

    if (file.endsWith(".pdf")) {
      return (
        <a href={baseUrl + file} target="_blank" className="text-blue-600">
          View PDF
        </a>
      );
    }

    return (
      <img src={baseUrl + file} className="w-24 h-24 object-cover rounded" />
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white w-[700px] max-h-[90vh] overflow-y-auto p-5 rounded">
        <h2 className="text-lg font-semibold mb-4">{seller.shopName}</h2>

        {/* BASIC */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <p>
            <b>Owner:</b> {seller.userId?.name}
          </p>
          <p>
            <b>Mobile:</b> {seller.userId?.mobile}
          </p>
          <p>
            <b>Business:</b> {seller.businessType}
          </p>
          <p>
            <b>KYC:</b> {seller.kycStatus}
          </p>
        </div>

        {/* ADDRESS */}
        <div className="mt-4">
          <h3 className="font-semibold">Address</h3>
          <p>{seller.pickupDelivery?.street}</p>
          <p>{seller.pickupDelivery?.city}</p>
        </div>

        {/* BANK */}
        <div className="mt-4">
          <h3 className="font-semibold">Bank</h3>
          <p>{seller.bankDetails?.accountNumber}</p>
          <p>{seller.bankDetails?.IFSC}</p>
        </div>

        {/* DOCUMENTS */}
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Documents</h3>

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(seller.kycDocuments || {}).map(([key, val]) => (
              <div key={key}>
                <p className="text-xs">{key}</p>
                {renderFile(val)}
              </div>
            ))}
          </div>
        </div>

        {/* ACTION */}
        <div className="flex justify-end mt-5">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
