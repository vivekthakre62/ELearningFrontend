// src/pages/Contact.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import axios from "axios";
import { div } from "framer-motion/client";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/api/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      <Navbar/>
    <div className="min-h-screen bg-gradient-to-r from-blue-800 via-blue-500 to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-2xl shadow-2xl p-8 md:p-16 max-w-4xl w-full flex flex-col md:flex-row gap-10"
      >
        {/* Left Side - Info */}
        <div className="flex-1 flex flex-col justify-center">
          <motion.h1
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold text-gray-800 mb-4"
          >
            Contact Us
          </motion.h1>
          <motion.p
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 mb-6"
          >
            Have a question or want to get in touch? Fill out the form and we will
            reach you soon!
          </motion.p>
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-4 mt-4"
          >
            <a href="#" className="bg-blue-600 p-3 rounded-full hover:bg-blue-700 transition">
              <FaFacebookF className="text-white" />
            </a>
            <a href="#" className="bg-blue-400 p-3 rounded-full hover:bg-blue-500 transition">
              <FaTwitter className="text-white" />
            </a>
            <a href="#" className="bg-pink-500 p-3 rounded-full hover:bg-pink-600 transition">
              <FaInstagram className="text-white" />
            </a>
            <a href="#" className="bg-blue-700 p-3 rounded-full hover:bg-blue-800 transition">
              <FaLinkedinIn className="text-white" />
            </a>
          </motion.div>
        </div>

        {/* Right Side - Form */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          className="flex-1"
        >
          {submitted ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-center p-8 bg-green-100 rounded-xl text-green-700 font-semibold"
            >
              Thank you! Your message has been sent.
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea
                name="message"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-blue-600 text-white font-semibold py-3 rounded-lg mt-2 hover:bg-blue-700 transition"
              >
                Send Message
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>
          
    </div>

    </div>
  );
}

export default Contact;
