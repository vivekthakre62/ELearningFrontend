import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, Trash2, Edit3, Save, X } from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { usePopup } from "../components/PopupProvider";

export default function Question() {
  const { testId } = useParams();
  const { showPopup, confirm } = usePopup();
  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/question/show/${testId}`,
        { headers }
      );

      const questionsArray = Array.isArray(res.data) ? res.data : [res.data];
      setQuestions(questionsArray);
    } catch (err) {
      console.error("Error fetching questions:", err);
      showPopup({
        message: "Failed to load questions. Check token or permissions.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();

    if (!newQuestion.questionText.trim()) {
      showPopup({ message: "Enter question text!", type: "warning" });
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        `http://localhost:8080/api/question/add/${testId}`,
        newQuestion,
        { headers }
      );
      setNewQuestion({
        questionText: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      });
      fetchQuestions();
      showPopup({ message: "Question added successfully!", type: "success" });
    } catch (err) {
      console.error("Error adding question:", err);
      showPopup({
        message: "Failed to add question. Check JWT or permissions.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    const confirmed = await confirm({
      title: "Delete this question?",
      message: "This question will be removed from the test permanently.",
      confirmText: "Delete",
      type: "error",
    });
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/api/question/delete/${id}`, {
        headers,
      });
      setQuestions((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      console.error("Error deleting question:", err);
      showPopup({ message: "Failed to delete question", type: "error" });
    }
  };

  const handleUpdateQuestion = async (index) => {
    const q = questions[index];

    const updatedQuestion = {
      questionText: q.questionText,
      optionA: q.optionA,
      optionB: q.optionB,
      optionC: q.optionC,
      optionD: q.optionD,
      correctAnswer: q.correctAnswer,
    };

    try {
      setLoading(true);
      await axios.put(
        `http://localhost:8080/api/question/update/${q.id}`,
        updatedQuestion,
        { headers }
      );

      const updatedList = [...questions];
      updatedList[index] = { ...q };
      setQuestions(updatedList);
      setEditingIndex(null);
      showPopup({ message: "Question updated successfully!", type: "success" });
    } catch (err) {
      console.error("Error updating question:", err);
      showPopup({
        message: "Failed to update question. Please try again.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (index, field, value) => {
    const updated = [...questions];
    updated[index][field] = value;
    setQuestions(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-10 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-extrabold text-indigo-800 mb-8 drop-shadow-md"
      >
        Manage Questions for Test #{testId}
      </motion.h1>

      <motion.form
        onSubmit={handleAddQuestion}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white shadow-2xl rounded-2xl p-6 w-full max-w-3xl mb-10 border border-gray-100"
      >
        <h2 className="text-lg font-semibold mb-3 text-gray-700 flex items-center gap-2">
          <PlusCircle className="text-green-500" /> Add New Question
        </h2>

        <textarea
          placeholder="Enter your question..."
          value={newQuestion.questionText}
          onChange={(e) => setNewQuestion({ ...newQuestion, questionText: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {["A", "B", "C", "D"].map((opt) => (
            <input
              key={opt}
              type="text"
              placeholder={`Option ${opt}`}
              value={newQuestion[`option${opt}`]}
              onChange={(e) => setNewQuestion({ ...newQuestion, [`option${opt}`]: e.target.value })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          ))}
        </div>

        <div className="mt-4">
          <label className="font-medium text-gray-700">Correct Answer:</label>
          <select
            value={newQuestion.correctAnswer}
            onChange={(e) => setNewQuestion({ ...newQuestion, correctAnswer: e.target.value })}
            className="ml-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
          >
            <option value="">Select</option>
            {["A", "B", "C", "D"].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md transition-all w-full"
        >
          {loading ? "Saving..." : "Add Question"}
        </button>
      </motion.form>

      <div className="w-full max-w-5xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">All Questions</h2>

        {loading ? (
          <p className="text-gray-500 text-center">Loading...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-600 text-center italic">No questions yet...</p>
        ) : (
          <AnimatePresence>
            {questions.map((q, index) => (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="bg-white shadow-md rounded-xl p-5 mb-4 border border-gray-200 relative"
              >
                {editingIndex === index ? (
                  <>
                    <textarea
                      value={q.questionText}
                      onChange={(e) => handleEditChange(index, "questionText", e.target.value)}
                      className="w-full border rounded-lg px-4 py-2 mb-3 focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {["A", "B", "C", "D"].map((opt) => (
                        <input
                          key={opt}
                          type="text"
                          value={q[`option${opt}`]}
                          onChange={(e) => handleEditChange(index, `option${opt}`, e.target.value)}
                          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                        />
                      ))}
                    </div>

                    <div className="mt-3">
                      <label className="font-medium text-gray-700">Correct Answer:</label>
                      <select
                        value={q.correctAnswer}
                        onChange={(e) => handleEditChange(index, "correctAnswer", e.target.value)}
                        className="ml-2 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-400 outline-none"
                      >
                        <option value="">Select</option>
                        {["A", "B", "C", "D"].map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleUpdateQuestion(index)}
                        className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition"
                      >
                        <Save size={18} /> Save
                      </button>
                      <button
                        onClick={() => setEditingIndex(null)}
                        className="flex items-center gap-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-medium transition"
                      >
                        <X size={18} /> Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="font-semibold text-lg text-indigo-700 mb-2">{q.questionText}</h3>
                    <ul className="text-gray-700 mb-2 list-disc ml-5">
                      <li>A. {q.optionA}</li>
                      <li>B. {q.optionB}</li>
                      <li>C. {q.optionC}</li>
                      <li>D. {q.optionD}</li>
                    </ul>
                    <p className="font-medium text-green-600">
                      Correct Answer: {q.correctAnswer}
                    </p>

                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => setEditingIndex(index)}
                        className="flex items-center gap-1 text-yellow-600 hover:text-yellow-700 transition"
                      >
                        <Edit3 size={18} /> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="flex items-center gap-1 text-red-600 hover:text-red-700 transition"
                      >
                        <Trash2 size={18} /> Delete
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
