import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard";
import ProductPage from "./pages/inventory/Product";
import StockPage from "./pages/inventory/Stock";
import CategorySection from "./pages/inventory/Category&Brand";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import { ProtectedRoute, PublicRoute } from "./serviceAuth/protectRoute";
import Unauthorized from "./pages/unauthorized";
import { RoleProtectedRoute } from "./serviceAuth/roleAuthChecking";
import CategoryPage from "./pages/inventory/category/CategoryPage";
import BrandPage from "./pages/BrandPage/BrandPage";
import SubCategoryPage from "./pages/inventory/subcategory/subcategoryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route
              element={<RoleProtectedRoute allowedRoles={["superadmin"]} />}
            >
              <Route path="category" element={<CategoryPage />} />
              <Route path="subcategory" element={<SubCategoryPage />} />
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
            </Route>
          </Route>
        </Route>
        <Route path="unauthorized" element={<Unauthorized />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
