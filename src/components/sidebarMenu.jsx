import {
  Boxes,
  FeatherIcon,
  LayoutDashboard,
  ListOrderedIcon,
  MessageSquare,
  Truck,
  User2,
  UserCheck2,
  Users,
  Wallet,
  WeightTilde,
} from "lucide-react";

export const menuItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
    roles: ["superadmin", "seller", "employee"],
  },

  {
    name: "User Management",
    icon: User2,
    roles: ["superadmin"],
    submenu: [
      {
        name: "Seller",
        path: "/SellerManagementTable",
        roles: ["superadmin"],
      },
      // { name: "Vendors", path: "/purchase/vendors", roles: ["superadmin"] },
    ],
  },
  {
    name: "QC Management",
    icon: User2,
    roles: ["superadmin", "`seller`"],
    submenu: [
      {
        name: "Variant QC",
        path: "/qCProducts",
        roles: ["superadmin", "seller"],
      },
      // { name: "Vendors", path: "/purchase/vendors", roles: ["superadmin"] },
    ],
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
    name: "Stock Management",
    path: "/Variant/Stock/Management",
    icon: WeightTilde,
    roles: ["superadmin", "seller"],
  },
  {
    name: "Lead We Have",
    path: "/leadwehave",
    icon: UserCheck2,
    roles: ["superadmin"],
  },
  {
    name: "Wallet Report",
    path: "/wallettransactions",
    icon: Wallet,
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
