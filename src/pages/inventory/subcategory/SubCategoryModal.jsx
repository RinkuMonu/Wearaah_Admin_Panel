import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../serviceAuth/axios";

export const SubCategoryModal = ({ onClose, refresh, editData }) => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    sizeType: "alpha",
  });

  const [attributes, setAttributes] = useState([]);
  const [variantAttributes, setVariantAttributes] = useState([]);
  const [smallimage, setSmallImage] = useState(null);
  const [bannerimage, setBannerImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📦 Fetch parent categories
  useEffect(() => {
    api.get("/category").then((res) => setCategories(res.data.categories));
  }, []);

  // ✏️ Edit mode
  useEffect(() => {
    if (editData) {
      setForm(editData);
      setAttributes(
        Object.entries(editData.attributes || {}).map(([k, v]) => ({
          name: k,
          values: v.values.join(","),
          required: v.required,
          filterable: v.filterable,
        })),
      );
      setVariantAttributes(editData.variantAttributes || []);
    }
  }, [editData]);

  // ➕ Add attribute row
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { name: "", values: "", required: false, filterable: false },
    ]);
  };

  // ❌ Remove attribute
  const removeAttribute = (index) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  // 💾 Submit
  const handleSubmit = async () => {
    try {
      setLoading(true);

      const attrObj = {};
      attributes.forEach((attr) => {
        attrObj[attr.name] = {
          values: attr.values.split(","),
          required: attr.required,
          filterable: attr.filterable,
        };
      });

      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("categoryId", form.categoryId);
      fd.append("sizeType", form.sizeType);
      fd.append("attributes", JSON.stringify(attrObj));
      fd.append("variantAttributes", JSON.stringify(variantAttributes));

      if (smallimage) fd.append("smallimage", smallimage);
      if (bannerimage) fd.append("bannerimage", bannerimage);

      if (editData) {
        await api.put(`/subcategory/${editData._id}`, fd);
      } else {
        await api.post("/subcategory", fd);
      }

      Swal.fire("Success", "Saved successfully", "success");
      refresh();
      onClose();
    } catch {
      Swal.fire("Error", "Failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-[900px] max-h-[90vh] overflow-y-auto rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-bold">
          {editData ? "Edit" : "Create"} SubCategory
        </h2>

        {/* NAME */}
        <input
          placeholder="Subcategory name"
          className="input"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        {/* PARENT CATEGORY */}
        <select
          className="input"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* SIZE TYPE */}
        <select
          className="input"
          value={form.sizeType}
          onChange={(e) => setForm({ ...form, sizeType: e.target.value })}
        >
          <option value="alpha">Alpha (S,M,L)</option>
          <option value="numeric">Numeric (28,30)</option>
          <option value="free">Free Size</option>
        </select>

        {/* ATTRIBUTES */}
        <div>
          <h3 className="font-semibold mb-2">Attributes</h3>

          {attributes.map((attr, i) => (
            <div key={i} className="grid grid-cols-4 gap-2 mb-2">
              <input
                placeholder="Name"
                value={attr.name}
                onChange={(e) => {
                  const updated = [...attributes];
                  updated[i].name = e.target.value;
                  setAttributes(updated);
                }}
                className="input"
              />

              <input
                placeholder="Values (comma separated)"
                value={attr.values}
                onChange={(e) => {
                  const updated = [...attributes];
                  updated[i].values = e.target.value;
                  setAttributes(updated);
                }}
                className="input"
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={attr.required}
                  onChange={(e) => {
                    const updated = [...attributes];
                    updated[i].required = e.target.checked;
                    setAttributes(updated);
                  }}
                />
                Required
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={attr.filterable}
                  onChange={(e) => {
                    const updated = [...attributes];
                    updated[i].filterable = e.target.checked;
                    setAttributes(updated);
                  }}
                />
                Filterable
              </label>

              <button onClick={() => removeAttribute(i)}>❌</button>
            </div>
          ))}

          <button onClick={addAttribute} className="btn">
            + Add Attribute
          </button>
        </div>

        {/* VARIANT ATTRIBUTES */}
        <div>
          <h3 className="font-semibold">Variant Attributes</h3>
          {["color", "size"].map((v) => (
            <label key={v} className="mr-4">
              <input
                type="checkbox"
                checked={variantAttributes.includes(v)}
                onChange={() =>
                  setVariantAttributes((prev) =>
                    prev.includes(v)
                      ? prev.filter((i) => i !== v)
                      : [...prev, v],
                  )
                }
              />
              {v}
            </label>
          ))}
        </div>

        {/* IMAGES */}
        <input type="file" onChange={(e) => setSmallImage(e.target.files[0])} />
        <input
          type="file"
          onChange={(e) => setBannerImage(e.target.files[0])}
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};
