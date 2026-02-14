import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

export default function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* 🔵 Sticky Header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <Header toggleSidebar={() => setIsOpen(!isOpen)} />
      </div>

      {/* 🔵 Sidebar */}
      <Sidebar isOpen={isOpen} />
      {/* 🔵 Main Content */}
      <main
        className={`
          pt-16 transition-all duration-300
          ${isOpen ? "ml-64" : "ml-0"}
          p-6
        `}
      >
        <Outlet />
      </main>
    </div>
  );
}