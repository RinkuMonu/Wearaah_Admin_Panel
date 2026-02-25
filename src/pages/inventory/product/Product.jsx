// // pages/inventory/product/ProductPage.jsx
// import { useState, useRef, useEffect } from "react";
// import {
//   Upload,
//   FileEdit,
//   Filter,
//   Plus,
//   Search,
//   MoreVertical,
//   FileDown,
//   FileSpreadsheet,
//   FileText,
//   ScanLine
// } from "lucide-react";

// import CustomSelect from "../../../components/CustomSelectdropdown";
// import AddProductModal from "./AddProductModal";
// import api from "../../../serviceAuth/axios";

// export default function ProductPage() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isAddModalOpen, setIsAddModalOpen] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const rowsPerPage = 8;

//   const indexOfLastRow = currentPage * rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentProducts = products.slice(indexOfFirstRow, indexOfLastRow);

//   const totalPages = Math.ceil(products.length / rowsPerPage);

//   const [showExport, setShowExport] = useState(false);
//   const exportRef = useRef(null);

//   // Filter states
//   const [showFilter, setShowFilter] = useState(false);
//   const [department, setDepartment] = useState("All");
//   const [category, setCategory] = useState("All");
//   const [subCategory, setSubCategory] = useState("All");
//   const [brand, setBrand] = useState("All");
//   const [subBrand, setSubBrand] = useState("All");
//   const [hsn, setHsn] = useState("All");
//   const [purchaseTax, setPurchaseTax] = useState("GST");
//   const [salesTax, setSalesTax] = useState("GST");
//   const [fromMrp, setFromMrp] = useState("");
//   const [toMrp, setToMrp] = useState("");
//   const [searchTerm, setSearchTerm] = useState("");

//   // Fetch products on component mount
//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     setLoading(true);
//     try {
//       const response = await api.get('/product');
//       if (response.data.success) {
//         setProducts(response.data.products || []);
//       }
//     } catch (error) {
//       console.error('Error fetching products:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (exportRef.current && !exportRef.current.contains(event.target)) {
//         setShowExport(false);
//       }
//     }

//     function handleEsc(event) {
//       if (event.key === "Escape") {
//         setShowExport(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEsc);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, []);

//   const handleCreateProduct = async (formData) => {
//     try {
//       const response = await api.post('/product/products', formData, {
//         headers: {
//           'Content-Type': 'multipart/form-data'
//         }
//       });

//       if (response.data.success) {
//         await fetchProducts(); // Refresh the product list
//         setIsAddModalOpen(false);
//       }
//     } catch (error) {
//       console.error('Error creating product:', error);
//       throw error;
//     }
//   };

//   return (
//     <div className="p-6 min-h-screen">
//       {/* HEADER */}
//       <div className="flex justify-between items-center mb-6 bg-[#f5efdd] px-3 py-4 rounded-md">
//         <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
//           <ScanLine className="text-[#927f68]" />Product
//         </h2>

//         <button className="text-[#927f68] text-sm font-medium">
//           Setup Opening Stock
//         </button>
//       </div>

//       {/* ACTION BAR */}
//       <div className="bg-white rounded-xl shadow-sm p-4 mb-8 py-7">
//         <div className="flex flex-wrap justify-between gap-4">
//           {/* Left Buttons */}
//           <div className="flex gap-3">
//             <button className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm">
//               <Upload size={16} />
//               Import
//             </button>

//             <button className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm">
//               <FileEdit size={16} />
//               Update Bulk Products
//             </button>
//           </div>

//           {/* Right Controls */}
//           <div className="flex items-center gap-3 flex-wrap">
//             <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
//               <option>50</option>
//               <option>100</option>
//               <option>200</option>
//             </select>

//             <div className="relative" ref={exportRef}>
//               <button
//                 onClick={() => setShowExport((prev) => !prev)}
//                 className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
//               >
//                 <FileDown size={16} />
//               </button>

