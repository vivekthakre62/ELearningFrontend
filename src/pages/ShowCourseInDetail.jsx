import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { usePopup } from "../components/PopupProvider";
import { apiUrl } from "../config/api";

export default function ShowCourseInDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showPopup } = usePopup();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [course, setCourse] = useState(null);

  useEffect(() => {
    if (!token) {
      showPopup({ message: "You need to log in first!", type: "warning" });
      navigate("/login");
      return;
    }

    axios
      .get(apiUrl(`/api/course/get1/${courseId}`), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const data = res.data;

        if (data.data && data.fileType) {
          const base64String = btoa(
            new Uint8Array(data.data).reduce(
              (acc, byte) => acc + String.fromCharCode(byte),
              ""
            )
          );
          data.image = `data:${data.fileType};base64,${base64String}`;
        }

        setCourse(data);
      })
      .catch((err) => {
        console.error("Error fetching course:", err);
        if (err.response?.status === 403 || err.response?.status === 401) {
          showPopup({ message: "Session expired! Please log in again.", type: "error" });
          localStorage.removeItem("token");
        }
      });
  }, [courseId, navigate, showPopup, token]);

  if (!course) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
      >
        Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={course.image || "https://via.placeholder.com/400x250"}
            alt={course.title}
            className="w-full md:w-1/2 h-64 object-cover rounded-lg"
          />

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {course.title}
            </h1>
            <p className="text-gray-600 mb-4">{course.description}</p>

            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Instructor Details:</h2>
              <p>
                <span className="font-semibold">Name:</span> {course.instructor}
              </p>
            </div>

            <div>
              <p>
                <span className="font-semibold">Category:</span> {course.category}
              </p>
              <p>
                <span className="font-semibold">Duration:</span> {course.duration} hrs
              </p>
              <p>
                <span className="font-semibold">Price:</span> Rs {course.price}
              </p>
            </div>

            {user?.role !== "teacher" && (
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => showPopup({ message: "Enroll logic here", type: "info" })}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Enroll
                </button>
                <button
                  onClick={() => showPopup({ message: "Add to Cart logic here", type: "info" })}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
