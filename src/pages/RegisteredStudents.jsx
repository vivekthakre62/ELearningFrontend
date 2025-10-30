import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function RegisteredStudents() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // teacher info
  const navigate = useNavigate();
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
   
    axios
      .get(`http://localhost:8080/api/teacher/students/${user.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Teacher's courses with students:", res.data);
        setCourses(res.data);
      })
      .catch((err) => {
        console.error("Error fetching registered students:", err);
        setCourses([]);
      })
      .finally(() => setLoading(false));
  }, [user?.id, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading registered students...</p>
      </div>
    );
  }
  function handleMessage(studentId){
    navigate(`/message/${studentId}`);
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="container mx-auto py-10 px-4 mt-10">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
          My Courses & Registered Students
        </h1>

        {courses.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
            No courses created or no students registered yet.
          </p>
        ) : (
          courses.map((course) => (
            <div key={course.courseId} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-700 mb-4">
                {course.title} ({course.students.length} students)
              </h2>

              {course.students.length === 0 ? (
                <p className="text-gray-500 mb-2">No students registered yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-transparent">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Student Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Phone</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-transparent">
                      {course.students.map((student) => (
                        <motion.tr
                          key={student.id}
                          whileHover={{ scale: 1.02 }}
                          className="transition-transform duration-300 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 text-sm text-gray-800 font-medium">{student.name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                          <td>
                            
                            <button onClick={()=>handleMessage(student.id)} className="px-2 py-2 rounded-md text-white bg-green-700">
                              Message
                            </button>
                          
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <Footer />
    </div>
  );
}

export default RegisteredStudents;
