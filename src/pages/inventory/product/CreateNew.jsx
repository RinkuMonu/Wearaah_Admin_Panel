import { useState } from "react";
import SearchableSelect from "./../../../components/SearchableSelect";

export default function NewProductPage() {
  // ---------------- STATE ----------------
  const [form, setForm] = useState({
    itemCode: "",
    productName: "",
    printName: "",
    department: "",
    category: "",
    subCategory: "",
    brand: "",
    subBrand: "",
    hsn: "",
    purchaseTax: "",
    salesTax: "",
    articleNo: "",
    uom: "PIECES",
    fromMrp: "",
    toMrp: "",
  });

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data:", form);
  };

  // ---------------- OPTIONS ----------------
  const departments = ["Cloth", "Footwear", "Accessories"];
  const categories = ["Bootcut Jeans", "Formal Pant", "Trousers"];
  const brands = ["Lionies", "Nike", "Adidas"];
  const taxes = ["GST 5%", "GST 12%", "GST 18%"];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6 border-b pb-3">
          New Product
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">

            {/* Item Code */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Item Code *
              </label>
              <input
                type="text"
                value={form.itemCode}
                onChange={(e) =>
                  handleChange("itemCode", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Product Name *
              </label>
              <input
                type="text"
                value={form.productName}
                onChange={(e) =>
                  handleChange("productName", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Print Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Print Name *
              </label>
              <input
                type="text"
                value={form.printName}
                onChange={(e) =>
                  handleChange("printName", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Department */}
            <SearchableSelect
              label="Department *"
              options={departments}
              value={form.department}
              onChange={(val) => handleChange("department", val)}
            />

            {/* Category */}
            <SearchableSelect
              label="Category *"
              options={categories}
              value={form.category}
              onChange={(val) => handleChange("category", val)}
            />

            {/* Brand */}
            <SearchableSelect
              label="Brand *"
              options={brands}
              value={form.brand}
              onChange={(val) => handleChange("brand", val)}
            />

            {/* HSN */}
            <div>
              <label className="block text-sm font-medium mb-1">
                HSN Code
              </label>
              <input
                type="text"
                value={form.hsn}
                onChange={(e) =>
                  handleChange("hsn", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* Purchase Tax */}
            <SearchableSelect
              label="Purchase Tax *"
              options={taxes}
              value={form.purchaseTax}
              onChange={(val) =>
                handleChange("purchaseTax", val)
              }
            />

            {/* Sales Tax */}
            <SearchableSelect
              label="Sales Tax *"
              options={taxes}
              value={form.salesTax}
              onChange={(val) =>
                handleChange("salesTax", val)
              }
            />

            {/* Article No */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Article No.
              </label>
              <input
                type="text"
                value={form.articleNo}
                onChange={(e) =>
                  handleChange("articleNo", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* UOM */}
            <SearchableSelect
              label="Select UOM *"
              options={["PIECES", "BOX", "KG"]}
              value={form.uom}
              onChange={(val) => handleChange("uom", val)}
            />

            {/* From MRP */}
            <div>
              <label className="block text-sm font-medium mb-1">
                From MRP
              </label>
              <input
                type="number"
                value={form.fromMrp}
                onChange={(e) =>
                  handleChange("fromMrp", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>

            {/* To MRP */}
            <div>
              <label className="block text-sm font-medium mb-1">
                To MRP
              </label>
              <input
                type="number"
                value={form.toMrp}
                onChange={(e) =>
                  handleChange("toMrp", e.target.value)
                }
                className="w-full border rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-6">
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows="4"
              className="w-full border rounded-md px-3 py-2 text-sm"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md text-sm hover:bg-blue-700"
            >
              Save Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}