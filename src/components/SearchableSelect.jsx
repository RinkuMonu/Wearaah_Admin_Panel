import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

export default function SearchableSelect({
  label,
  options,
  value,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}

      {/* Selected Field */}
      <div
        onClick={() => setOpen(!open)}
        className="border border-gray-300 rounded-md px-3 py-2 text-sm flex justify-between items-center cursor-pointer bg-white"
      >
        <span>{value || "Select Option"}</span>
        <ChevronDown size={16} />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg z-[9999]">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-3 py-2 border-b text-sm outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={index}
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
                >
                  {option}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-400">
                No results found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}