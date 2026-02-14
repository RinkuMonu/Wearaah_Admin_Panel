import { Phone, Menu, UserRound } from "lucide-react";

export default function Header({ toggleSidebar }) {
  return (
    <header className="w-full bg-[black] text-white px-6 py-3 flex items-center justify-between shadow-md">
      
      {/* Left Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-3xl font-bold text-[#f5efdd]">Lionies</span>
          <span className="bg-gray-200 text-black text-xs px-2 py-0.5 rounded font-semibold">
            ERP
          </span>
        </div>

        {/* Toggle Button */}
        <Menu
          onClick={toggleSidebar}
          className="w-5 h-5 text-gray-300 cursor-pointer hover:text-white"
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <Phone className="w-4 h-4" />
          <span>+91 80 00877 644 (9:00 AM - 9:00 PM IST)</span>
        </div>

        <div className="bg-gray-200 text-black text-sm px-3 py-1 rounded-md font-medium">
          2025–2026
        </div>

        <div className="w-9 h-9 rounded-full bg-[#f5efdd] text-[#281c16] flex items-center justify-center font-semibold cursor-pointer">
   <UserRound />
        </div>
      </div>
    </header>
  );
}