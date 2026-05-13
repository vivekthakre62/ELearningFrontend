import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { apiUrl, WS_BASE_URL } from "../config/api";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState(false);
  const [teacherDropdownOpen, setTeacherDropdownOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const stompClient = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch initial unread message count
  useEffect(() => {
    if (!user) return;
    axios
      .get(apiUrl(`/api/messages/unread/${user.id}`))
      .then((res) => setUnreadCount(res.data.count))
      .catch((err) => console.error("Error fetching unread messages:", err));
  }, [user]);

  // Setup WebSocket for real-time messages
  useEffect(() => {
    if (!user) return;
    const socket = new SockJS(`${WS_BASE_URL}/ws`);
    stompClient.current = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      onConnect: () => {
        stompClient.current.subscribe(`/topic/user-${user.id}`, (msg) => {
          if (location.pathname !== "/messageList") setUnreadCount((prev) => prev + 1);
        });
      },
      onStompError: (frame) => console.error("STOMP error:", frame),
    });
    stompClient.current.activate();
    return () => stompClient.current.deactivate();
  }, [user, location.pathname]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <nav className="bg-gradient-to-r from-blue-800 via-blue-500 to-gray-900 text-white shadow-lg fixed w-full top-0 left-0 z-50 transition-all duration-300">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
          className="flex items-center justify-center gap-3"
        >
          <motion.img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Logo"
            className="w-10 h-10"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          />
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text"
          >
            EduConnect Portal
          </motion.h1>
        </motion.div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          {/* PUBLIC */}
          {!user && (
            <>
              <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
            </>
          )}

          {/* STUDENT */}
          {user?.role === "student" && (
            <>
              <Link to="/" className="hover:text-yellow-400 transition">Home</Link>
              <Link to="/registeredCourse" className="hover:text-yellow-400 transition">Register Courses</Link>
              <Link to="/test-student" className="hover:text-yellow-400 transition font-semibold">Test</Link>
              <Link to="/contact" className="hover:text-yellow-400 transition">Contact</Link>
            </>
          )}

          {/* TEACHER */}
          {user?.role === "teacher" && (
            <>
              <Link to="/" className="hover:text-yellow-400 transition">All Courses</Link>
              <Link to="/addCourse" className="hover:text-yellow-400 transition">Add Course</Link>
              <Link to="/addContent" className="hover:text-yellow-400 transition">Add Content</Link>
              <Link to="/registeredStudent" className="hover:text-yellow-400 transition">Registered Courses</Link>
              <Link to="/test" className="hover:text-yellow-400 transition font-semibold">Test</Link>
              <Link
                to="/messageList"
                className="relative hover:text-yellow-400 transition flex items-center"
                onClick={() => setUnreadCount(0)}
              >
                Message
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                )}
              </Link>
            </>
          )}

          {/* ADMIN */}
          {user?.role === "admin" && (
            <>
              <Link to="/addCategories" className="hover:text-yellow-400 transition">Add Category</Link>
              <Link to="/deleteCategory" className="hover:text-yellow-400 transition" onClick={()=>navigate("/deleteCategorie")}>Delete Category</Link>
              <Link to="/allStudents" className="hover:text-yellow-400 transition">All Students</Link>
              <Link to="/allTeachers" className="hover:text-yellow-400 transition">All Teachers</Link>
            </>
          )}

          {/* USER DROPDOWN */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() =>
                user.role === "student" ? setStudentDropdownOpen(true) : setTeacherDropdownOpen(true)
              }
              onMouseLeave={() =>
                user.role === "student" ? setStudentDropdownOpen(false) : setTeacherDropdownOpen(false)
              }
            >
              <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center font-bold text-black cursor-pointer hover:shadow-lg transition">
                {user.name.split(" ").map((n) => n[0]).join("").toUpperCase()}
              </div>

              <motion.div
                className={`absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden transition-all duration-300 transform ${
                  (user.role === "student" && studentDropdownOpen) ||
                  (user.role === "teacher" && teacherDropdownOpen) ||
                  (user.role === "admin" && teacherDropdownOpen)
                    ? "opacity-100 scale-100 visible"
                    : "opacity-0 scale-95 invisible"
                }`}
              >
                <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-yellow-300">Profile</Link>
                <Link
                  to="/messageList"
                  className="block px-4 py-2 text-sm hover:bg-gray-700 hover:text-yellow-300 items-center"
                  onClick={() => setUnreadCount(0)}
                >
                  Message
                  {unreadCount > 0 && (
                    <span className="ml-2 w-3 h-3 bg-red-600 rounded-full animate-pulse"></span>
                  )}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-red-400"
                >
                  Logout
                </button>
              </motion.div>
            </div>
          ) : (
            <Link
              to="/login"
              className="block px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden focus:outline-none">
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 text-white w-full px-6 py-4 space-y-3 absolute top-16 left-0 shadow-lg z-40">
          {!user && (
            <>
              <Link to="/" className="block hover:text-yellow-400 transition">Home</Link>
              <Link to="/contact" className="block hover:text-yellow-400 transition">Contact</Link>
            </>
          )}

          {user?.role === "student" && (
            <>
              <Link to="/" className="block hover:text-yellow-400 transition">Home</Link>
              <Link to="/registeredCourse" className="block hover:text-yellow-400 transition">Register Courses</Link>
              <Link to="/test-student" className="block hover:text-yellow-400 transition font-semibold">Test</Link>
              <Link to="/contact" className="block hover:text-yellow-400 transition">Contact</Link>
            </>
          )}

          {user?.role === "teacher" && (
            <>
              <Link to="/" className="block hover:text-yellow-400 transition">All Courses</Link>
              <Link to="/addCourse" className="block hover:text-yellow-400 transition">Add Course</Link>
              <Link to="/addContent" className="block hover:text-yellow-400 transition">Add Content</Link>
              <Link to="/registeredStudent" className="block hover:text-yellow-400 transition">Registered Courses</Link>
              <Link to="/test" className="block hover:text-yellow-400 transition font-semibold">Test</Link>
              <Link to="/messageList" className="block hover:text-yellow-400 transition">Message</Link>
            </>
          )}

          {user?.role === "admin" && (
            <>
              <Link to="/addCategories" className="block hover:text-yellow-400 transition">Add Category</Link>
              <Link to="/deleteCategorie" className="block hover:text-yellow-400 transition">Delete Category</Link>
              <Link to="/allStudents" className="block hover:text-yellow-400 transition">All Students</Link>
              <Link to="/allTeachers" className="block hover:text-yellow-400 transition">All Teachers</Link>
            </>
          )}

          {user && (
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700 hover:text-red-400"
            >
              Logout
            </button>
          )}

          {!user && (
            <Link
              to="/login"
              className="block px-4 py-2 bg-yellow-500 text-black font-semibold rounded-lg hover:bg-yellow-400 transition"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
