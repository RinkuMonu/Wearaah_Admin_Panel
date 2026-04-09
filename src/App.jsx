import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard";
import ProductPage from "./pages/inventory/product/Product";
import StockPage from "./pages/inventory/Stock";
import CategorySection from "./pages/inventory/Category&Brand";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { ProtectedRoute, PublicRoute } from "./serviceAuth/protectRoute";
import Unauthorized from "./pages/unauthorized";
import { RoleProtectedRoute } from "./serviceAuth/roleAuthChecking";
import CategoryPage from "./pages/inventory/category/CategoryPage";
import BrandPage from "./pages/BrandPage/BrandPage";
import ContactPage from "./pages/ContactPage/ContactPage";
import SubCategoryPage from "./pages/inventory/subcategory/subcategoryPage";
import { QuickBilling } from "./pages/QuickBilling/quickBilling";
import LeadsPage from "./pages/LeadPage/leadpage";
import { OrdersPage } from "./pages/Orderpage/order";
import { useEffect } from "react";
import GlobalOrderAlert from "./Config/GlobalOrderAlert";
import SellerStepper from "./pages/SellerStepperForm/SellerStepper";
import SellerList from "./pages/UserManagement/seller";
import VariantStockManagement from "./pages/inventory/stock/variantStockManage";
import QCProductsList from "./pages/QcProducts/QcProducts";
import WalletTransactions from "./pages/Report/WalletTransactions";
import WithdrawalRequests from "./pages/WithdrawalRequests/WithdrawalRequests";
import UserProfile from "./pages/Profile/basic";
import ProfilePage from "./pages/Profile/Profile";
import RiderList from "./pages/UserManagement/rider";
import SearchTest from "./components/test";

function App() {
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);
  return (
    <>
      <GlobalOrderAlert />
      <BrowserRouter>
        <Routes>
          <Route path="SellerStepper" element={<SellerStepper />} />
            <Route path="/test" element={<SearchTest />} />
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route
                element={<RoleProtectedRoute allowedRoles={["superadmin"]} />}
              >
                <Route path="category" element={<CategoryPage />} />
                <Route path="subcategory" element={<SubCategoryPage />} />
                <Route path="leadwehave" element={<LeadsPage />} />
                <Route path="SellerManagementTable" element={<SellerList />} />
                <Route path="riderManagementTable" element={<RiderList />} />
              </Route>
              <Route element={<RoleProtectedRoute allowedRoles={["seller"]} />}>
                {/* nothing */}
              </Route>
              <Route
                element={
                  <RoleProtectedRoute allowedRoles={["seller", "superadmin"]} />
                }
              >
                <Route path="profile" element={<ProfilePage />} />
                <Route path="product" element={<ProductPage />} />
                <Route path="stock" element={<StockPage />} />
                <Route path="brand" element={<BrandPage />} />
                <Route path="odersPage" element={<OrdersPage />} />
                <Route path="contact" element={<ContactPage />} />
                <Route path="quickbilling" element={<QuickBilling />} />
                <Route path="qCProducts" element={<QCProductsList />} />
                <Route
                  path="wallettransactions"
                  element={<WalletTransactions />}
                />
                <Route
                  path="Variant/Stock/Management"
                  element={<VariantStockManagement />}
                />
                <Route
                  path="withdrawal/requests"
                  element={<WithdrawalRequests />}
                />
                <Route path="test" element={<UserProfile />} />
              </Route>
            </Route>
          </Route>
          <Route path="unauthorized" element={<Unauthorized />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
