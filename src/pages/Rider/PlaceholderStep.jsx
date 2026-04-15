import React from "react";
import { STEPS } from "./StepIndicator";

function PlaceholderStep({ step, onBack }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-[#f0ede8] font-mono mb-1">{STEPS[step - 1]?.label}</h2>
        <p className="text-[#555] text-sm font-mono">This step will be available soon.</p>
      </div>
      <div className="bg-[#1a1a1a] border border-dashed border-[#2a2a2a] rounded-xl p-8 text-center text-[#444] font-mono text-sm">
        Step {step} — Coming soon
      </div>
      <button
        onClick={onBack}
        className="w-full border border-[#2a2a2a] hover:border-[#444] text-[#888] font-mono py-3.5 rounded-xl transition-all text-sm"
      >
        ← Back
      </button>
    </div>
  );
}

export default PlaceholderStep;