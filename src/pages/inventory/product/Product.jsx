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
import { debounce } from "lodash";
import { useMemo } from "react";

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

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    try {
      const [catRes, brandRes] = await Promise.all([
        api.get("/category/nameonly"),
        api.get("/brand/nameonly"),
      ]);

      setCategories(catRes.data.categories || []);
      // setSubCategories(subRes.data.categories || []);
      setBrands(brandRes.data?.data || []);
    } catch (err) {
      console.error("Filter data error", err);
    }
  };

  // Fetch products on component mount
  const fetchProducts = async (searchValue = searchTerm) => {
    setLoading(true);

    try {
      const params = {
        page: currentPage,
        limit: rowsPerPage,
      };
      console.log(params);

      if (searchValue) params.search = searchValue;
      if (category !== "All") params.category = category;
      if (subCategory !== "All") params.subCategory = subCategory;
      if (brand !== "All") params.brand = brand;

      if (fromMrp) params.minPrice = fromMrp;
      if (toMrp) params.maxPrice = toMrp;

      const response = await api.get("/product", { params });

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
    fetchProducts();
  }, [category, subCategory, brand, fromMrp, toMrp, currentPage]);

  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        setCurrentPage(1);
        fetchProducts(value);
      }, 500),
    [],
  );

  useEffect(() => {
    function handleEsc(event) {
      if (event.key === "Escape") {
        setShowExport(false);
      }
    }

    document.addEventListener("keydown", handleEsc);

    return () => {
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
  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, []);
  return (
    <>
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

            <div className="relative  justify-center items-center gap-1">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-8 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search List..."
                    value={searchTerm}
                    onChange={(e) => {
                      const value = e.target.value;
                      setSearchTerm(value);
                      debouncedSearch(value);
                    }}
                    className="pl-9 pr-4 mt-6 py-2 border rounded-md text-sm w-72 focus:outline-none focus:border-gray-400"
                  />
                </div>
                <CustomSelect
                  label="Category"
                  options={[
                    { label: "All", value: "All" },
                    ...categories.map((c) => ({
                      label: c.name,
                      value: c._id,
                    })),
                  ]}
                  value={category}
                  onChange={setCategory}
                />

                <CustomSelect
                  label="Brand"
                  options={[
                    { label: "All", value: "All" },
                    ...brands.map((b) => ({
                      label: b.name,
                      value: b._id,
                    })),
                  ]}
                  value={brand}
                  onChange={setBrand}
                />
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center mt-5 gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
                  >
                    <Plus size={16} />
                    Create New
                  </button>
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
                  <th className="px-4 py-3">Starting Price</th>
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
                        ₹{product.mrp?.toFixed(2) || "0.00"}
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
                            className="text-gray-600 hover:text-purple-600 hover:bg-purple-100 p-1 rounded-md"
                          >
                            <FileChartPieIcon size={18} />
                          </button>
                          <button
                            onClick={() => handleAddVariant(product)}
                            className="text-gray-600 hover:text-blue-600 p-1 rounded hover:bg-blue-100"
                            title="Add Variant"
                          >
                            <Layers size={18} />
                          </button>
                          <button
                            onClick={() => handleViewVariants(product)}
                            className="text-gray-600 hover:text-green-600 p-1 rounded hover:bg-green-100"
                            title="View Variants"
                          >
                            <Eye size={18} />
                          </button>
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

        {/* edit product */}
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
