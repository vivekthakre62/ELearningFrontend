import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePopup } from "../components/PopupProvider";

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
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    if (!token || user?.role !== "teacher") navigate("/login");
  }, [token, user, navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories/get")
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

      await axios.post(`http://localhost:8080/api/course/add/${user.id}`, data, {
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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-800 via-blue-500 to-gray-900 text-white overflow-hidden">
      <Navbar />

      <motion.div className="absolute w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse" />
      <motion.div className="absolute w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse" />

      <motion.div
        className="max-w-3xl mx-auto mt-32 p-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-3xl font-extrabold mb-6 text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Add New Course
        </motion.h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <motion.input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
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
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
            rows={4}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            required
          />

          <motion.div
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label className="block mb-2 font-semibold text-yellow-300">
              Category
            </label>
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full bg-gray-700 rounded-xl px-4 py-3 cursor-pointer flex justify-between items-center shadow-inner"
            >
              {formData.category || "Select Category"}
              <span className="ml-2">&#9662;</span>
            </div>
            {dropdownOpen && (
              <motion.div
                className="absolute mt-1 w-full bg-gray-800 rounded-xl shadow-lg z-10 max-h-40 overflow-y-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => {
                        setFormData({ ...formData, category: cat.name });
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-yellow-400 hover:text-black cursor-pointer transition"
                    >
                      {cat.name}
                    </div>
                  ))
                ) : (
                  <div className="px-4 py-2 text-gray-400">Loading...</div>
                )}
              </motion.div>
            )}
          </motion.div>

          <motion.input
            type="text"
            name="instructor"
            placeholder="Instructor Name"
            value={formData.instructor}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
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
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
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
            className="w-full px-4 py-3 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 shadow-inner"
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
            <label className="block mb-2 font-semibold text-yellow-300">
              Upload Course Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="text-gray-700"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="mt-2 w-40 h-40 object-cover rounded-xl"
              />
            )}
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-500/40 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? "Adding..." : "Add Course"}
          </motion.button>
        </form>
      </motion.div>

      <Footer />
    </div>
  );
}
