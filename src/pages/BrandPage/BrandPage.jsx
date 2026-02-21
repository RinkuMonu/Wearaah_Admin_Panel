import { useEffect, useState } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import CreateBrandModal from "./CreateBrandModal";
import EditBrandModal from "./EditBrandModal";

export default function BrandPage() {
  const [brands, setBrands] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const totalPages = Math.ceil(total / limit);
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // ✅ API CALL
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/brand?page=${page}&limit=${limit}&search=${search}`,
      );
      setBrands(res.data.data);
      setTotal(res.data.total);
    } catch {
      Swal.fire("Error", "Failed to fetch brands", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, [page, limit, debouncedSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleEdit = (brand) => {
    setSelectedBrand(brand);
    setShowEditModal(true);
  };

  const handleCloseModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setSelectedBrand(null);
  };

  return (
    <div className="p-6 overflow-hidden">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <div className="flex gap-4">
          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search brand..."
            className="border px-3 py-2 rounded-lg w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* CREATE BUTTON */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Create Brand
          </button>
        </div>

        {/* LIMIT */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border px-3 py-2 rounded-lg cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-scroll">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Logo</th>
              <th className="p-3">Brand</th>
              <th className="p-3">Tagline</th>
              <th className="p-3">GST</th>
              <th className="p-3">Support</th>
              <th className="p-3">Website</th>
              <th className="p-3">Type</th>
              <th className="p-3">Country</th>
              <th className="p-3">Status</th>
              <th className="p-3">Created</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="10" className="text-center py-6">
                  Loading...
                </td>
              </tr>
            ) : brands.length === 0 ? (
              <tr>
                <td colSpan="10" className="text-center py-6">
                  No Data Found
                </td>
              </tr>
            ) : (
              brands.map((b) => (
                <tr key={b._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={`${BASE_URL}/${b.logo}`}
                      alt={b.name}
                      className="w-12 h-12 rounded object-cover border"
                    />
                  </td>

                  <td className="p-3 font-semibold">{b.name}</td>

                  <td className="p-3 max-w-xs truncate ">{b.tagline}</td>

                  <td className="p-3">{b.gstNumber}</td>

                  <td className="p-3 text-sm">
                    <p>{b.supportEmail}</p>
                    <p className="text-gray-500">{b.supportPhone}</p>
                  </td>

                  <td className="p-3">
                    {" "}
                    <a href={b.websiteUrl} target="blank"> {b.websiteUrl}</a>
                  </td>
                  <td className="p-3">{b.brandType}</td>

                  <td className="p-3">{b.countryOfOrigin}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${
                        b.status === "active"
                          ? "bg-green-100 text-green-600"
                          : b.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                      }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="p-3 text-gray-500 text-sm">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => handleEdit(b)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between items-center mt-4">
        <p className="text-sm text-gray-600">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
          >
            Prev
          </button>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 cursor-pointer hover:bg-gray-300"
          >
            Next
          </button>
        </div>
      </div>

      {/* MODALS */}
      {showCreateModal && (
        <CreateBrandModal onClose={handleCloseModals} refresh={fetchBrands} />
      )}

      {showEditModal && selectedBrand && (
        <EditBrandModal
          data={selectedBrand}
          onClose={handleCloseModals}
          refresh={fetchBrands}
        />
      )}
    </div>
  );
}