//               {showExport && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 animate-fadeIn">
//                   <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
//                     <FileSpreadsheet size={16} />
//                     Excel
//                   </button>
//                   <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
//                     <FileText size={16} />
//                     PDF
//                   </button>
//                   <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
//                     <FileText size={16} />
//                     All Data PDF
//                   </button>
//                   <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
//                     <FileSpreadsheet size={16} />
//                     All Data Excel
//                   </button>
//                 </div>
//               )}
//             </div>

//             <button
//               onClick={() => setShowFilter((prev) => !prev)}
//               className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
//             >
//               <Filter size={16} />
//               Filter
//             </button>

//             <div className="relative">
//               <Search
//                 size={16}
//                 className="absolute left-3 top-3 text-gray-400"
//               />
//               <input
//                 type="text"
//                 placeholder="Search List..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="pl-9 pr-4 py-2 border rounded-md text-sm w-52 focus:outline-none focus:border-gray-400"
//               />
//             </div>

//             <button
//               onClick={() => setIsAddModalOpen(true)}
//               className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
//             >
//               <Plus size={16} />
//               Create New
//             </button>
//           </div>
//         </div>

//         <div
//           className={`transition-all duration-300 ease-in-out overflow-hidden ${showFilter ? "max-h-[1000px] opacity-100 mt-6" : "max-h-0 opacity-0"
//             }`}
//         >
//           <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
//             <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
//               <CustomSelect
//                 label="Department"
//                 options={["All", "Cloth", "Other"]}
//                 value={department}
//                 onChange={setDepartment}
//               />

//               <CustomSelect
//                 label="Category"
//                 options={["All", "Bootcut Jeans", "Formal Pant", "Trousers"]}
//                 value={category}
//                 onChange={setCategory}
//               />

//               <CustomSelect
//                 label="Sub Category"
//                 options={["All", "Bootcut Jeans", "Formal Pant", "Trousers"]}
//                 value={subCategory}
//                 onChange={setSubCategory}
//               />

//               <CustomSelect
//                 label="Brand"
//                 options={["All", "Lionies", "Other"]}
//                 value={brand}
//                 onChange={setBrand}
//               />

//               <CustomSelect
//                 label="Sub Brand"
//                 options={["All", "Lionies", "Other"]}
//                 value={subBrand}
//                 onChange={setSubBrand}
//               />

//               <CustomSelect
//                 label="HSN"
//                 options={["All", "1234", "5678"]}
//                 value={hsn}
//                 onChange={setHsn}
//               />

//               <CustomSelect
//                 label="Purchase Tax"
//                 options={["GST", "GST 0"]}
//                 value={purchaseTax}
//                 onChange={setPurchaseTax}
//               />

