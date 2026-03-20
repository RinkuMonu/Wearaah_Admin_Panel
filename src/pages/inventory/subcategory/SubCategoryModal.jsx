import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../serviceAuth/axios";
import { Trash } from "lucide-react";

export const SubCategoryModal = ({ onSuccess, editData }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    sizeType: "alpha",
  });

  const [variantAttributes, setVariantAttributes] = useState([]);
  console.log(variantAttributes);
  const [variantInput, setVariantInput] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [showOnHome, setShowOnHome] = useState(false);

  const [attributes, setAttributes] = useState([]);
  const [images, setImages] = useState({});

  /* ---------------- FETCH CATEGORIES ---------------- */

  const fetchCategories = async () => {
    const { data } = await api.get("/category");
    setCategories(data.categories || []);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (editData) {
      setForm({
        name: editData.name || "",
        categoryId:
        typeof editData.categoryId === "object"
          ? editData.categoryId._id
          : editData.categoryId || "",
        sizeType: editData.sizeType || "alpha",
      });
      setDisplayOrder(editData.displayOrder || 0); // ✅ add
      setShowOnHome(editData.showOnHome || false); // ✅ add
      // ✅ VARIANT ATTRIBUTES
      setVariantAttributes(editData.variantAttributes || []);

      // ✅ ATTRIBUTES
      if (editData.attributes) {
        const formatted = Object.entries(editData.attributes).map(
          ([key, value]) => ({
            key,
            values: value.values.join(", "),
            required: value.required || false,
            filterable: value.filterable || false,
          }),
        );

        setAttributes(formatted);
      }

      // ✅ IMAGES PREVIEW
      setImages({
        smallimagePreview: editData.smallimage || null,
        bannerimagePreview: editData.bannerimage || null,
      });
    }
  }, [editData]);

  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { key: "", values: "", required: false, filterable: false },
    ]);
  };

  const handleAttributeChange = (index, field, value) => {
    const updated = [...attributes];
    updated[index][field] = value;
    setAttributes(updated);
  };

  /* ---------------- SUBMIT ---------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      // if (variantAttributes.length === 0) {
      //   return Swal.fire("Add at least one variant attribute");
      // }
      formData.append("name", form.name);
      formData.append("categoryId", form.categoryId);
      formData.append("sizeType", form.sizeType);
      formData.append("displayOrder", displayOrder);
      formData.append("showOnHome", showOnHome);
      /* VARIANT ATTRIBUTES */
      formData.append("variantAttributes", JSON.stringify(variantAttributes));

      /* ATTRIBUTES JSON */
      const formattedAttributes = {};

      attributes.forEach((attr) => {
        if (!attr.key) return;

        formattedAttributes[attr.key] = {
          values: attr.values
            .split(",")
            .map((v) => v.trim())
            .filter(Boolean),
          required: attr.required,
          filterable: attr.filterable,
        };
      });

      formData.append("attributes", JSON.stringify(formattedAttributes));
      /* IMAGES */
      if (images.smallimage) {
        formData.append("smallimage", images.smallimage);
      }

      if (images.bannerimage) {
        formData.append("bannerimage", images.bannerimage);
      }

      if (editData) {
        await api.put(`/subcategory/${editData._id}`, formData);
      } else {
        await api.post("/subcategory", formData);
      }

      Swal.fire({
        icon: "success",
        title: "Success",
        text: editData ? "SubCategory updated" : "SubCategory created",
        timer: 1500,
        showConfirmButton: false,
      });

      setForm({ name: "", categoryId: "", sizeType: "alpha" });
      setVariantAttributes([]);
      setAttributes([]);
      setImages({});

      onSuccess?.();
    } catch (err) {
      Swal.fire({
        icon: "warning",
        title: "info",
        text: err.response?.data?.message || "Something went wrong",
        timer: 1500,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <form onSubmit={handleSubmit} className="space-y-5 ">
      {/* NAME */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="SubCategory Name"
          className="input-subCategory"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        {/* CATEGORY */}
        <select
          className="input-subCategory"
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* SIZE TYPE */}
        <select
          className="input-subCategory"
          value={form.sizeType}
          onChange={(e) => setForm({ ...form, sizeType: e.target.value })}
        >
          <option value="alpha">Alpha</option>
          <option value="numeric">Numeric</option>
          <option value="free">Free</option>
        </select>
      </div>

      <div className="space-y-2 flex justify-between px-2">
        <div className="">
          <label className="block text-sm font-semibold text-gray-700">
            Display Order
          </label>
          <input
            type="text"
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-[#927f68] focus:border-[#927f68] transition-all `}
            placeholder="0"
            value={displayOrder}
            onChange={(e) => {
              setDisplayOrder(parseInt(e.target.value) || 0);
              if (errors.displayOrder)
                setErrors({ ...errors, displayOrder: null });
            }}
            min="0"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <p className="font-semibold text-gray-700">Show on Homepage</p>
              <p className="text-sm text-gray-500">
                Display this category on the homepage
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={showOnHome}
                onChange={() => setShowOnHome(!showOnHome)}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* VARIANT ATTRIBUTES */}
      <div>
        {/* <h3 className="font-semibold">Variant Attributes</h3>

        <div className="flex gap-2">
          <input
            className="input-subCategory"
            placeholder="size / color"
            value={variantInput}
            onChange={(e) => setVariantInput(e.target.value)}
          />
          <button
            type="button"
            onClick={addVariantAttribute}
            className="btn-subCategory"
          >
            Add
          </button>
        </div> */}

        <div className="flex gap-2 mt-2 flex-wrap">
          {variantAttributes.map((v, i) => (
            <span key={i} className="badge-subCategory flex items-center gap-2">
              {v}
              <button
                type="button"
                onClick={() =>
                  setVariantAttributes(
                    variantAttributes.filter((_, index) => index !== i),
                  )
                }
                className="text-red-500 text-xs"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* ATTRIBUTES */}
      <div>
        <h3 className="font-semibold">Specifications</h3>

        {attributes.map((attr, i) => (
          <div key={i} className="grid grid-cols-2 gap-2 relative my-3">
            <input
              placeholder="Key (fabric)"
              className="input-subCategory"
              value={attr.key}
              onChange={(e) => handleAttributeChange(i, "key", e.target.value)}
            />

            <input
              placeholder="Values comma separated"
              className="input-subCategory"
              value={attr.values}
              onChange={(e) =>
                handleAttributeChange(i, "values", e.target.value)
              }
            />

            {/* REQUIRED */}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={attr.required}
                onChange={(e) =>
                  handleAttributeChange(i, "required", e.target.checked)
                }
              />
              Required
            </label>

            {/* FILTERABLE */}
            <label className="flex items-center  gap-2 text-sm">
              <input
                type="checkbox"
                checked={attr.filterable}
                onChange={(e) =>
                  handleAttributeChange(i, "filterable", e.target.checked)
                }
              />
              Filterable
            </label>

            <button
              type="button"
              onClick={() =>
                setAttributes(attributes.filter((_, index) => index !== i))
              }
              className="absolute top-13 right-2 col-span-2 text-red-500 text-xs"
            >
              <Trash className="w-5 h-5" />
            </button>
          </div>
        ))}

        <button type="button" onClick={addAttribute} className="btn mt-2">
          + Add Attribute
        </button>
      </div>

      {/* IMAGES */}
      <div className="flex items-center gap-4">
        {/* File Input */}
        <input
          type="file"
          className="bg-gray-100 p-2 rounded-md"
          accept="image/*"
          onChange={(e) =>
            setImages({
              ...images,
              smallimage: e.target.files[0],
              smallimagePreview: URL.createObjectURL(e.target.files[0]),
            })
          }
        />

        {/* Preview (for new or existing image) */}
        {(images.smallimagePreview || images.smallimage) && (
          <img
            src={
              images.smallimage
                ? URL.createObjectURL(images.smallimage)
                : `${import.meta.env.VITE_BASE_URL}${images.smallimagePreview}`
            }
            className="h-20 w-20 object-cover rounded border border-gray-200"
          />
        )}
      </div>
      {/* <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImages({ ...images, bannerimage: e.target.files[0] })
        }
      /> */}

      {/* SUBMIT */}

      <button
        disabled={loading}
        className="bg-[#927f68] text-[#fdefdd] rounded-lg hover:bg-[#927f68]/80 py-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create SubCategory"}
      </button>
    </form>
  );
};
