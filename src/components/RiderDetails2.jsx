import React, { useState } from "react";
import SuccessScreen from "./SuccessScreen";
import Step1 from "./Steps/Step1Verification";
import Step2 from "./Steps/Step2BasicInfo";
import Step3 from "./Steps/license/Step3Location";
import Step4 from "./Steps/license/Step4BankDetails";
import Step5 from "./Steps/license/Step5Documents";
import { STEPS } from "../routing/constants";
import StepIndicator from "./StepIndicator";
// import { STEPS } from "./constants";
// import StepIndicator from "./components/StepIndicator";
// import SuccessScreen from "./components/SuccessScreen";
// import Step1 from "./steps/Step1Verification";
// import Step2 from "./steps/Step2BasicInfo";
// import Step3 from "./steps/Step3Location";
// import Step4 from "./steps/Step4BankDetails";
// import Step5 from "./steps/Step5Documents";

const RiderDetails2 = () => {
  const [step, setStep] = useState(1);
  const [meta, setMeta] = useState({ userId: null, token: null });
  const [done, setDone] = useState(false);

  const next = (data = {}) => {
    const { resumeStep, ...rest } = data;
    setMeta((m) => ({ ...m, ...data }));
    if (step === 5) {
      setDone(true);
      return;
    }
    if (resumeStep && resumeStep > step) {
      setStep(resumeStep);
    } else {
      setStep((s) => Math.min(s + 1, 5));
    }
    setStep((s) => Math.min(s + 1, 5));
  };

  const back = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 rounded-2xl"
      style={{
        background: "#0a0a0a",
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
            <span className="text-[#e8c547] text-xs font-mono tracking-widest uppercase">
              Rider Onboarding
            </span>
          </div>
          <h1
            className="text-3xl font-bold text-[#f0ede8]"
            style={{ letterSpacing: "-0.02em" }}
          >
            Join as a Rider
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, #141414 0%, #111 100%)",
            border: "1px solid #1e1e1e",
            boxShadow:
              "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.03)",
          }}
        >
          {done ? (
            <SuccessScreen />
          ) : (
            <>
              <StepIndicator current={step} />
              {step === 1 && <Step1 onNext={next} />}
              {step === 2 && (
                <Step2
                  userId={meta.userId}
                  token={meta.token}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 3 && (
                <Step3
                  userId={meta.userId}
                  token={meta.token}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 4 && (
                <Step4
                  userId={meta.userId}
                  token={meta.token}
                  onNext={next}
                  onBack={back}
                />
              )}
              {step === 5 && (
                <Step5
                  userId={meta.userId}
                  token={meta.token}
                  onNext={next}
                  onBack={back}
                />
              )}
            </>
          )}
        </div>

        {!done && (
          <p className="text-center text-[#333] text-xs font-mono mt-6">
            Step {step} of {STEPS.length} — {STEPS[step - 1]?.label}
          </p>
        )}
      </div>
    </div>
  );
};

export default RiderDetails2;