//               <CustomSelect
//                 label="Sales Tax"
//                 options={["GST", "GST 0"]}
//                 value={salesTax}
//                 onChange={setSalesTax}
//               />

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   From MRP
//                 </label>
//                 <input
//                   type="number"
//                   value={fromMrp}
//                   onChange={(e) => setFromMrp(e.target.value)}
//                   placeholder="0"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   To MRP
//                 </label>
//                 <input
//                   type="number"
//                   value={toMrp}
//                   onChange={(e) => setToMrp(e.target.value)}
//                   placeholder="0"
//                   className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* PRODUCT TABLE */}
//         <div className="bg-white rounded-md shadow-sm overflow-hidden mt-5">
//           <table className="w-full text-sm text-left">
//             <thead className="bg-[#927f68] text-[#f5efdd] uppercase text-xs">
//               <tr>
//                 <th className="px-4 py-3">Sr No.</th>
//                 <th className="px-4 py-3">Item Code</th>
//                 <th className="px-4 py-3">Category</th>
//                 <th className="px-4 py-3">Brand</th>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">MRP</th>
//                 <th className="px-4 py-3">Selling Price</th>
//                 <th className="px-4 py-3">Qty</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="10" className="text-center py-8">
//                     Loading products...
//                   </td>
//                 </tr>
//               ) : currentProducts.length === 0 ? (
//                 <tr>
//                   <td colSpan="10" className="text-center py-8">
//                     No products found
//                   </td>
//                 </tr>
//               ) : (
//                 currentProducts.map((product, index) => (
//                   <tr
//                     key={product._id || index}
//                     className="border-t border-gray-200 hover:bg-gray-50 transition"
//                   >
//                     <td className="px-4 py-3">{indexOfFirstRow + index + 1}</td>
//                     <td className="px-4 py-3">{product._id?.slice(-6) || 'N/A'}</td>
//                     <td className="px-4 py-3 capitalize">{product.categoryId?.name || product.category || 'N/A'}</td>
//                     <td className="px-4 py-3">{product.brandId?.name || product.brand || 'N/A'}</td>
//                     <td className="px-4 py-3 text-blue-600 font-medium">
//                       {product.name}
//                     </td>
//                     <td className="px-4 py-3">₹{product.startingPrice?.toFixed(2) || '0.00'}</td>
//                     <td className="px-4 py-3">₹{product.startingPrice?.toFixed(2) || '0.00'}</td>
//                     <td className="px-4 py-3 font-medium">
//                       {product.hasVariants ? 'Variant' : '0'}
//                     </td>
//                     <td className="px-4 py-3">
//                       <span className={`px-3 py-1 rounded-full text-xs text-white ${product.status === 'active' || product.status === 'published'
//                           ? 'bg-green-600'
//                           : product.status === 'pending'
//                             ? 'bg-yellow-600'
//                             : 'bg-gray-600'
//                         }`}>
//                       {(product.status || 'active').toUpperCase()}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3">
//                       <button className="text-gray-500 hover:text-black">
//                         <MoreVertical size={18} />
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>

//           {/* Pagination */}
//           <div className="flex justify-between items-center px-4 py-3 border-t bg-white">
//             <button
//               onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//               disabled={currentPage === 1}
//               className="px-4 py-2 bg-[#f5efdd] text-[#927f68] rounded-md text-sm disabled:opacity-50"
//             >
//               Previous
//             </button>

//             <span className="text-sm">
//               Page {currentPage} of {totalPages || 1}
//             </span>

//             <button
//               onClick={() =>
//                 setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={currentPage === totalPages || totalPages === 0}
//               className="px-4 py-2 bg-[#f5efdd] text-[#927f68] rounded-md text-sm disabled:opacity-50"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Add Product Modal */}
//       {isAddModalOpen && (
//         <AddProductModal
//           onClose={() => setIsAddModalOpen(false)}
//           onSubmit={handleCreateProduct}
//         />
//       )}
//     </div>
//   );
// }

// pages/inventory/product/ProductPage.jsx
import { useState, useRef, useEffect } from "react";
import {
  Upload,
  FileEdit,
  Filter,
  Plus,
  Search,
  MoreVertical,
  FileDown,
  FileSpreadsheet,
  FileText,
  ScanLine,
  Layers,
  Eye,
  FileChartPieIcon,
} from "lucide-react";

import CustomSelect from "../../../components/CustomSelectdropdown";
import AddProductModal from "./AddProductModal";
import AddVariantModal from "./AddVariantModal";
import ViewVariantsModal from "./ViewVariantsModal";
import api from "../../../serviceAuth/axios";
import EditProductModal from "./product.edit.modal";

