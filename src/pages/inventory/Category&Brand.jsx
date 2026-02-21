import { useState } from "react";
import {
    Plus,
    Search,
    MoreVertical,
} from "lucide-react";
import { Pencil, Trash2, UploadCloud, ImageIcon } from "lucide-react";

export default function CategorySection() {
    const categories = [
        {

  {
            id: 1,
            img: "/image/shirt1.jpg",
            name: "t-shirt",
            code: "TS001",
            description: "Basic cotton t-shirt",
        },
        {
            id: 2,
            img: "/image/shirt1.jpg",
            name: "Polo T-shirt",
            code: "TS002",
            description: "Premium polo collection",
        },
        {
            id: 3,
            img: "/image/shirt1.jpg",
            name: "Boot Cut Formal Pant",
            code: "PT001",
            description: "Formal wear",
        },
        {
            id: 4,
            img: "/image/shirt1.jpg",
            name: "Baggy Pant",
            code: "PT002",
            description: "Loose fit style",
        },
        {
            id: 5,
            img: "/image/shirt1.jpg",
            name: "Jacket",
            code: "JK001",
            description: "Winter jacket",
        },
        {
            id: 6,
            img: "/image/shirt1.jpg",
            name: "Sweat Shirt",
            code: "SW001",
            description: "Comfort wear",
        },
        {
            id: 7,
            img: "/image/shirt1.jpg",
            name: "Sweat",
            code: "SW002",
            description: "Sports collection",
        },
        {
            id: 8,
            img: "/image/shirt1.jpg",
            name: "Formal Pant",
            code: "PT003",
            description: "Office wear",
        },
        {
            id: 9,
            img: "/image/shirt1.jpg",
            name: "Track Suit",
            code: "TR001",
            description: "Training wear",
        },
        {
            id: 10,
            img: "/image/shirt1.jpg",
            name: "Shorts",
            code: "SH001",
            description: "Casual wear",
        },
]);
  

    const [activeTab, setActiveTab] = useState("category");

const [subcategories, setSubcategories] = useState([
   {
            id: 1,
            img: "/image/shirt1.jpg",
            name: "Round Neck",
            code: "SC001",
            description: "Round neck t-shirts",
        },
        {
            id: 2,
            img: "/image/shirt1.jpg",
            name: "Slim Fit",
            code: "SC002",
            description: "Slim fit collection",
        },
        
]);
   

    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 8;

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const data = activeTab === "category" ? categories : subcategories;

    const currentProducts = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);



const [isCreateOpen, setIsCreateOpen] = useState(false);
const [isEditOpen, setIsEditOpen] = useState(false);
const [selectedCategory, setSelectedCategory] = useState(null);


