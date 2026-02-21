import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard";
import ProductPage from "./pages/inventory/product/Product";
import StockPage from "./pages/inventory/Stock";
import CategoryBrandSection from "./pages/inventory/Category&Brand";
import ProfilePage from "./pages/Profile";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import NewProductPage from "./pages/inventory/product/CreateNew";

function App() {
  return (
    <BrowserRouter>
      <Routes>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />

        <Route path="/" element={<Layout />}>

          {/* Dashboard */}
          <Route index element={<Dashboard />} />

          {/* Product Page */}
          <Route path="product" element={<ProductPage />} />
          <Route path="stock" element={<StockPage />} />
          <Route path="category" element={<CategoryBrandSection />} />
          <Route path="profile" element={<ProfilePage/>} />
          <Route path="createnew" element={<NewProductPage />} />

        





          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h1 className="text-6xl font-bold text-gray-400">404</h1>
                <p className="text-xl text-gray-500">
                  Page Not Found
                </p>
              </div>
            }
          />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;