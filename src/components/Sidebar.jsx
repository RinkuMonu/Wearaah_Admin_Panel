import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../serviceAuth/context";
import { menuItems } from "./sidebarMenu";

export default function Sidebar({ isOpen }) {
  const { user } = useAuth();
  const [openMenu, setOpenMenu] = useState(null);

  useEffect(() => {
    setOpenMenu(null);
  }, [user?.user?.role]);

  // ✅ ROLE BASED FILTER
  const filteredMenu = menuItems
    .filter((item) => item.roles.includes(user?.user?.role))
    .map((item) => {
      if (item.submenu) {
        const filteredSub = item.submenu.filter((sub) =>
          sub.roles.includes(user?.user?.role),
        );

        // ❌ agar submenu empty → item hide
        if (filteredSub.length === 0) return null;

        return { ...item, submenu: filteredSub };
      }
      return item;
    })
    .filter(Boolean);

  return (
    <aside
      className={`fixed top-13 left-0 h-screen bg-black text-gray-300
      transition-all duration-300 z-50
      ${isOpen ? "w-64" : "w-0"} overflow-hidden`}
    >
      <div className="p-4">
        <nav className="space-y-2 mt-6">
          {/* ✅ USE filteredMenu HERE */}
          {filteredMenu.map((item, index) => {
            const Icon = item.icon;
            const isDropdown = item.submenu;

            return (
              <div key={index}>
                {isDropdown ? (
                  <div
                    onClick={() =>
                      setOpenMenu(openMenu === item.name ? null : item.name)
                    }
                    className="flex items-center justify-between px-4 py-2 rounded-md cursor-pointer hover:bg-[#998f72] hover:text-white"
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>

                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        openMenu === item.name ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                ) : (
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-2 rounded-md
                      ${
                        isActive
                          ? "bg-[#f5efdd] text-black"
                          : "hover:bg-[#998f72] hover:text-white"
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.name}</span>
                  </NavLink>
                )}

                {/* SUBMENU */}
                {isDropdown && openMenu === item.name && (
                  <div className="ml-8 mt-2 space-y-1">
                    {item.submenu.map((subItem, subIndex) => (
                      <NavLink
                        key={subIndex}
                        to={subItem.path}
                        className={({ isActive }) =>
                          `block px-3 py-1 text-sm rounded-md
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
