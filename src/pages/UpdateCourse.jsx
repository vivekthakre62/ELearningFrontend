import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { usePopup } from "../components/PopupProvider";
import { apiUrl } from "../config/api";

function UpdateCourse() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const token = localStorage.getItem("token");

  const [course, setCourse] = useState({
    title: "",
    description: "",
    category: "",
    duration: "",
    price: "",
  });

  useEffect(() => {
    axios
      .get(apiUrl(`/api/course/get/${courseId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setCourse(res.data);
      })
      .catch((err) => {
        console.error("Error fetching course details:", err);
      });
  }, [courseId, token]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    axios
      .put(apiUrl(`/api/course/update/${courseId}`), course, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        showPopup({ message: "Course updated successfully!", type: "success" });
        navigate("/");
      })
      .catch((err) => {
        console.error("Error updating course:", err);
        showPopup({ message: "Failed to update course!", type: "error" });
      });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div
        className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Update Course
        </h2>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Course Title
            </label>
            <input
              type="text"
              name="title"
              value={course.title}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={course.description}
              onChange={handleChange}
              rows="4"
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Category
            </label>
            <input
              type="text"
              name="category"
              value={course.category}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Duration (in hours)
            </label>
            <input
              type="number"
              name="duration"
              value={course.duration}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Price (Rs)
            </label>
            <input
              type="number"
              name="price"
              value={course.price}
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <motion.button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Update Course
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default UpdateCourse;
