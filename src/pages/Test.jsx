import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Edit, Trash2, PlusCircle, ListPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { usePopup } from "../components/PopupProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Test() {
  const { confirm, showPopup } = usePopup();
  const [tests, setTests] = useState([]);
  const [newTest, setNewTest] = useState({ title: "", description: "" });
  const [editingTest, setEditingTest] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const baseUrl = "http://localhost:8080/api/test";
  const navigate = useNavigate();

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

  const handleDeleteTest = async (id) => {
    const confirmed = await confirm({
      title: "Delete this test?",
      message: "All linked questions may become inaccessible after deletion.",
      confirmText: "Delete",
      type: "error",
    });
    if (!confirmed) return;
    try {
      await axios.delete(`${baseUrl}/delete/${id}`);
      fetchTests();
    } catch (err) {
      console.error("Error deleting test:", err);
      showPopup({ message: "Failed to delete test.", type: "error" });
    }
  };

  const handleUpdateTest = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${baseUrl}/update/${editingTest.id}`, {
        title: editingTest.title,
        description: editingTest.description,
      });
      setEditingTest(null);
      fetchTests();
    } catch (err) {
      console.error("Error updating test:", err);
    }
  };

  const handleAddQuestions = (testId) => {
    navigate(`/add-questions/${testId}`);
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Navbar />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-28 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[2rem] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(28,25,23,0.08)]"
        >
          <div className="border-b border-stone-200 bg-stone-50 px-8 py-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
              Teacher Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-800">
              Test Management
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
              Create tests, update details, and manage question sets from one
              clear workspace.
            </p>
          </div>

          <div className="grid gap-8 px-8 py-8 lg:grid-cols-[360px,1fr]">
            <motion.form
              onSubmit={editingTest ? handleUpdateTest : handleAddTest}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm"
            >
              <h2 className="mb-5 flex items-center gap-2 text-xl font-semibold text-stone-800">
                <PlusCircle className="text-amber-700" size={20} />
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
                className="mb-3 w-full rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />
              <textarea
                placeholder="Test Description"
                value={editingTest ? editingTest.description : newTest.description}
                onChange={(e) =>
                  editingTest
                    ? setEditingTest({
                        ...editingTest,
                        description: e.target.value,
                      })
                    : setNewTest({ ...newTest, description: e.target.value })
                }
                className="mb-4 h-28 w-full resize-none rounded-xl border border-stone-300 bg-white px-4 py-3 text-stone-900 placeholder:text-stone-400 focus:border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-200"
              />

              <button
                type="submit"
                className="w-full rounded-xl bg-stone-900 py-3 font-semibold text-white transition-colors hover:bg-amber-800"
              >
                {editingTest ? "Update Test" : "Add Test"}
              </button>

              {editingTest && (
                <button
                  type="button"
                  onClick={() => setEditingTest(null)}
                  className="mt-3 w-full rounded-xl border border-stone-300 bg-white py-3 font-semibold text-stone-700 transition-colors hover:bg-stone-100"
                >
                  Cancel Edit
                </button>
              )}
            </motion.form>

            <div>
              <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
                <p className="text-sm text-stone-500">Available tests</p>
                <p className="text-2xl font-semibold text-stone-800">
                  {loading ? "-" : tests.length}
                </p>
              </div>

              {loading ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center text-stone-500">
                  Loading tests...
                </div>
              ) : tests.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
                  <p className="text-lg font-semibold text-stone-700">
                    No tests created yet.
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Add your first test using the form on the left.
                  </p>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  <AnimatePresence>
                    {tests.map((test) => (
                      <motion.article
                        key={test.id}
                        layout
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition-shadow hover:shadow-lg"
                      >
                        <h3 className="text-2xl font-semibold text-stone-800">
                          {test.title}
                        </h3>
                        <p className="mt-3 min-h-[72px] text-sm leading-6 text-stone-600">
                          {test.description || "No description provided."}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <button
                            onClick={() => setEditingTest(test)}
                            className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-100"
                          >
                            <Edit size={16} /> Edit
                          </button>

                          <button
                            onClick={() => handleAddQuestions(test.id)}
                            className="inline-flex items-center gap-2 rounded-xl bg-amber-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-800"
                          >
                            <ListPlus size={16} /> Add Questions
                          </button>

                          <button
                            onClick={() => handleDeleteTest(test.id)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100"
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
