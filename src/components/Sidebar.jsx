import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Users,
  Truck,
  MessageSquare,
} from "lucide-react";

export default function Sidebar({ isOpen }) {
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Inventory", path: "/inventory", icon: Boxes },
    { name: "Employee", path: "/employee", icon: Users },
    { name: "Purchase", path: "/purchase", icon: Truck },
    { name: "Contact", path: "/contact", icon: MessageSquare },
  ];

  return (
    <aside
      className={`
        fixed top-13 left-0 h-screen bg-black text-gray-300
        transition-all duration-300 z-50
        ${isOpen ? "w-64" : "w-0"}
        overflow-hidden
      `}
    >
      <div className="p-4">
        <nav className="space-y-2 mt-6">
          {menuItems.map((item, index) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#f5efdd] text-black"
                      : "hover:bg-[#998f72] hover:text-white"
                  }`
                }
              >
                <Icon size={18} />
                <span className="text-sm font-medium">
                  {item.name}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}