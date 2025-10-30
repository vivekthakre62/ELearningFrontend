import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function ContentUpload() {
  const { courseId } = useParams();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setStatus({ message: "Please choose a file to upload.", type: "error" });
      return;
    }

    const token = localStorage.getItem("token");
    console.log("HII",token);
    if (!token) {
      setStatus({ message: "Unauthorized! Please log in first.", type: "error" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await axios.post(
        `http://localhost:8080/api/contents/upload/${courseId}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      console.log(token);

      setStatus({ message: "Content uploaded successfully!", type: "success" });
      setFile(null);
      e.target.reset();
    } catch (err) {
      console.error("Error uploading content:", err);
      setStatus({
        message: err.response?.data?.message || "Failed to upload. Try again!",
        type: "error",
      });
    }

    setTimeout(() => setStatus({ message: "", type: "" }), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-500 to-gray-900 flex flex-col items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Page Header */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-white mb-10 text-center"
      >
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
          Upload Course Content
        </span>
      </motion.h1>

      {/* Form Container */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
        className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="mb-6"
        >
          <label className="block text-sm text-yellow-200 mb-2 font-semibold">
            Select File
          </label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white/80 text-gray-900 placeholder-gray-500 shadow-inner"
          />
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-bold py-3 rounded-xl shadow-lg hover:shadow-yellow-500/40 transition-all duration-300"
        >
          Upload Content
        </motion.button>

        {/* Status message */}
        {status.message && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-center font-semibold ${
              status.type === "success" ? "text-green-400" : "text-red-400"
            }`}
          >
            {status.message}
          </motion.p>
        )}
      </motion.form>

      {/* Animated Glow Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1 }}
        className="absolute w-96 h-96 bg-yellow-500 rounded-full blur-3xl opacity-10 top-10 left-10 animate-pulse"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{ delay: 1.2 }}
        className="absolute w-96 h-96 bg-orange-500 rounded-full blur-3xl opacity-10 bottom-10 right-10 animate-pulse"
      ></motion.div>
    </div>
  );
}
