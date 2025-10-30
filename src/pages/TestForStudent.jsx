import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function TestForStudent() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const baseUrl = "http://localhost:8080/api/test";
  const navigate = useNavigate();

  // ✅ Fetch all available tests for students
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/showAll`); 
      // 👉 Endpoint should return all tests created by teachers
      setTests(res.data);
    } catch (err) {
      console.error("Error fetching tests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  // ✅ Navigate to test attempt page
  const handleAttemptTest = (testId) => {
    navigate(`/attempt-test/${testId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 to-emerald-200 flex flex-col items-center py-10 px-6">
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-green-800 mb-8 drop-shadow-lg"
      >
        🧾 Available Tests
      </motion.h1>

      {/* ✅ Test List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {loading ? (
          <p className="text-center text-gray-500 w-full">Loading...</p>
        ) : tests.length === 0 ? (
          <p className="text-gray-600 text-center w-full">
            No tests available right now.
          </p>
        ) : (
          <AnimatePresence>
            {tests.map((test) => (
              <motion.div
                key={test.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-lg rounded-2xl p-5 hover:shadow-2xl transition-all"
              >
                <h3 className="text-xl font-bold text-green-700 mb-2">
                  {test.title}
                </h3>
                <p className="text-gray-600 mb-4">{test.description}</p>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleAttemptTest(test.id)}
                    className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg font-medium shadow-md transition-all"
                  >
                    <Eye size={18} /> Start Test
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
