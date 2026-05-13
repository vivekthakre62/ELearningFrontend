import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../components/PopupProvider";
import { apiUrl } from "../config/api";

function DeleteCategorie() {
  const navigate = useNavigate();
  const { confirm } = usePopup();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    if (!token || user?.role !== "admin") {
      navigate("/login");
    }
  }, [navigate, token, user?.role]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(apiUrl("/api/categories/get"));
      const categoryList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setCategories(categoryList);
      setStatus({ message: "", type: "" });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setStatus({
        message:
          err.response?.data?.message || "Failed to load categories from backend.",
        type: "error",
      });
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!token) {
      setStatus({ message: "Unauthorized! Please log in again.", type: "error" });
      return;
    }

    const confirmed = await confirm({
      title: "Delete category?",
      message: "Deleting this category may affect related courses.",
      confirmText: "Delete",
      type: "error",
    });
    if (!confirmed) return;

    try {
      await axios.delete(apiUrl(`/api/categories/delete/${id}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
      setStatus({ message: "Category deleted successfully!", type: "success" });
    } catch (err) {
      console.error("Error deleting category:", err);
      setStatus({
        message:
          err.response?.data?.message || "Failed to delete category. Try again.",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-gray-800 to-black text-white p-8">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text"
      >
        Delete Categories
      </motion.h1>

      {loading ? (
        <p className="text-center text-gray-400">Loading categories...</p>
      ) : categories.length === 0 ? (
        <p className="text-center text-gray-400">No categories available.</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-gray-800 rounded-2xl p-6 shadow-lg relative border border-gray-700 hover:border-yellow-400 transition"
            >
              <h2 className="text-xl font-semibold text-yellow-400">
                {cat.name}
              </h2>

              {/* Delete Button */}
              <button
                onClick={() => handleDelete(cat.id)}
                className="absolute top-4 right-4 text-red-500 hover:text-red-400 transition transform hover:scale-110"
              >
                <Trash2 size={22} />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {status.message && (
        <p
          className={`mt-6 text-center font-semibold ${
            status.type === "success" ? "text-green-400" : "text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}

export default DeleteCategorie;
