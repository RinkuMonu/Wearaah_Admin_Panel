import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Dashboard from "./pages/dashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
      
          <Route
            path="*"
            element={
              <div className="text-center py-20">
                <h1 className="text-6xl font-bold text-gray-400">404</h1>
                <p className="text-xl text-gray-500">Page Not Found</p>
              </div>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;