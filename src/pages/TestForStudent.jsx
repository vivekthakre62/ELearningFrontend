import { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function TestForStudent() {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseUrl = "http://localhost:8080/api/test";
  const navigate = useNavigate();

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/showAll`);
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

  const handleAttemptTest = (testId) => {
    navigate(`/attempt-test/${testId}`);
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
              Student Dashboard
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-800">
              Available Tests
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
              Choose a test from the list below and begin when you are ready.
            </p>
          </div>

          <div className="px-8 py-8">
            <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
              <p className="text-sm text-stone-500">Published tests</p>
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
                  No tests available right now.
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  New tests will appear here once teachers publish them.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
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

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => handleAttemptTest(test.id)}
                          className="inline-flex items-center gap-2 rounded-xl bg-stone-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-800"
                        >
                          <Eye size={16} /> Start Test
                        </button>
                      </div>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
