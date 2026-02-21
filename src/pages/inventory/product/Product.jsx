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
  FileText
} from "lucide-react";
import { Link } from "lucide-react";

import CustomSelect from "../../../components/CustomSelectDropdown";

export default function ProductPage() {

  const products = [
    {
      id: 1,
      code: "LS1051",
      category: "t-shirt",
      brand: "LIONIES",
      name: "T-shirt for simple",
      mrp: 599,
      price: 599,
      qty: -1,
    },
    {
      id: 2,
      code: "LS1046",
      category: "shirt",
      brand: "LIONIES",
      name: "Half Shirt",
      mrp: 3149,
      price: 3149,
      qty: 1,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },

    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },
    {
      id: 3,
      code: "LS1036",
      category: "lower",
      brand: "LIONIES",
      name: "Naylon Tery Cargo",
      mrp: 1299,
      price: 1299,
      qty: 17,
    },


  ];

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 8;

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentProducts = products.slice(indexOfFirstRow, indexOfLastRow);

  const totalPages = Math.ceil(products.length / rowsPerPage);


  const [showExport, setShowExport] = useState(false);
  const exportRef = useRef(null);




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

  return (
    <div className="p-6 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-[#f5efdd] p-3 rounded-md">
        <h2 className="text-xl font-semibold">Product</h2>

        <button className="text-[#927f68] text-sm font-medium">
          Setup Opening Stock
        </button>
      </div>

      {/* ACTION BAR */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-8 py-7">
        <div className="flex flex-wrap justify-between gap-4">
          {/* Left Buttons */}
          <div className="flex gap-3">
            <button className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68]  px-4 py-2 rounded-md text-sm">
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

            {/* <button className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68]  px-4 py-2 rounded-md text-sm">
              <Filter size={16} />
              Filter
            </button> */}

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search List..."
                className="pl-9 pr-4 py-2 border rounded-md text-sm w-52"
              />
            </div>

            <Link to="/createnew" className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm">
              <Plus size={16} />
              Create New
            </Link>
          </div>
        </div>

        {/* FILTER SECTION */}
        <div className="my-10 md:my-13">
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
            {/* From MRP */}
            <div>
              <label className="block text-sm font-medium mb-1">
                From MRP
              </label>
              <input
                type="number"
                value={fromMrp}
                onChange={(e) => setFromMrp(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>

            {/* To MRP */}
            <div>
              <label className="block text-sm font-medium mb-1">
                To MRP
              </label>
              <input
                type="number"
                value={toMrp}
                onChange={(e) => setToMrp(e.target.value)}
                placeholder="0"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
            </div>
          </div>
        </div>



        {/* PRODUCT TABLE */}
        <div className="bg-white rounded-md shadow-sm overflow-hidden mt-5">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#927f68] text-[#f5efdd] uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Sr No.</th>
                <th className="px-4 py-3">Item Code</th>
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
              {currentProducts.map((product, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    {indexOfFirstRow + index + 1}
                  </td>
                  <td className="px-4 py-3">{product.code}</td>
                  <td className="px-4 py-3 capitalize">
                    {product.category}
                  </td>
                  <td className="px-4 py-3">
                    {product.brand}
                  </td>
                  <td className="px-4 py-3 text-blue-600 font-medium">
                    {product.name}
                  </td>
                  <td className="px-4 py-3">
                    ₹{product.mrp.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    ₹{product.price.toFixed(2)}
                  </td>
                  <td
                    className={`px-4 py-3 font-medium ${product.qty < 0
                      ? "text-red-600"
                      : "text-gray-800"
                      }`}
                  >
                    {product.qty.toFixed(2)}
                  </td>
                  <td className="px-4 py-3">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs">
                      ACTIVE
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-gray-500 hover:text-black">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
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
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-[#f5efdd] text-[#927f68] rounded-md text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}