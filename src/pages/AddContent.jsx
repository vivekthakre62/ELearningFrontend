import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiUrl } from "../config/api";

export default function AddContent() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(apiUrl("/api/course/show"))
      .then((res) => setCourses(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const truncateText = (text, length) =>
    text?.length > length ? `${text.slice(0, length)}...` : text;

  const handleAddContent = (courseId) => {
    navigate(`/contentUpload/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 mt-12" >
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Top Courses
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No courses available.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-transparent">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Instructor
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-transparent">
                {courses.map((course) => (
                  <motion.tr
                    key={course.id}
                    whileHover={{ scale: 1.02 }}
                    className="transition-transform duration-300 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {course.title}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {truncateText(course.description, 50)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.instructor}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {course.duration} hrs
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      ₹{course.price ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <button
                        onClick={() => handleAddContent(course.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                      >
                        Add Content
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
