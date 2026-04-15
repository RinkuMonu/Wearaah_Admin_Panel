import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import api from "../../../serviceAuth/axios";
import CategoryModal from "./CategoryModal";
import { debounce } from "lodash";

export default function CategoryTable() {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const [data, setData] = useState([]);
  console.log(data)
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async (search = "") => {
    try {
      setLoading(true);

      const res = await api.get("/category", {
        params: { search },
      });

      setData(res.data.categories || []);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch categories",
        timer: 2000,
        showConfirmButton: false,
      });
    } finally {
      setLoading(false);
    }
  };
  const debouncedSearch = useMemo(
    () =>
      debounce((value) => {
        fetchData(value);
      }, 500),
    [],
  );

  useEffect(() => {
    fetchData();
  }, []);

  const deleteCategory = async (id, name) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete "${name}". This action cannot be undone!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      background: "#ffffff",
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `,
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/category/${id}`);
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Category has been deleted successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
      fetchData();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to delete category",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">Categories</h2>
          <span className="px-2 py-1 text-xs font-medium bg-[#f5efdd] text-[#927f68] rounded-full">
            {data.length} Total
          </span>
        </div>

        <button
          onClick={() => {
            setOpen(true);
            setEditData(null);
          }}
          className="px-4 py-2 bg-[#927f68] text-[#f5efdd] hover:bg-white hover:text-[#927f68] rounded-md transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Category
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <svg
          className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => {
            const value = e.target.value;
            setSearchTerm(value);
            debouncedSearch(value);
          }}
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#927f68] focus:border-transparent transition-all"
        />
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-500">Loading categories...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              No categories found
            </h3>
            <p className="mt-1 text-gray-500">
              Get started by creating a new category.
            </p>
            <button
              onClick={() => {
                setOpen(true);
                setEditData(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Category
            </button>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#927f68]  border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#f5efdd] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l5 5a2 2 0 01.586 1.414V19a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z"
                      />
                    </svg>
                    Category Name
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#f5efdd] uppercase tracking-wider">
                  <div className="flex items-center gap-2">Description</div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#f5efdd] uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Created
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-[#f5efdd] uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6 py-4 text-left text-xs font-medium text-[#f5efdd] uppercase tracking-wider">
                  Banner
                </th> */}
                <th className="px-6 py-4 text-start text-xs font-medium text-[#f5efdd] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8  rounded-lg flex items-center justify-center  font-semibold  shadow-sm">
                        <img
                          src={`${BASE_URL}${item.smallimage}`}
                          className="w-10 h-10"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-[#f1c84f] mt-0.5">
                          DisplayOrder {item.displayOrder}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {item.description || ""}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })
                        : "N/A"}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleTimeString()
                        : ""}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs font-medium  ${item.isActive ? " bg-green-200" : "bg-gray-200"} ${item.isActive ? " text-green-600" : "text-gray-700"} rounded-full`}
                    >
                      {item.isActive ? "Active" : "inactive"}
                    </span>
                  </td>
                  {/* <td className="px-6 py-4">
                    <div className="w-full h-full rounded-lg flex ">
                      <img
                        src={`${BASE_URL}${item.bannerimage}`}
                        className="w-50 h-22"
                      />
                    </div>
                  </td> */}
                  <td className="px-6 py-4">
                    <div className="flex items-center  gap-2">
                      <button
                        onClick={() => {
                          setEditData(item);
                          setOpen(true);
                        }}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit category"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => deleteCategory(item._id, item.name)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Delete category"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {!loading && data.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {data.length} of {data.length} categories
          </p>
          <div className="flex items-center gap-2">
            <button
              className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled
            >
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}

      {open && (
        <CategoryModal
          editData={editData}
          onClose={() => {
            setOpen(false);
            setEditData(null);
          }}
          refresh={fetchData}
        />
      )}
    </div>
  );
}
