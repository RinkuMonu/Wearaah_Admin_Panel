import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../serviceAuth/axios";

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
        categoryId: editData.categoryId?._id || "",
        sizeType: editData.sizeType || "alpha",
      });

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
  /* ---------------- VARIANT ATTRIBUTES ---------------- */

  // const addVariantAttribute = () => {
  //   const value = variantInput.trim().toLowerCase();

  //   if (!value) return;

  //   if (variantAttributes.includes(value)) {
  //     return Swal.fire({
  //       icon: "info",
  //       title: "Duplicate",
  //       text: "Variant attribute already added",
  //       timer: 1200,
  //       showConfirmButton: false,
  //     });
  //   }

  //   setVariantAttributes([...variantAttributes, value]);
  //   setVariantInput("");
  // };

  /* ---------------- ATTRIBUTES BUILDER ---------------- */

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
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* NAME */}
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
          <div
            key={i}
            className="grid grid-cols-2 gap-2 relative border p-3 rounded-xl"
          >
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
            <label className="flex items-center gap-2 text-sm">
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
              className="absolute -top-2 -right-2 text-red-500 text-xs"
            >
              ✕
            </button>
          </div>
        ))}

        <button type="button" onClick={addAttribute} className="btn mt-2">
          + Add Attribute
        </button>
      </div>

      {/* IMAGES */}
      {images.smallimagePreview && (
        <img
          src={`${import.meta.env.VITE_BASE_URL}${images.smallimagePreview}`}
          className="h-20 mb-2 rounded"
        />
      )}

      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImages({ ...images, smallimage: e.target.files[0] })
        }
      />
      {images.smallimagePreview && (
        <img
          src={`${import.meta.env.VITE_BASE_URL}${images.smallimagePreview}`}
          className="h-20 mb-2 rounded"
        />
      )}
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
          setImages({ ...images, bannerimage: e.target.files[0] })
        }
      />

      {/* SUBMIT */}

      <button
        disabled={loading}
        className="btn-primary-subCategory w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Creating..." : "Create SubCategory"}
      </button>
    </form>
  );
};
