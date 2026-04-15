import { useEffect, useState } from "react";
import api from "../../serviceAuth/axios";
import Swal from "sweetalert2";
import { Eye, Trash2, Mail } from "lucide-react";

export default function ContactPage() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedContact, setSelectedContact] = useState(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const res = await api.get("/contact");
            setContacts(res.data.contacts);
        } catch {
            Swal.fire("Error", "Failed to fetch contacts", "error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContacts();
    }, []);

    const handleDelete = async (id) => {
        const confirm = await Swal.fire({
            title: "Are you sure?",
            text: "This contact will be deleted",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#927f68"
        });

        if (!confirm.isConfirmed) return;

        try {
            await api.delete(`/contact/${id}`);
            Swal.fire("Deleted!", "Contact removed", "success");
            fetchContacts();
        } catch {
            Swal.fire("Error", "Delete failed", "error");
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await api.put(`/contact/${id}`, { status });
            fetchContacts();
        } catch {
            Swal.fire("Error", "Status update failed", "error");
        }
    };


    return (
        <div className="p-6 overflow-hidden">
            <div className="flex justify-between items-center mb-6 bg-[#f5efdd] p-3 rounded-md">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 font-semibold">
                    <Mail className="text-[#927f68]" /> Contact Messages
                </h2>
            </div>

            <div className="bg-white rounded-xl shadow overflow-x-scroll">
                <table className="w-full text-sm">
                    <thead className="bg-[#927f68] text-[#f5efdd]">
                        <tr>
                            <th className="p-3">Name</th>
                            <th className="p-3">Email</th>
                            <th className="p-3">Mobile</th>
                            <th className="p-3">Subject</th>
                            <th className="p-3">Source</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Created</th>
                            <th className="p-3">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="8" className="text-center py-6">
                                    Loading...
                                </td>
                            </tr>
                        ) : contacts.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center py-6">
                                    No Data Found
                                </td>
                            </tr>
                        ) : (
                            contacts.map((c) => (
                                <tr key={c._id} className="border-t hover:bg-gray-50">
                                    <td className="p-3 font-semibold">{c.name}</td>
                                    <td className="p-3">{c.email}</td>
                                    <td className="p-3">{c.mobile}</td>
                                    <td className="p-3">{c.subject}</td>
                                    <td className="p-3 capitalize">{c.source}</td>

                                    <td className="p-3">
                                        <select
                                            value={c.status}
                                            onChange={(e) =>
                                                handleStatusChange(c._id, e.target.value)
                                            }
                                            className="border px-2 py-1 rounded-md"
                                        >
                                            <option value="new">new</option>
                                            <option value="read">read</option>
                                            <option value="replied">replied</option>
                                        </select>
                                    </td>

                                    <td className="p-3 text-gray-500 text-sm">
                                        {new Date(c.createdAt).toLocaleDateString()}
                                    </td>

                                    <td className="p-3 flex gap-2">
                                        <button
                                            onClick={() => setSelectedContact(c)}
                                            className="text-[#927f68] hover:bg-[#f5efdd] p-2 rounded-md"
                                        >
                                            <Eye size={16} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(c._id)}
                                            className="text-red-500 hover:bg-red-50 p-2 rounded-md"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* VIEW MODAL */}
            {selectedContact && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
                    <div className="bg-white w-[500px] max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl">

                        {/* HEADER */}
                        <div className="bg-[#927f68] text-[#f5efdd] px-6 py-4 rounded-t-2xl flex justify-between items-center">
                            <h3 className="text-lg font-semibold">Contact Details</h3>
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="text-[#f5efdd] hover:text-white text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        {/* BODY */}
                        <div className="p-6 space-y-4 text-sm">

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-gray-500 text-xs">Name</p>
                                    <p className="font-semibold">{selectedContact.name}</p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Email</p>
                                    <p className="font-semibold break-all">
                                        {selectedContact.email}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Mobile</p>
                                    <p className="font-semibold">
                                        {selectedContact.mobile || "—"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Source</p>
                                    <span className="px-3 py-1 text-xs rounded-full bg-[#f5efdd] text-[#927f68] font-medium capitalize">
                                        {selectedContact.source}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Status</p>
                                    <span
                                        className={`px-3 py-1 text-xs rounded-full font-medium ${selectedContact.status === "new"
                                                ? "bg-blue-100 text-blue-600"
                                                : selectedContact.status === "read"
                                                    ? "bg-yellow-100 text-yellow-600"
                                                    : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {selectedContact.status}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-gray-500 text-xs">Created</p>
                                    <p className="font-semibold">
                                        {new Date(selectedContact.createdAt).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            {/* SUBJECT */}
                            <div>
                                <p className="text-gray-500 text-xs">Subject</p>
                                <p className="font-semibold">{selectedContact.subject}</p>
                            </div>

                            {/* MESSAGE */}
                            <div>
                                <p className="text-gray-500 text-xs mb-1">Message</p>
                                <div className="bg-[#f5efdd] p-4 rounded-lg text-gray-700 leading-relaxed">
                                    {selectedContact.message}
                                </div>
                            </div>
                        </div>

                        {/* FOOTER */}
                        <div className="px-6 py-4 border-t flex justify-end">
                            <button
                                onClick={() => setSelectedContact(null)}
                                className="bg-[#927f68] text-[#f5efdd] px-5 py-2 rounded-lg hover:bg-[#7a6a56] transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}