const handleDelete = (id) => {
    if (activeTab === "category") {
        setCategories(categories.filter(item => item.id !== id));
    } else {
        setSubcategories(subcategories.filter(item => item.id !== id));
    }
};



    return (
        <div className="p-6 min-h-screen">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6 bg-[#f5efdd] p-3 rounded-md">
                <h2 className="text-xl font-semibold">Category</h2>
            </div>

            {/* ACTION BAR */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-8 py-7">
                <div className="flex flex-wrap justify-between gap-4">
                    {/* Left Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab("category")}
                            className={`px-4 py-2 rounded-md text-sm ${activeTab === "category"
                                    ? "bg-[#927f68] text-white"
                                    : "bg-[#f5efdd] text-[#927f68]"
                                }`}
                        >
                            Category
                        </button>
                        <button
                            onClick={() => setActiveTab("subcategory")}
                            className={`px-4 py-2 rounded-md text-sm ${activeTab === "subcategory"
                                    ? "bg-[#927f68] text-white"
                                    : "bg-[#f5efdd] text-[#927f68]"
                                }`}
                        >
                            Sub Category
                        </button>
                    </div>
                    {/* Right Controls */}
                    <div className="flex items-center gap-3 flex-wrap">
                        <select className="border rounded-md px-3 py-2 text-sm">
                            <option>50</option>
                            <option>100</option>
                            <option>200</option>
                        </select>
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
                       <button
    onClick={() => {
        setIsCreateOpen(true);
    }}
    className="flex items-center gap-2 bg-[#f5efdd] text-[#927f68] px-4 py-2 rounded-md text-sm"
>
    <Plus size={16} />
    Create New
</button>
                    </div>
                </div>
                {/* PRODUCT TABLE */}
                <div className="bg-white rounded-md shadow-sm overflow-hidden mt-5">
                    <div className="bg-white rounded-md shadow-sm overflow-hidden mt-5">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-[#927f68] text-[#f5efdd] uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Image</th>
                                    <th className="px-4 py-3">Name</th>
                                    <th className="px-4 py-3">Code</th>
                                    <th className="px-4 py-3">Description</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentProducts.map((item, index) => (
                                    <tr
                                        key={item.id}
                                        className="border-t border-gray-200 hover:bg-gray-50 transition"
                                    >
                                        <td className="px-4 py-3">
                                            {indexOfFirstRow + index + 1}
                                        </td>

                                        {/* Image Column */}
                                        <td className="px-4 py-3">
                                            <div className="w-14 h-12flex items-center justify-center">
                                                <img src={item.img} size={22} className="object-cover" />
                                            </div>
                                        </td>

                                        <td className="px-4 py-3 font-medium text-gray-800">
                                            {item.name}
                                        </td>

                                        <td className="px-4 py-3 text-gray-600">
                                            {item.code}
                                        </td>

                                        <td className="px-4 py-3 text-gray-500">
                                            {item.description}
                                        </td>

                                        {/* Actions */}
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-4 text-gray-500">
                                                <button
                                                 onClick={() => {
    setSelectedCategory(item);
    setIsEditOpen(true);
}}
                                                    className="hover:text-blue-600"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                              <button
    onClick={() => handleDelete(item.id)}
    className="hover:text-red-600"
>
    <Trash2 size={18} />
</button>

                                                <button className="hover:text-green-600">
                                                    <UploadCloud size={18} />
                                                </button>
                                            </div>
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



                {isCreateOpen && (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">

            <h2 className="text-lg font-semibold mb-4">
                New {activeTab === "category" ? "Category" : "SubCategory"}
            </h2>

            {/* Empty Form */}
            <div className="space-y-4">
                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Department
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Select department">
                                        <option>Formal</option>
                                        <option>Casual</option>
                                        <option>Ethnic</option>
                                    </select>
                                </div>
                                {/* Category Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedCategory?.name || ""}
                                        placeholder = "Enter Category Name"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                {/* Category Code */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter category code"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                {/* Parent Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Parent Category
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                        <option>Bootcut</option>
                                        <option>Cap</option>
                                        <option>Hankey</option>
                                        <option>Polo tshirt</option>
                                        <option>Blazer</option>
                                    </select>
                                </div>
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        defaultValue={selectedCategory?.description}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    ></textarea>
                                </div>
                            </div>
            <div className="flex justify-end gap-3 mt-6">
                <button
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2 border rounded-md text-sm"
                >
                    Close
                </button>

                <button className="px-4 py-2 bg-[#927f68] text-white rounded-md text-sm">
                    Save
                </button>
            </div>

        </div>
    </div>
)}




              {isEditOpen && (
     <div className="fixed inset-0  bg-black/60 flex items-center justify-center z-50">
                        <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
                            {/* Header */}
                            <h2 className="text-lg font-semibold mb-4">
                                {selectedCategory ? "Edit Category" : "New Category"}
                            </h2>
                            {/* Form */}
                            <div className="space-y-4">
                                {/* Department */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Department
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm" placeholder="Select department">
                                        <option>Formal</option>
                                        <option>Casual</option>
                                        <option>Ethnic</option>
                                    </select>
                                </div>
                                {/* Category Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category Name
                                    </label>
                                    <input
                                        type="text"
                                        value={selectedCategory?.name || ""}
                                        placeholder = "Enter Category Name"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                {/* Category Code */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category Code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Enter category code"
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    />
                                </div>
                                {/* Parent Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Parent Category
                                    </label>
                                    <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm">
                                        <option>Bootcut</option>
                                        <option>Cap</option>
                                        <option>Hankey</option>
                                        <option>Polo tshirt</option>
                                        <option>Blazer</option>
                                    </select>
                                </div>
                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        rows="3"
                                        defaultValue={selectedCategory?.description}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                                    ></textarea>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                    onClick={() => setIsEditOpen(false)}
                    className="px-4 py-2 border rounded-md text-sm"
                >
                    Close
                </button>

                <button className="px-4 py-2 bg-[#927f68] text-white rounded-md text-sm">
                    Update
                </button>
                            </div>

                        </div>
                    </div>
)}
            </div>
        </div>
    );
}