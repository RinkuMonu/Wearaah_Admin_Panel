import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomSelect = ({ label, options = [], value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = (option) => {
    if (typeof option === "string") return option;
    return option.label;
  };

  const getValue = (option) => {
    if (typeof option === "string") return option;
    return option.value;
  };

  const selectedLabel = options.find((opt) => getValue(opt) === value);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-1">{label}</label>
      )}

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm flex justify-between items-center cursor-pointer bg-white"
      >
        {selectedLabel ? getLabel(selectedLabel) : "Select"}
        <ChevronDown size={16} />
      </div>

      {isOpen && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-md z-50 max-h-60 overflow-auto">
          {options.map((option, index) => (
            <div
              key={index}
              onClick={() => {
                onChange(getValue(option));
                setIsOpen(false);
              }}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-gray-200"
            >
              {getLabel(option)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
