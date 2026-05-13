import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { usePopup } from "../components/PopupProvider";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiUrl } from "../config/api";

export default function AttemptTest() {
  const { testId } = useParams();
  const { showPopup } = usePopup();

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);

  const baseUrl = apiUrl("/api/question");

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

  useEffect(() => {
    if (submitted) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleSelectOption = (questionId, optionKey) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

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

    showPopup({
      message: `Test submitted! Score: ${calculatedScore}% (${correct}/${total})`,
      type: "success",
      duration: 4500,
    });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pb-16 pt-28 sm:px-6">
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="overflow-hidden rounded-[2rem] border border-stone-300 bg-white shadow-[0_24px_60px_rgba(28,25,23,0.08)]"
        >
          <div className="border-b border-stone-200 bg-stone-50 px-8 py-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Assessment
                </p>
                <h1 className="mt-3 text-4xl font-bold tracking-tight text-stone-800">
                  Test In Progress
                </h1>
                <p className="mt-3 text-sm leading-6 text-stone-500">
                  Read each question carefully and submit before the timer ends.
                </p>
              </div>

              <div
                className={`rounded-2xl border px-5 py-4 text-center ${
                  submitted
                    ? "border-stone-300 bg-stone-100 text-stone-600"
                    : "border-amber-200 bg-amber-50 text-amber-800"
                }`}
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em]">
                  Time Left
                </p>
                <p className="mt-1 text-2xl font-bold">
                  {submitted ? "00:00" : formatTime(timeLeft)}
                </p>
              </div>
            </div>
          </div>

          <div className="px-8 py-8">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center text-stone-500">
                Loading questions...
              </div>
            ) : questions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-stone-300 bg-stone-50 px-6 py-14 text-center text-stone-500">
                No questions found.
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {questions.map((q, index) => (
                    <motion.article
                      key={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-3xl border border-stone-200 bg-stone-50 p-6"
                    >
                      <h3 className="text-lg font-semibold leading-7 text-stone-800">
                        {index + 1}. {q.questionText}
                      </h3>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        {["optionA", "optionB", "optionC", "optionD"].map((optKey) => (
                          <label
                            key={optKey}
                            className={`rounded-2xl border px-4 py-3 text-sm transition-all ${
                              answers[q.id] === optKey.slice(-1)
                                ? "border-amber-700 bg-amber-50 text-stone-900"
                                : "border-stone-300 bg-white text-stone-700 hover:bg-stone-100"
                            } ${submitted ? "cursor-not-allowed opacity-70" : "cursor-pointer"}`}
                          >
                            <input
                              type="radio"
                              name={`question-${q.id}`}
                              value={optKey.slice(-1)}
                              checked={answers[q.id] === optKey.slice(-1)}
                              onChange={() =>
                                handleSelectOption(q.id, optKey.slice(-1))
                              }
                              disabled={submitted}
                              className="hidden"
                            />
                            {q[optKey]}
                          </label>
                        ))}
                      </div>

                      {submitted && (
                        <p className="mt-4 text-sm font-semibold text-green-700">
                          Correct Answer: {q.correctAnswer}
                        </p>
                      )}
                    </motion.article>
                  ))}
                </div>

                {!submitted && (
                  <button
                    onClick={handleSubmit}
                    className="mt-8 w-full rounded-xl bg-stone-900 py-3 font-semibold text-white transition-colors hover:bg-amber-800"
                  >
                    Submit Test
                  </button>
                )}

                {submitted && score !== null && (
                  <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 px-6 py-5 text-center">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-green-700">
                      Result
                    </p>
                    <p className="mt-2 text-3xl font-bold text-green-800">
                      Your Score: {score}%
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </motion.section>
      </div>

      <Footer />
    </div>
  );
}
