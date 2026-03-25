import { useState } from "react";
import Step1Verification from "./Step1Verification";
import Step2Business from "./Step2Business";
import Step3Address from "./Step3Address";
import Step4Bank from "./Step4Bank";
import Step5Documents from "./Step5Documents";

export default function SellerStepper() {
  const [step, setStep] = useState(1);
  const [maxStep, setMaxStep] = useState(1);

  // ✅ NEXT (only after success)
  const handleNext = (nextStep) => {
    setStep(nextStep);
    setMaxStep(nextStep);
  };

  // ✅ BACK
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // 🔥 STEP RENDER MAP
  const steps = {
    1: (
      <Step1Verification
        onSuccess={(step) => {
          setStep(step);
          setMaxStep(step);
        }}
      />
    ),
    2: <Step2Business onSuccess={() => handleNext(3)} />,
    3: <Step3Address onSuccess={() => handleNext(4)} />,
    4: <Step4Bank onSuccess={() => handleNext(5)} />,
    5: <Step5Documents onSuccess={() => handleNext(5)} />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* 🔥 MAIN CARD */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* 🔥 HEADER WITH PROGRESS */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              Seller Onboarding
            </h2>
            <p className="text-gray-300 text-sm">
              Complete these steps to start selling on our platform
            </p>
          </div>

          {/* 🔥 STEP INDICATOR */}
          <div className="px-6 pt-6 pb-2 border-b border-gray-200">
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <div key={s} className="flex-1">
                  <button
                    onClick={() => setStep(s)}
                    disabled={s > maxStep}
                    className={`w-full group relative transition-all duration-200 ${
                      s > maxStep ? "cursor-not-allowed" : "cursor-pointer"
                    }`}
                  >
                    {/* Progress Line Connector */}
                    {s > 1 && (
                      <div
                        className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 transition-all duration-300 ${
                          s <= maxStep
                            ? "bg-gradient-to-r from-green-500 to-green-500"
                            : "bg-gray-200"
                        }`}
                        style={{ left: "-50%", width: "100%" }}
                      />
                    )}

                    {/* Step Circle */}
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`
                          w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold
                          transition-all duration-300 z-10 relative
                          ${
                            step === s
                              ? "bg-gradient-to-r from-gray-900 to-gray-800 text-white ring-4 ring-gray-200 scale-110"
                              : s <= maxStep
                                ? "bg-green-500 text-white hover:shadow-lg"
                                : "bg-gray-200 text-gray-400"
                          }
                        `}
                      >
                        {s <= maxStep && s !== step ? (
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
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        ) : (
                          s
                        )}
                      </div>
                      <span
                        className={`absolute -bottom-6 text-xs font-medium whitespace-nowrap ${
                          step === s
                            ? "text-gray-900"
                            : s <= maxStep
                              ? "text-gray-600"
                              : "text-gray-400"
                        }`}
                      >
                        Step {s}
                      </span>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 🔥 REAL STEP CONTENT */}
          <div className="p-6 bg-gray-50 min-h-[400px]">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {steps[step]}
            </div>
          </div>

          {/* 🔥 BACK BUTTON */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={handleBack}
                disabled={step === 1}
                className={`
                  px-6 py-2.5 rounded-lg font-medium transition-all duration-200
                  flex items-center gap-2
                  ${
                    step === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300 hover:shadow-md active:scale-95"
                  }
                `}
              >
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
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back
              </button>

              {/* Progress Text */}
              <div className="text-sm text-gray-500">Step {step} of 5</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
