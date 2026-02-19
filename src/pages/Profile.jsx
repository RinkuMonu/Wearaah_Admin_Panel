import { useState } from "react";

export default function ProfilePage() {
  const [shopStatus, setShopStatus] = useState("Open");
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "Devika Chhipa",
    email: "devika@email.com",
    mobile: "9876543210",
    pan: "ABCDE1234F",

    shopName: "Sevenunique Store",
    businessType: "Retail",
    experience: "5",
    gst: "22ABCDE1234F1Z5",
    address1: "Main Street",
    address2: "Near Market",
    workingHours: "9:00 AM - 9:00 PM",

    bankName: "HDFC Bank",
    holderName: "Devika Chhipa",
    ifsc: "HDFC0001234",
    accountNumber: "XXXXXX1234",
    upi: "devika@upi",

    social: "instagram.com/devika",
    verifiedDate: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    setIsEditing(false);

    console.log("Saved Data:", {
      ...formData,
      shopStatus,
    });

    // 👉 Add your API call here
  };

  return (
    <div className="p-6 min-h-screen space-y-8 bg-gray-50">
      {/* Header */}
      <div className="flex justify-between items-center bg-[#f5efdd] p-3 rounded-md">
        <h2 className="text-2xl font-semibold">Profile</h2>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-[#927f68] text-white rounded-md"
          >
            Edit
          </button>
        ) : (
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* USER DETAILS */}
      <Section title="User Details">
        <Input label="Full Name" name="fullName" value={formData.fullName} disabled={!isEditing} onChange={handleChange} />
        <Input label="Email" name="email" value={formData.email} disabled={!isEditing} onChange={handleChange} />
        <Input label="Mobile Number" name="mobile" value={formData.mobile} disabled={!isEditing} onChange={handleChange} />
        <Input label="PAN Number" name="pan" value={formData.pan} disabled={!isEditing} onChange={handleChange} />
      </Section>

      {/* SHOP DETAILS */}
      <Section title="Shop Details">
        <Input label="Shop Name" name="shopName" value={formData.shopName} disabled={!isEditing} onChange={handleChange} />
        <Input label="Business Type" name="businessType" value={formData.businessType} disabled={!isEditing} onChange={handleChange} />
        <Input label="Years of Experience" name="experience" value={formData.experience} disabled={!isEditing} onChange={handleChange} />
        <Input label="GST Number" name="gst" value={formData.gst} disabled={!isEditing} onChange={handleChange} />
        <Input label="Pickup Address 1" name="address1" value={formData.address1} disabled={!isEditing} onChange={handleChange} />
        <Input label="Pickup Address 2" name="address2" value={formData.address2} disabled={!isEditing} onChange={handleChange} />

        <div>
          <label className="block text-sm font-medium mb-1">Shop Status</label>
          <select
            value={shopStatus}
            onChange={(e) => setShopStatus(e.target.value)}
            disabled={!isEditing}
            className="w-full rounded-md px-3 py-2 text-sm disabled:bg-gray-50"
          >
            <option>Open</option>
            <option>Closed</option>
          </select>
        </div>

        <Input label="Working Hours" name="workingHours" value={formData.workingHours} disabled={!isEditing} onChange={handleChange} />
      </Section>

      {/* BANK DETAILS */}
      <Section title="Bank Details">
        <Input label="Bank Name" name="bankName" value={formData.bankName} disabled={!isEditing} onChange={handleChange} />
        <Input label="Account Holder Name" name="holderName" value={formData.holderName} disabled={!isEditing} onChange={handleChange} />
        <Input label="IFSC Code" name="ifsc" value={formData.ifsc} disabled={!isEditing} onChange={handleChange} />
        <Input label="Account Number" name="accountNumber" value={formData.accountNumber} disabled={!isEditing} onChange={handleChange} />
        <Input label="UPI ID" name="upi" value={formData.upi} disabled={!isEditing} onChange={handleChange} />
      </Section>

      {/* KYC DOCUMENTS */}
      <Section title="KYC Documents">
        <FileUpload label="GST Certificate (PDF)" disabled={!isEditing} />
        <FileUpload label="PAN Card (PDF)" disabled={!isEditing} />
        <FileUpload label="Shop License (PDF)" disabled={!isEditing} />
        <FileUpload label="Cancelled Cheque (PDF)" disabled={!isEditing} />

        <Input label="Social Media Links" name="social" value={formData.social} disabled={!isEditing} onChange={handleChange} />
        <Input label="Last Verified Date" name="verifiedDate" type="date" value={formData.verifiedDate} disabled={!isEditing} onChange={handleChange} />
      </Section>
    </div>
  );
}

/* SECTION WRAPPER */
function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 border-b pb-2">
        {title}
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {children}
      </div>
    </div>
  );
}

/* REUSABLE INPUT */
function Input({ label, name, value, type = "text", disabled, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full rounded-md px-3 py-2 text-sm disabled:bg-gray-50 "
      />
    </div>
  );
}

/* FILE UPLOAD */
function FileUpload({ label, disabled }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="file"
        accept="application/pdf"
        disabled={disabled}
        className="w-full rounded-md px-3 py-2 text-sm bg-white disabled:bg-gray-50 "
      />
    </div>
  );
}