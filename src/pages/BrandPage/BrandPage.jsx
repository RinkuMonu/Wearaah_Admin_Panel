import { useEffect, useState } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import CreateBrandModal from "./CreateBrandModal";
import EditBrandModal from "./EditBrandModal";
import { Pencil, Search, Tag } from "lucide-react";

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
      <div className="flex justify-between items-center mb-6 bg-[#f5efdd] p-3 rounded-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2"><Tag className="text-[#927f68]" />Brand</h2>

        <button className="text-[#927f68] text-sm font-medium">
         <div className="flex gap-4">
          {/* SEARCH */}
        
         <div className="relative w-64">
  {/* Icon */}
  <Search
    size={18}
    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#927f68]"
  />

  {/* Input */}
  <input
    type="text"
    placeholder="Search brand..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className="w-full pl-10 pr-4 py-2 rounded-md 
               border border-[#d6cbb5] 
               bg-[#f5efdd] 
               focus:outline-none 
               focus:ring-2 focus:ring-[#927f68] 
               focus:border-[#927f68] 
               transition"
  />
</div>

          {/* CREATE BUTTON */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-[#927f68] text-[#f5efdd] px-4 py-2 rounded-md hover:bg-[#baa48a] transition-colors"
          >
            + Create Brand
          </button>
        </div>
        </button>
         <div className="flex justify-between">
        

        {/* LIMIT */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="border border-gray-200 px-3 py-2 rounded-lg cursor-pointer"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
      </div>
      {/* HEADER */}
     

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-scroll">
        <table className="w-full text-sm">
          <thead className="bg-[#927f68] text-[#f5efdd]">
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
                      className="w-12 h-12 rounded object-cover"
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
  className="text-[#927f68] hover:text-[#5c5042] hover:bg-[#f5efdd] p-2  rounded-md transition"
>
  <Pencil size={16} />
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
