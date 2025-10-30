import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="relative bg-gray-900 text-white mt-20 overflow-hidden">
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-blue-800 via-blue-500 to-gray-700 opacity-30"
        animate={{ x: [0, 50, 0], y: [0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />

      <div className="relative z-10 container mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col items-start">
          <motion.div
            className="flex items-center gap-3 mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <motion.img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="Logo"
              className="w-12 h-12"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4 }}
            />
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text"
            >
              EduConnect Portal
            </motion.h1>
          </motion.div>
          <p className="text-gray-300 text-sm">
            Connect, learn, and grow. Explore courses, track your progress, and enjoy a seamless learning experience.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300 text-sm">
            <li>
              <Link className="hover:text-yellow-400 transition" to="/">Home</Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition" to="/courses">Courses</Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition" to="/contact">Contact</Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition" to="/categories">Categories</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <p className="text-gray-300 text-sm">Email: support@educonnect.com</p>
          <p className="text-gray-300 text-sm mt-1">Phone: +91 12345 67890</p>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.2, color: "#facc15" }}
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                <Icon size={24} />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-6 py-4 text-center text-gray-500 text-xs">
        &copy; {new Date().getFullYear()} EduConnect Portal. All rights reserved.
      </div>
    </footer>
  );
}
