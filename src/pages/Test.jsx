import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, PlusCircle, ListPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Test() {
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({ title: "", description: "" });
  const [editingTest, setEditingTest] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const baseUrl = "http://localhost:8080/api/test";
  const navigate = useNavigate();

  // ✅ Fetch all tests
  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/show/${user.id}`);
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

  // ✅ Add new test
  const handleAddTest = async (e) => {
    e.preventDefault();
    if (!newTest.title.trim()) return;

    try {
      await axios.post(`${baseUrl}/add/${user.id}`, newTest);
      setNewTest({ title: "", description: "" });
      fetchTests();
    } catch (err) {
      console.error("Error adding test:", err);
    }
  };

  // ✅ Delete test
  const handleDeleteTest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this test?")) return;
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      fetchTests();
    } catch (err) {
      console.error("Error deleting test:", err);
    }
  };

  // ✅ Update test
  const handleUpdateTest = async (e) => {
    e.preventDefault();
    try {
      // Send only title & description to avoid circular references
      await axios.put(`${baseUrl}/update/${editingTest.id}`, {
        title: editingTest.title,
        description: editingTest.description,
      });
      console.log("Updated test:", editingTest);
      setEditingTest(null);
      fetchTests();
    } catch (err) {
      console.error("Error updating test:", err);
    }
  };

  // ✅ Navigate to question creation
  const handleAddQuestions = (testId) => {
    navigate(`/add-questions/${testId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex flex-col items-center py-10 px-6">
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-blue-800 mb-8 drop-shadow-lg"
      >
        📘 Test Management
      </motion.h1>

      {/* ✅ Add or Edit Form */}
      <motion.form
        onSubmit={editingTest ? handleUpdateTest : handleAddTest}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg mb-10"
      >
        <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center gap-2">
          <PlusCircle className="text-blue-500" />
          {editingTest ? "Update Test" : "Add New Test"}
        </h2>

        <input
          type="text"
          placeholder="Test Title"
          value={editingTest ? editingTest.title : newTest.title}
          onChange={(e) =>
            editingTest
              ? setEditingTest({ ...editingTest, title: e.target.value })
              : setNewTest({ ...newTest, title: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-blue-400 outline-none"
        />
        <textarea
          placeholder="Test Description"
          value={editingTest ? editingTest.description : newTest.description}
          onChange={(e) =>
            editingTest
              ? setEditingTest({ ...editingTest, description: e.target.value })
              : setNewTest({ ...newTest, description: e.target.value })
          }
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 h-24 resize-none focus:ring-2 focus:ring-blue-400 outline-none"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold shadow-md transition-all"
        >
          {editingTest ? "Update Test" : "Add Test"}
        </button>

        {editingTest && (
          <button
            type="button"
            onClick={() => setEditingTest(null)}
            className="w-full mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 rounded-lg font-semibold transition-all"
          >
            Cancel Edit
          </button>
        )}
      </motion.form>

      {/* ✅ Test List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
        {loading ? (
          <p className="text-center text-gray-500 w-full">Loading...</p>
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
                className="bg-white shadow-lg rounded-2xl p-5 relative hover:shadow-2xl transition-all"
              >
                <h3 className="text-xl font-bold text-blue-700 mb-2">
                  {test.title}
                </h3>
                <p className="text-gray-600 mb-4">{test.description}</p>

                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setEditingTest(test)} // ✅ FIXED HERE
                    className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition"
                  >
                    <Edit size={18} /> Edit
                  </button>

                  <button
                    onClick={() => handleAddQuestions(test.id)}
                    className="flex items-center gap-1 text-green-600 hover:text-green-700 transition"
                  >
                    <ListPlus size={18} /> Add Questions
                  </button>

                  <button
                    onClick={() => handleDeleteTest(test.id)}
                    className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                  >
                    <Trash2 size={18} /> Delete
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
