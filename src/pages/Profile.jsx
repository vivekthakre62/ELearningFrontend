import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);


  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">No user found in localStorage</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 to-blue-400 flex items-center justify-center p-6">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 text-center relative"
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <motion.img
          src={user.avatar || "https://i.pravatar.cc/150?img=12"}
          alt={user.fullName}
          className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500 shadow-lg"
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 200 }}
        />

        <motion.h2
          className="text-2xl font-bold text-gray-800 mt-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {user.name}
        </motion.h2>
        <motion.p
          className="text-purple-500 font-semibold mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {user.role}
        </motion.p>

        <motion.p
          className="text-gray-600 mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
         +91 {user.phone || "No Phone no available."}
        </motion.p>
         <motion.p
          className="text-gray-600 mt-4 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {user.email || "No email available."}
        </motion.p>

        <motion.div
          className="flex justify-around mt-6 text-gray-700"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div>
            <p className="font-bold text-lg">{user.courses?.length || 0}</p>
            <p className="text-sm text-gray-500">Courses</p>
          </div>
          <div>
            <p className="font-bold text-lg">{user.followers || 0}</p>
            <p className="text-sm text-gray-500">Learning</p>
          </div>
          <div>
            <p className="font-bold text-lg">{user.following || 0}</p>
            <p className="text-sm text-gray-500">Completed</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-6 flex justify-center gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow hover:bg-purple-600"
            whileHover={{ scale: 1.1 }}
          >
            Edit Profile
          </motion.button>
          <motion.button
            className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600"
            whileHover={{ scale: 1.1 }}
          >
            Follow
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
