// pages/admin/RiderModal.jsx
import {
  X,
  User,
  MapPin,
  Bike,
  CreditCard,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Truck,
  Star,
  DollarSign,
  Calendar,
  Shield,
  Navigation,
  Building2,
  Smartphone,
  Hash,
  Award,
  Phone,
  Mail,
} from "lucide-react";

export function RiderModal({ rider, onClose }) {
  const baseUrl = import.meta.env.VITE_BASE_URL || "http://localhost:5000";

  const renderFile = (file, label) => {
    if (!file)
      return <span className="text-gray-400 text-sm">Not uploaded</span>;
    const fileUrl = baseUrl + file;

    if (file.endsWith(".pdf")) {
      return (
        <a
          href={fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
        >
          <FileText className="w-4 h-4" />
          View {label}
        </a>
      );
    }
    return (
      <img
        src={fileUrl}
        alt={label}
        className="w-20 h-20 object-cover rounded-lg border cursor-pointer hover:opacity-80"
        onClick={() => window.open(fileUrl, "_blank")}
      />
    );
  };

  const getStatusBadge = (status, type) => {
    const configs = {
      kyc: {
        verified: {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Verified",
        },
        pending: {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          label: "Pending",
        },
        rejected: {
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          label: "Rejected",
        },
      },
      availability: {
        online: {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Online",
        },
        offline: {
          color: "bg-gray-100 text-gray-800",
          icon: XCircle,
          label: "Offline",
        },
        on_delivery: {
          color: "bg-blue-100 text-blue-800",
          icon: Navigation,
          label: "On Delivery",
        },
        break: {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          label: "Break",
        },
      },
      account: {
        active: {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          label: "Active",
        },
        suspended: {
          color: "bg-orange-100 text-orange-800",
          icon: AlertCircle,
          label: "Suspended",
        },
        blocked: {
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          label: "Blocked",
        },
        inprogress: {
          color: "bg-blue-100 text-blue-800",
          icon: Clock,
          label: "In Progress",
        },
      },
    };
    const config = configs[type]?.[status] || {
      color: "bg-gray-100 text-gray-800",
      icon: AlertCircle,
      label: status,
    };
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" /> {config.label}
      </span>
    );
  };

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "-";
  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount || 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">Rider Details</h2>
                <p className="text-xs text-gray-500">
                  ID: {rider._id?.slice(-8)}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
                <User className="w-4 h-4" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">User ID</p>
                  <p className="font-mono text-sm">{rider.userId}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">City</p>
                  <p className="font-medium">{rider.city}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Delivery Radius</p>
                  <p>{rider.deliveryRadiusInKm} KM</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">KYC Status</p>
                  {getStatusBadge(rider.kycStatus, "kyc")}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Availability</p>
                  {getStatusBadge(rider.availabilityStatus, "availability")}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Account Status</p>
                  {getStatusBadge(rider.status, "account")}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Approval</p>
                  {rider.isApproved ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Approved
                    </span>
                  ) : (
                    <span className="text-red-600">Not Approved</span>
                  )}
                </div>
              </div>
            </div>

            {/* Vehicle Details */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
                <Bike className="w-4 h-4" /> Vehicle Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Vehicle Type</p>
                  <p className="capitalize">{rider.vehicleType}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Vehicle Number</p>
                  <p className="font-mono">{rider.vehicleNumber}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">License Number</p>
                  <p className="font-mono">{rider.drivingLicenseNumber}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
                <FileText className="w-4 h-4" /> Documents
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">RC Document</p>
                  {renderFile(rider.rcDocument, "RC")}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">License Document</p>
                  {renderFile(rider.licenseDocument, "License")}
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-2">Aadhar Document</p>
                  {renderFile(rider.aadharDocument, "Aadhar")}
                </div>
              </div>
            </div>

            {/* Bank Details */}
            {rider.bankDetails && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
                  <CreditCard className="w-4 h-4" /> Bank Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Account Holder</p>
                    <p>{rider.bankDetails.accountHolderName}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Account Number</p>
                    <p className="font-mono">
                      XXXX{rider.bankDetails.accountNumber?.slice(-4)}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">IFSC Code</p>
                    <p className="uppercase">{rider.bankDetails.IFSC}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Bank Name</p>
                    <p>{rider.bankDetails.bankName}</p>
                  </div>
                  {rider.bankDetails.UPI && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500">UPI ID</p>
                      <p>{rider.bankDetails.UPI}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
                <Truck className="w-4 h-4" /> Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-blue-600">Total Deliveries</p>
                  <p className="text-xl font-bold text-blue-800">
                    {rider.totalDeliveries || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-green-600">Completed</p>
                  <p className="text-xl font-bold text-green-800">
                    {rider.completedDeliveries || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-red-600">Cancelled</p>
                  <p className="text-xl font-bold text-red-800">
                    {rider.cancelledDeliveries || 0}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-yellow-600">Rating</p>
                  <p className="text-xl font-bold text-yellow-800">
                    {rider.averageRating || 0} ★
                  </p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-purple-600">Earnings</p>
                  <p className="text-xl font-bold text-purple-800">
                    {formatCurrency(rider.totalEarnings)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg text-center">
                  <p className="text-xs text-indigo-600">Success Rate</p>
                  <p className="text-xl font-bold text-indigo-800">
                    {rider.totalDeliveries > 0
                      ? Math.round(
                          (rider.completedDeliveries / rider.totalDeliveries) *
                            100,
                        )
                      : 0}
                    %
                  </p>
                </div>
              </div>
            </div>

            {/* Location & Timeline */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 border-b pb-2">
                <Calendar className="w-4 h-4" /> Timeline & Location
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Joined On</p>
                  <p>{formatDate(rider.createdAt)}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p>{formatDate(rider.updatedAt)}</p>
                </div>
                {rider.kycVerifiedAt && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">KYC Verified</p>
                    <p>{formatDate(rider.kycVerifiedAt)}</p>
                  </div>
                )}
                {rider.currentLocation?.coordinates && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500">Current Location</p>
                    <p className="font-mono text-sm">
                      Lat: {rider.currentLocation.coordinates[1]}, Lng:{" "}
                      {rider.currentLocation.coordinates[0]}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Rejection Reason */}
            {rider.rejectionReason && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm font-medium text-red-800">
                  Rejection Reason:
                </p>
                <p className="text-sm text-red-700 mt-1">
                  {rider.rejectionReason}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
