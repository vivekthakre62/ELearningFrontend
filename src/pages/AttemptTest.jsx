import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function AttemptTest() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const baseUrl = "http://localhost:8080/api/question";

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/show/${testId}`);
      setQuestions(res.data);
    } catch (err) {
      console.error("Error fetching questions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [testId]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return; // stop timer after submission

    if (timeLeft <= 0) {
      handleSubmit(); // auto-submit
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  // Select option (store key "A"|"B"|"C"|"D")
  const handleSelectOption = (questionId, optionKey) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  // Submit answers
  const handleSubmit = () => {
    if (submitted) return;

    let correct = 0;
    questions.forEach((q) => {
      if (answers[q.id] && answers[q.id] === q.correctAnswer) correct++;
    });

    const total = questions.length;
    const calculatedScore = Math.round((correct / total) * 100);

    setScore(calculatedScore);
    setSubmitted(true);

    alert(`✅ Test Submitted!\nScore: ${calculatedScore}% (${correct}/${total})`);
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-10 px-6 flex flex-col items-center">
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-indigo-800 mb-6"
      >
        📝 Test In Progress
      </motion.h1>

      {/* Timer */}
      <div
        className={`px-5 py-3 rounded-full mb-6 text-xl font-semibold ${
          submitted ? "bg-gray-300 text-gray-700" : "bg-red-500 text-white"
        }`}
      >
        ⏰ Time Left: {submitted ? "00:00" : formatTime(timeLeft)}
      </div>

      {loading ? (
        <p className="text-gray-600">Loading questions...</p>
      ) : questions.length === 0 ? (
        <p className="text-gray-600">No questions found.</p>
      ) : (
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-6">
          {questions.map((q, index) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 border-b pb-4"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {index + 1}. {q.questionText}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {["optionA", "optionB", "optionC", "optionD"].map((optKey) => (
                  <label
                    key={optKey}
                    className={`border rounded-lg px-4 py-2 cursor-pointer transition-all ${
                      answers[q.id] === optKey.slice(-1)
                        ? "bg-indigo-100 border-indigo-500"
                        : "bg-gray-50 hover:bg-gray-100"
                    } ${submitted ? "opacity-60 cursor-not-allowed" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`question-${q.id}`}
                      value={optKey.slice(-1)}
                      checked={answers[q.id] === optKey.slice(-1)}
                      onChange={() => handleSelectOption(q.id, optKey.slice(-1))}
                      disabled={submitted}
                      className="hidden"
                    />
                    {q[optKey]}
                  </label>
                ))}
              </div>

              {submitted && (
                <p className="mt-2 font-medium text-green-600">
                  ✅ Correct Answer: {q.correctAnswer}
                </p>
              )}
            </motion.div>
          ))}

          {!submitted && (
            <button
              onClick={handleSubmit}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all mt-4"
            >
              Submit Test
            </button>
          )}

          {submitted && score !== null && (
            <p className="text-center mt-4 text-xl font-bold text-green-700">
              🎉 Your Score: {score}%
            </p>
          )}
        </div>
      )}
    </div>
  );
}
