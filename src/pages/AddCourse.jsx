import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePopup } from "../components/PopupProvider";
import { apiUrl } from "../config/api";

export default function AddCourse() {
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    instructor: "",
    duration: "",
    price: "",
  });
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "teacher") navigate("/login");
  }, [token, user, navigate]);

  useEffect(() => {
    axios
      .get(apiUrl("/api/categories/get"))
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      showPopup({ message: "Please select an image", type: "warning" });
      return;
    }

    try {
      setLoading(true);
      const data = new FormData();
      data.append("file", file);

      const courseJson = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        instructor: formData.instructor,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        teacher: { user },
      };

      data.append(
        "course",
        new Blob([JSON.stringify(courseJson)], { type: "application/json" })
      );

      await axios.post(apiUrl(`/api/course/add/${user.id}`), data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showPopup({ message: "Course added successfully!", type: "success" });
      navigate("/courses");

      setFormData({
        title: "",
        description: "",
        category: "",
        instructor: "",
        duration: "",
        price: "",
      });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Error adding course:", err);
      showPopup({ message: "Failed to add course", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Navbar />

      <motion.div
        className="max-w-3xl mx-auto px-6 pt-32 pb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="rounded-3xl border border-stone-300 bg-white shadow-[0_20px_60px_rgba(28,25,23,0.08)]">
          <div className="border-b border-stone-200 px-8 py-6">
            <motion.h2
              className="text-3xl font-bold tracking-tight text-stone-800"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Add New Course
            </motion.h2>
            <p className="mt-2 text-sm text-stone-500">
              Fill in the course details below and use a direct category name.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
          <motion.input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            required
          />

          <motion.textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            rows={4}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            required
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="mb-2 block font-semibold text-stone-700">
              Category
            </label>
            <input
              type="text"
              name="category"
              placeholder="Enter category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
              required
            />
            {categories.length > 0 && (
              <p className="mt-2 text-sm text-stone-500">
                Existing categories: {categories.map((cat) => cat.name).join(", ")}
              </p>
            )}
          </motion.div>

          <motion.input
            type="text"
            name="instructor"
            placeholder="Instructor Name"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            required
          />

          <motion.input
            type="number"
            name="duration"
            placeholder="Duration (hours)"
            value={formData.duration}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            required
          />

          <motion.input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            className="w-full rounded-xl border border-stone-300 bg-stone-50 px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            required
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block mb-2 font-semibold text-stone-700">
              Upload Course Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full rounded-xl border border-dashed border-stone-300 bg-stone-50 px-4 py-3 text-sm text-stone-600 file:mr-4 file:rounded-lg file:border-0 file:bg-amber-700 file:px-4 file:py-2 file:font-semibold file:text-white hover:file:bg-amber-800"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-4 h-40 w-40 rounded-2xl border border-stone-200 object-cover shadow-sm"
              />
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-stone-900 py-3 font-bold text-white shadow-lg transition-all duration-300 hover:bg-amber-800"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Adding..." : "Add Course"}
          </motion.button>
          </form>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
