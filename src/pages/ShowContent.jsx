import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FileText, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { usePopup } from "../components/PopupProvider";

export default function ShowContent() {
  const { courseId } = useParams();
  const { showPopup } = usePopup();
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/contents/get/${courseId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setContents(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load course contents!");
      } finally {
        setLoading(false);
      }
    };
    fetchContents();
  }, [courseId, token]);

  const openFile = async (fileName, fileType) => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/contents/download/${fileName}`,
        { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" }
      );

      const blob = new Blob([res.data], { type: fileType });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl);
    } catch (err) {
      console.error("Failed to open file:", err);
      showPopup({ message: "Cannot open this file. Please try again!", type: "error" });
    }
  };

  const getFileTypeIcon = (fileName) => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (["pdf"].includes(ext)) return <FileText className="text-red-400 w-8 h-8" />;
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) {
      return <ImageIcon className="text-blue-400 w-8 h-8" />;
    }
    if (["mp4", "mov", "avi"].includes(ext)) {
      return <Video className="text-green-400 w-8 h-8" />;
    }
    return <FileText className="text-gray-400 w-8 h-8" />;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-600">
        <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
        <p className="text-yellow-300 mt-3">Loading contents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-600 text-red-400 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-800 to-blue-600 text-white py-10 px-6 relative">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12"
      >
        <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-transparent bg-clip-text">
          Course Contents
        </span>
      </motion.h1>

      {contents.length === 0 ? (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-gray-300 text-lg">
          No contents uploaded yet for this course.
        </motion.p>
      ) : (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {contents.map((content, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl shadow-2xl border border-white/20 hover:border-yellow-300/50 hover:shadow-yellow-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                {getFileTypeIcon(content.fileName)}
                <h3 className="text-xl font-bold text-yellow-300 truncate">{content.fileName}</h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => openFile(content.fileName, content.fileType)}
                className="w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold rounded-xl shadow-lg hover:shadow-yellow-400/50 transition-all duration-300"
              >
                Open File
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 0.8 }}
        className="absolute top-20 left-10 w-80 h-80 bg-yellow-500 rounded-full blur-3xl animate-pulse"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.15 }}
        transition={{ delay: 1 }}
        className="absolute bottom-20 right-10 w-80 h-80 bg-orange-500 rounded-full blur-3xl animate-pulse"
      ></motion.div>
    </div>
  );
}
