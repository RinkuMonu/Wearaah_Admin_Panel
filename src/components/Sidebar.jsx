import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Boxes,
  Users,
  Truck,
  MessageSquare,
  ChevronDown,
} from "lucide-react";

export default function Sidebar({ isOpen }) {
  const [openMenu, setOpenMenu] = useState(null);

  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    {
      name: "Inventory",
      icon: Boxes,
      submenu: [
        { name: "All Products", path: "/Product" },
        { name: "Stock", path: "/stock" },
        { name: "Category/Brand", path: "/category" },
      ],
    },
    { name: "Employee", path: "/employee", icon: Users },
    {
      name: "Purchase",
      icon: Truck,
      submenu: [
        { name: "All Purchases", path: "/purchase" },
        { name: "Add Purchase", path: "/purchase/add" },
        { name: "Vendors", path: "/purchase/vendors" },
      ],
    },
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
            const isDropdown = item.submenu;

            return (
              <div key={index}>
                {/* Main Menu Item */}
                {isDropdown ? (
                  <div
                    onClick={() =>
                      setOpenMenu(
                        openMenu === item.name ? null : item.name
                      )
                    }
                    className="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer hover:bg-[#998f72] hover:text-white transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">
                        {item.name}
                      </span>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        openMenu === item.name
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </div>
                ) : (
                  <NavLink
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
                )}

                {/* Submenu */}
                {isDropdown && openMenu === item.name && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-3 py-1 text-sm rounded-md transition-all
                          ${
                            isActive
                              ? "bg-[#f5efdd] text-black"
                              : "hover:bg-[#998f72] hover:text-white"
                          }`
                        }
                      >
                        {subItem.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}