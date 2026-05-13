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

  const goToContent = (courseId) => {
    navigate(`/show-content/${courseId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-100">
        <Navbar />
        <div className="flex min-h-screen items-center justify-center px-6">
          <p className="text-lg text-stone-600">Loading registered courses...</p>
        </div>
      </div>
    );
  }

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
              My Registered Courses
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-stone-500">
              Review the courses you have already joined and open the learning
              materials whenever you are ready to continue.
            </p>
          </div>

          <div className="px-8 py-8">
            {registrations.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center">
                <p className="text-lg font-semibold text-stone-700">
                  No courses registered yet.
                </p>
                <p className="mt-2 text-sm text-stone-500">
                  Once you enroll in a course, it will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6 flex items-center justify-between border-b border-stone-200 pb-4">
                  <p className="text-sm text-stone-500">Total enrolled courses</p>
                  <p className="text-2xl font-semibold text-stone-800">
                    {registrations.length}
                  </p>
                </div>

                <motion.div
                  layout
                  className="grid gap-6 md:grid-cols-2 xl:grid-cols-3"
                >
                  {registrations.map((reg, index) => (
                    <motion.article
                      key={reg.courseId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.35 }}
                      whileHover={{ y: -4 }}
                      className="rounded-3xl border border-stone-200 bg-stone-50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
                    >
                      <div className="mb-5 border-b border-stone-200 pb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">
                          Enrolled Course
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold text-stone-800">
                          {reg.courseTitle}
                        </h2>
                      </div>

                      <div className="space-y-3 text-sm text-stone-600">
                        <p>
                          <span className="font-semibold text-stone-800">Instructor:</span>{" "}
                          {reg.courseInstructor}
                        </p>
                        <p>
                          <span className="font-semibold text-stone-800">Category:</span>{" "}
                          {reg.courseCategory}
                        </p>
                        <p>
                          <span className="font-semibold text-stone-800">Registered On:</span>{" "}
                          {reg.registrationDate
                            ? new Date(reg.registrationDate).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => goToContent(reg.courseId)}
                        className="mt-6 w-full rounded-xl bg-stone-900 px-4 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-amber-800"
                      >
                        Open Course
                      </motion.button>
                    </motion.article>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
}

export default RegisteredCourses;
