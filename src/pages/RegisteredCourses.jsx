import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function RegisteredCourses() {
  const navigate = useNavigate();
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8080/api/register/show/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("User's registrations:", res.data);
        setRegistrations(res.data);
      })
      .catch((err) => {
        console.error("Error fetching registered courses:", err);
        setRegistrations([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id, token]);

  // ✅ Navigate to ShowContent page
  const goToContent = (courseId) => {
    navigate(`/show-content/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading registered courses...</p>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 mt-10">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-extrabold text-center text-gray-800 mb-10"
        >
          My Registered Courses
        </motion.h1>

        {registrations.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No courses registered yet.
          </p>
        ) : (
          <motion.div
            layout
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            {registrations.map((reg, index) => (
              <motion.div
                key={reg.courseId}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ scale: 1.03 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 transition-all duration-300"
              >
                <h2 className="text-2xl font-semibold text-gray-800 mb-2 truncate">
                  {reg.courseTitle}
                </h2>
                <p className="text-gray-500 mb-1">Instructor: {reg.courseInstructor}</p>
                <p className="text-gray-500 mb-1">Category: {reg.courseCategory}</p>
                <p className="text-gray-600 mb-4">
                  Registered On:{" "}
                  <span className="font-medium">
                    {reg.registrationDate
                      ? new Date(reg.registrationDate).toLocaleDateString()
                      : "-"}
                  </span>
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => goToContent(reg.courseId)}
                  className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold rounded-xl shadow-md hover:shadow-yellow-500/50 transition-all duration-300"
                >
                  Learn 🚀
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default RegisteredCourses;
