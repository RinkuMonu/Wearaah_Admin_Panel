import {
  Boxes,
  FeatherIcon,
  HelpCircle,
  IndianRupeeIcon,
  LayoutDashboard,
  ListOrderedIcon,
  Mail,
  MessageSquare,
  ScanFace,
  ScanLine,
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
      {
        name: "Rider",
        path: "/riderManagementTable",
        roles: ["superadmin"],
      },
      {
        name: "Customers", // ✅ ADD THIS
        path: "/customers",
        roles: ["superadmin"],
      },
      // { name: "Vendors", path: "/purchase/vendors", roles: ["superadmin"] },
    ],
  },
  {
    name: "Kyc Management",
    icon: ScanFace,
    roles: ["superadmin"],
    submenu: [
      {
        name: "Seller Kyc",
        path: "/pendingKycSellerList",
        roles: ["superadmin"],
      },
      {
        name: "Rider Kyc",
        path: "/pendingKycRiderList",
        roles: ["superadmin"],
      },
    ],
  },
  {
    name: "QC Management",
    icon: ScanLine,
    roles: ["superadmin", "seller"],
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
    name: "Withdrawal Requests",
    path: "/withdrawal/requests",
    icon: IndianRupeeIcon,
    roles: ["superadmin", "seller"],
  },
  {
    name: "Wallet Report",
    path: "/wallettransactions",
    icon: Wallet,
    roles: ["superadmin", "seller"],
  },
  {
    name: "Lead We Have",
    path: "/leadwehave",
    icon: UserCheck2,
    roles: ["superadmin"],
  },
  {
    name: "Rider Register",
    path: "/riderregister",
    icon: UserCheck2,
    roles: ["superadmin", "seller"],
  },
  // {
  //   name: "Employee",
  //   path: "/employee",
  //   icon: Users,
  //   roles: ["superadmin"],
  // },

  // {
  //   name: "Purchase",
  //   icon: Truck,
  //   roles: ["superadmin", "seller"],
  //   submenu: [
  //     {
  //       name: "All Purchases",
  //       path: "/purchase",
  //       roles: ["superadmin", "seller"],
  //     },
  //     { name: "Add Purchase", path: "/purchase/add", roles: ["seller"] },
  //     { name: "Vendors", path: "/purchase/vendors", roles: ["superadmin"] },
  //   ],
  // },

  {
    name: "Contact",
    path: "/contact",
    icon: MessageSquare,
    roles: ["superadmin", "employee"],
  },

  {
    name: "FAQ Management",
    path: "/faq",
    icon: HelpCircle,
    roles: ["superadmin"],
  },
  {
  name: "Newsletter",
  path: "/newsletter",
  icon: Mail,
  roles: ["superadmin"],
},
];
