import React from "react";

const SuccessScreen = () => {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="text-5xl mb-2">🎉</div>
      <h2 className="text-2xl font-bold text-[#f0ede8] font-mono">
        Registration Complete!
      </h2>
      <p className="text-[#555] text-sm font-mono">
        Your KYC has been submitted. Our team will review and activate your
        account shortly.
      </p>
      <div className="bg-[#e8c547]/10 border border-[#e8c547]/20 rounded-xl px-4 py-3 text-[#e8c547] text-xs font-mono">
        You'll receive a confirmation on your registered mobile number.
      </div>
    </div>
  );
};

export default SuccessScreen;