// src/pages/MessageList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

function MessageLists() {
  const [teachers, setTeachers] = useState([]);
  const student = JSON.parse(localStorage.getItem("user")); // current logged-in student

  useEffect(() => {
    // ✅ API call to get all teachers this student has messaged or registered under
    axios
      .get(`http://localhost:8080/api/messages/teachers/${student.id}`)
      .then((res) => setTeachers(res.data))
      .catch((err) => console.error("Error fetching teachers:", err));
  }, [student.id]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Chats</h2>
      {teachers.length === 0 ? (
        <p className="text-gray-600">No messages yet.</p>
      ) : (
        <div className="space-y-3">
          {teachers.map((teacher) => (
            <Link
              to={`/message/${teacher.id}`}
              key={teacher.id}
              className="flex items-center bg-white p-4 rounded shadow hover:bg-gray-50"
            >
              {teacher.image ? (
                <img
                  src={teacher.image}
                  alt={teacher.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              ) : (
                <FaUserCircle className="w-12 h-12 text-gray-400 mr-4" />
              )}
              <div>
                <h3 className="text-lg font-medium text-gray-800">{teacher.name}</h3>
                <p className="text-sm text-gray-500">Tap to chat</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MessageLists;
