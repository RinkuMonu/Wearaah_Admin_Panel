import React from "react";
import { STEPS } from "../routing/constants";

const StepIndicator = ({ current }) => {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.id}>
          <div className="flex flex-col items-center gap-1">
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                step.id < current
                  ? "bg-[#e8c547] border-[#e8c547] text-[#0a0a0a]"
                  : step.id === current
                  ? "bg-[#0a0a0a] border-[#e8c547] text-[#e8c547]"
                  : "bg-[#0a0a0a] border-[#2a2a2a] text-[#444]"
              }`}
            >
              {step.id < current ? "✓" : step.id}
            </div>
            <span
              className={`text-[10px] font-mono tracking-wide ${
                step.id === current
                  ? "text-[#e8c547]"
                  : step.id < current
                  ? "text-[#888]"
                  : "text-[#333]"
              }`}
            >
              {step.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div
              className={`w-10 h-[2px] mb-4 transition-all duration-300 ${
                step.id < current ? "bg-[#e8c547]" : "bg-[#2a2a2a]"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;