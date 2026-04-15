import React, { useState } from "react";
// import { StepIndicator } from "../../components/rider/StepIndicator";
// import Step1_Verification from "../../components/rider/Step1_Verification";
// import Step2_BasicInfo from "../../components/rider/Step2_BasicInfo";
// import Step3_Location from "../../components/rider/Step3_Location";
// import PlaceholderStep from "../../components/rider/PlaceholderStep";
import { StepIndicator } from "../pages/Rider/StepIndicator";
import Step1_Verification from "../pages/Rider/Step1_Verification";
import Step2_BasicInfo from "../pages/Rider/Step2_BasicInfo";
import Step3_Location from "../pages/Rider/Step3_Location";
import PlaceholderStep from "../pages/Rider/PlaceholderStep";

const STEPS = [
  { id: 1, label: "Verification", icon: "🛡️" },
  { id: 2, label: "Basic Info", icon: "📋" },
  { id: 3, label: "Location", icon: "📍" },
  { id: 4, label: "Documents", icon: "📄" },
  { id: 5, label: "Review", icon: "✅" },
];

const RiderDetails1 = () => {
  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState({ userId: null, token: null });

  const next = (data = {}) => {
    setMeta((m) => ({ ...m, ...data }));
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at 20% 50%, rgba(232,197,71,0.04) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(232,197,71,0.03) 0%, transparent 50%)",
        fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&display=swap');
        select option { background: #1a1a1a; color: #f0ede8; }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #0a0a0a; }
        ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; }
      `}</style>

      <div className="w-full">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#e8c547]/10 border border-[#e8c547]/20 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#e8c547] rounded-full animate-pulse" />
            <span className="text-[#e8c547] text-xs font-mono tracking-widest uppercase">Rider Onboarding</span>
          </div>
          <h1 className="text-3xl font-bold text-[#f0ede8]" style={{ letterSpacing: "-0.02em" }}>
            Join as a Rider
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 bg-[#0a0a0a]"
          style={{
            border: "1px solid #1e1e1e",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          <StepIndicator current={step} />

          {step === 1 && <Step1_Verification onNext={next} />}
          {step === 2 && <Step2_BasicInfo userId={meta.userId} token={meta.token} onNext={next} onBack={back} />}
          {step === 3 && <Step3_Location userId={meta.userId} token={meta.token} onNext={next} onBack={back} />}
          {(step === 4 || step === 5) && <PlaceholderStep step={step} onBack={back} />}
        </div>

        <p className="text-center text-[#333] text-xs font-mono mt-6">
          Step {step} of {STEPS.length} — {STEPS[step - 1]?.label}
        </p>
      </div>
    </div>
  );
};

export default RiderDetails1;