export default function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Variant modals state
  const [isAddVariantModalOpen, setIsAddVariantModalOpen] = useState(false);
  const [isViewVariantsModalOpen, setIsViewVariantsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProducts = products.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(products.length / rowsPerPage);

  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);

  // Filter states
  const [showFilter, setShowFilter] = useState(false);
  const [department, setDepartment] = useState("All");
  const [category, setCategory] = useState("All");
  const [subCategory, setSubCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [subBrand, setSubBrand] = useState("All");
  const [hsn, setHsn] = useState("All");
  const [purchaseTax, setPurchaseTax] = useState("GST");
  const [salesTax, setSalesTax] = useState("GST");
  const [fromMrp, setFromMrp] = useState("");
  const [toMrp, setToMrp] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await api.get("/product");
      if (response.data.success) {
        setProducts(response.data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExport(false);
      }
    }

    function handleEsc(event) {
      if (event.key === "Escape") {
        setShowExport(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleCreateProduct = async (formData) => {
    try {
      const response = await api.post("/product/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        await fetchProducts();
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  };

  // Variant handlers
  const handleAddVariant = (product) => {
    setSelectedProduct(product);
    setIsAddVariantModalOpen(true);
  };

  const handleViewVariants = (product) => {
    setSelectedProduct(product);
    setIsViewVariantsModalOpen(true);
  };

  const handleVariantAdded = () => {
    // Refresh products to update variant count if needed
    fetchProducts();
  };

  const handleVariantSubmit = async (formData) => {
    try {
      const response = await api.post(
        `/variant/admin/products/${selectedProduct._id}/variants`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      if (response.data.success) {
        handleVariantAdded();
        setIsAddVariantModalOpen(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      console.error("Error adding variant:", error);
      throw error;
    }
  };

  return (
    <>
      {editOpen && selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          onClose={() => {
            setEditOpen(false);
            setSelectedProduct(null);
          }}
          onSuccess={fetchProducts}
        />
      )}
      <div className="p-6 min-h-screen">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 bg-[#f5efdd] px-3 py-4 rounded-md">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <ScanLine className="text-[#927f68]" />
            Product
          </h2>

          <button className="text-[#927f68] text-sm font-medium">
            Setup Opening Stock
          </button>
        </div>

        {/* ACTION BAR */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-8 py-7">
          <div className="flex flex-wrap justify-between gap-4">
            {/* Left Buttons */}
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm">
                <Upload size={16} />
                Import
              </button>

              <button className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm">
                <FileEdit size={16} />
                Update Bulk Products
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm">
                <option>50</option>
                <option>100</option>
                <option>200</option>
              </select>

              <div className="relative" ref={exportRef}>
                <button
                  onClick={() => setShowExport((prev) => !prev)}
                  className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
                >
                  <FileDown size={16} />
                </button>

                {showExport && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 animate-fadeIn">
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
                      <FileSpreadsheet size={16} />
                      Excel
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
                      <FileText size={16} />
                      PDF
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
                      <FileText size={16} />
                      All Data PDF
                    </button>
                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-gray-100">
                      <FileSpreadsheet size={16} />
                      All Data Excel
                    </button>
                  </div>
                )}
              </div>

              <button
                onClick={() => setShowFilter((prev) => !prev)}
                className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
              >
                <Filter size={16} />
                Filter
              </button>

              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search List..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-2 border rounded-md text-sm w-52 focus:outline-none focus:border-gray-400"
                />
              </div>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
              >
                <Plus size={16} />
                Create New
              </button>
            </div>
          </div>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showFilter
                ? "max-h-[1000px] opacity-100 mt-6"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <CustomSelect
                  label="Department"
                  options={["All", "Cloth", "Other"]}
                  value={department}
                  onChange={setDepartment}
                />

                <CustomSelect
                  label="Category"
                  options={["All", "Bootcut Jeans", "Formal Pant", "Trousers"]}
                  value={category}
                  onChange={setCategory}
                />

                <CustomSelect
                  label="Sub Category"
                  options={["All", "Bootcut Jeans", "Formal Pant", "Trousers"]}
                  value={subCategory}
                  onChange={setSubCategory}
                />

                <CustomSelect
                  label="Brand"
                  options={["All", "Lionies", "Other"]}
                  value={brand}
                  onChange={setBrand}
                />

                <CustomSelect
                  label="Sub Brand"
                  options={["All", "Lionies", "Other"]}
                  value={subBrand}
                  onChange={setSubBrand}
                />

                <CustomSelect
                  label="HSN"
                  options={["All", "1234", "5678"]}
                  value={hsn}
                  onChange={setHsn}
                />

                <CustomSelect
                  label="Purchase Tax"
                  options={["GST", "GST 0"]}
                  value={purchaseTax}
                  onChange={setPurchaseTax}
                />

                <CustomSelect
                  label="Sales Tax"
                  options={["GST", "GST 0"]}
                  value={salesTax}
                  onChange={setSalesTax}
                />

                <div>
                  <label className="block text-sm font-medium mb-1">
                    From MRP
                  </label>
                  <input
                    type="number"
                    value={fromMrp}
                    onChange={(e) => setFromMrp(e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    To MRP
                  </label>
                  <input
                    type="number"
                    value={toMrp}
                    onChange={(e) => setToMrp(e.target.value)}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* PRODUCT TABLE */}
          <div className="bg-white rounded-md shadow-sm overflow-hidden mt-5">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#927f68] text-[#f5efdd] uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Sr No.</th>
                  <th className="px-4 py-3">Img</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Brand</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">MRP</th>
                  <th className="px-4 py-3">Selling Price</th>
                  <th className="px-4 py-3">Qty</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">
                      Loading products...
                    </td>
                  </tr>
                ) : currentProducts.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">
                      No products found
                    </td>
                  </tr>
                ) : (
                  currentProducts.map((product, index) => (
                    <tr
                      key={product._id || index}
                      className="border-t border-gray-200 hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3">
                        {indexOfFirstRow + index + 1}
                      </td>
                      <img
                        src={`${import.meta.env.VITE_BASE_URL}${product.productImage?.[0]}`}
                        className="h-12 w-12 object-cover rounded"
                      />
                      <td className="px-4 py-3 capitalize">
                        {product.categoryId?.name || product.category || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {product.brandId?.name || product.brand || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-blue-600 font-medium">
                        {product.name}
                      </td>
                      <td className="px-4 py-3">
                        ₹{product.startingPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3">
                        ₹{product.startingPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td className="px-4 py-3 font-medium">
                        {product.totalVariants}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs text-white ${
                            product.status === "active" ||
                            product.status === "published"
                              ? "bg-green-600"
                              : product.status === "pending"
                                ? "bg-yellow-600"
                                : "bg-gray-600"
                          }`}
                        >
                          {(product.status || "active").toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedProduct(product);
                              setEditOpen(true);
                            }}
                            className="text-indigo-600"
                          >
                            <FileChartPieIcon />
                          </button>
                          <button
                            onClick={() => handleAddVariant(product)}
                            className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-50"
                            title="Add Variant"
                          >
                            <Layers size={18} />
                          </button>
                          <button
                            onClick={() => handleViewVariants(product)}
                            className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50"
                            title="View Variants"
                          >
                            <Eye size={18} />
                          </button>
                          {/* <button className="text-gray-500 hover:text-black p-1 rounded hover:bg-gray-50">
                          <MoreVertical size={18} />
                        </button> */}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t bg-white">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-[#f5efdd] text-[#927f68] rounded-md text-sm disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-4 py-2 bg-[#f5efdd] text-[#927f68] rounded-md text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Add Product Modal */}
        {isAddModalOpen && (
          <AddProductModal
            onClose={() => setIsAddModalOpen(false)}
            onSubmit={handleCreateProduct}
          />
        )}

        {/* Add Variant Modal */}
        {isAddVariantModalOpen && selectedProduct && (
          <AddVariantModal
            product={selectedProduct}
            onClose={() => {
              setIsAddVariantModalOpen(false);
              setSelectedProduct(null);
            }}
            onSubmit={handleVariantSubmit}
          />
        )}

        {/* View Variants Modal */}
        {isViewVariantsModalOpen && selectedProduct && (
          <ViewVariantsModal
            product={selectedProduct}
            onClose={() => {
              setIsViewVariantsModalOpen(false);
              setSelectedProduct(null);
            }}
          />
        )}
      </div>
    </>
  );
}
