import { useState } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

export default function Searchbar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex justify-center mt-20 mb-6">
      <motion.form
        onSubmit={handleSearch}
        className={`relative flex items-center bg-white shadow-lg rounded-full px-4 py-2 transition-all duration-300 ${
          isFocused ? "ring-2 ring-blue-400 shadow-blue-200" : ""
        }`}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 120 }}
      >
        <motion.input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Search for courses..."
          className="outline-none bg-transparent px-3 w-60 sm:w-80 text-gray-700 font-medium"
          whileFocus={{ width: "18rem" }}
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-2 bg-blue-500 hover:bg-blue-600 rounded-full text-white transition-colors duration-300"
        >
          <Search size={20} />
        </motion.button>
      </motion.form>
    </div>
  );
}
