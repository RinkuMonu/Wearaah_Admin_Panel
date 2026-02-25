import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import api from "../../../serviceAuth/axios";

export default function DynamicSpecificationsEdit({
  subCategoryId,
  initialSpecs = {},
  onChange,
}) {
  const [attributes, setAttributes] = useState({});
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(false);

  /* 🔹 FETCH SUBCATEGORY ATTRIBUTES */
  useEffect(() => {
    if (!subCategoryId) return;

    const fetchAttributes = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/subcategory/${subCategoryId}`);

        if (res.data.success) {
          const attrs = res.data.category.attributes || {};
          setAttributes(attrs);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [subCategoryId]);

  /* 🔹 BUILD AUTO FILLED SPECS */
useEffect(() => {
  if (!Object.keys(attributes).length) return;

  const specList = [];

  Object.entries(attributes).forEach(([key, config]) => {
    specList.push({
      id: Date.now() + Math.random(),
      key,
      value: initialSpecs[key] || "",
      required: config.required,
      options: config.values || [],
    });
  });

  setSpecifications(specList);
}, [attributes]);

  /* 🔹 SEND DATA TO PARENT */
  useEffect(() => {
    const obj = {};

    specifications.forEach((s) => {
      if (s.value) obj[s.key] = s.value;
    });

    onChange(obj);
  }, [specifications]);

  /* 🔹 HANDLERS */

  const updateValue = (id, value) => {
    setSpecifications((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value } : s)),
    );
  };

  const addSpecification = () => {
    const existing = specifications.map((s) => s.key);

    const available = Object.keys(attributes).find(
      (key) => !existing.includes(key),
    );

    if (!available) return;

    const attr = attributes[available];

    setSpecifications((prev) => [
      ...prev,
      {
        id: Date.now(),
        key: available,
        value: "",
        required: attr.required,
        options: attr.values || [],
      },
    ]);
  };

  const removeSpecification = (id) => {
    setSpecifications((prev) => prev.filter((s) => s.id !== id));
  };

  /* 🔹 UI */

  if (!subCategoryId)
    return <p className="text-sm text-gray-500">Select subcategory first</p>;

  if (loading)
    return <p className="text-sm text-gray-500">Loading specifications...</p>;

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <label className="text-sm font-medium">Product Specifications</label>

        <button
          type="button"
          onClick={addSpecification}
          className="flex items-center gap-1 text-sm text-[#927f68]"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {specifications.map((spec) => (
        <div key={spec.id} className="flex gap-3 items-start">
          <div className="flex-1">
            <p className="text-sm mb-1 capitalize">{spec.key}</p>

            <select
              value={spec.value}
              required={spec.required}
              onChange={(e) => updateValue(spec.id, e.target.value)}
              className="w-full border px-3 py-2 rounded-md text-sm"
            >
              <option value="">Select {spec.key}</option>

              {spec.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {!spec.required && (
            <button
              type="button"
              onClick={() => removeSpecification(spec.id)}
              className="mt-6 text-red-500"
            >
              <X size={18} />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
