import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Courses() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [courses, setCourses] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/course/show")
      .then((res) => {
        const coursesWithImages = res.data.map((course) => {
          if (course.data) {
            const base64String = btoa(
              new Uint8Array(course.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                ""
              )
            );
            course.image = `data:${course.fileType};base64,${base64String}`;
          }
          return course;
        });
        setCourses(coursesWithImages);
      })
      .catch((err) => console.error(err));
  }, []);

  const truncateText = (text, length) =>
    text.length > length ? text.slice(0, length) + "..." : text;

  const handleUpdate = (courseId) => {
    navigate(`/updateCourse/${courseId}`);
  };
  const handleEnroll = async(courseId) =>{
     try {
       if (window.confirm("Are you sure you want to delete this course?")) {
        await axios.post(`http://localhost:8080/api/register/registerCourse/${courseId}`,user 
          ,{
          headers: { Authorization: `Bearer ${token}` },
        });
        // setCourses(courses.filter((c) => c.id !== courseId));
        alert("Enrolled Successfully!");
      }
      } catch (err) {
        alert("Enrollment failed!");
        console.error("Enrollement failed:", err);
      }
  }


  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await axios.delete(`http://localhost:8080/api/course/delete/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCourses(courses.filter((c) => c.id !== courseId));
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  const handleAddToCart = (courseId) => {
    alert(`Course ${courseId} added to cart!`);
    // You can implement real cart logic here
  };

  return (
    <div className="min-h-screen bg-white  py-10 px-4">
      <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-10">
       Top Courses
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {courses.map((course) => (
          <motion.div
            key={course.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer transition-transform duration-300"
            onMouseEnter={() => setHoveredId(course.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <img
              src={course.image || "https://via.placeholder.com/300x200"}
              alt={course.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h2 className="text-lg font-bold text-gray-800">{course.title}</h2>

              <p className="text-gray-500 text-sm mt-1 transition-all duration-300">
                {truncateText(course.description, 50)}
              </p>

              <div className="mt-2 text-gray-700 text-sm">
                <p>
                  <span className="font-semibold">Instructor:</span> {course.instructor}
                </p>
                <p>
                  <span className="font-semibold">Category:</span> {course.category}
                </p>
                <p>
                  <span className="font-semibold">Duration:</span> {course.duration} hrs
                </p>
              </div>

              <div className="mt-3 flex justify-between items-center">
                <span className="text-yellow-500 font-bold">₹{course.price}</span>

                {user?.role === "teacher" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdate(course.id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="px-3 py-1 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition"
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition" onClick={()=> handleEnroll(course.id)}>
                      Enroll
                    </button>
                    <button
                      onClick={() => handleAddToCart(course.id)}
                      className="px-3 py-1 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition"
                    >
                      Add to Cart
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
