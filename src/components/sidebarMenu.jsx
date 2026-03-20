import {
  Boxes,
  FeatherIcon,
  LayoutDashboard,
  ListOrderedIcon,
  MessageSquare,
  Truck,
  UserCheck2,
  Users,
} from "lucide-react";

export const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["superadmin", "seller", "employee"],
  },

  {
    name: "Inventory",
    icon: Boxes,
    roles: ["superadmin", "seller"],
    submenu: [
      {
        name: "All Products",
        path: "/product",
        roles: ["superadmin", "seller"],
      },
      { name: "Brand", path: "/brand", roles: ["superadmin", "seller"] },
      { name: "Category", path: "/category", roles: ["superadmin"] },
      { name: "Sub Category", path: "/subcategory", roles: ["superadmin"] },
      { name: "Stock", path: "/stock", roles: ["superadmin", "seller"] },
    ],
  },

  {
    name: "Quick Billing",
    path: "/quickbilling",
    icon: FeatherIcon,
    roles: ["superadmin", "seller"],
  },
  {
    name: "Order Management",
    path: "/odersPage",
    icon: ListOrderedIcon,
    roles: ["superadmin", "seller"],
  },
  {
    name: "Lead We Have",
    path: "/leadwehave",
    icon: UserCheck2,
    roles: ["superadmin"],
  },
  {
    name: "Employee",
    path: "/employee",
    icon: Users,
    roles: ["superadmin"],
  },

  {
    name: "Purchase",
    icon: Truck,
    roles: ["superadmin", "seller"],
    submenu: [
      {
        name: "All Purchases",
        path: "/purchase",
        roles: ["superadmin", "seller"],
      },
      { name: "Add Purchase", path: "/purchase/add", roles: ["seller"] },
      { name: "Vendors", path: "/purchase/vendors", roles: ["superadmin"] },
    ],
  },

  {
    name: "Contact",
    path: "/contact",
    icon: MessageSquare,
    roles: ["superadmin", "employee"],
  },
];
