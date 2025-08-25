import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { FiSave, FiX, FiPlus, FiTrash2 } from "react-icons/fi";
import { API_URL } from "../store/authStore";

const QuizForm = () => {
  const { courseId, moduleId, videoId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState({
    title: "",
    timeLimit: 30, // in minutes
    passingScore: 70, // percentage
    questions: [
      {
        question: "",
        options: [
          { option: "", isCorrect: false },
          { option: "", isCorrect: false },
        ],
        explanation: "",
      },
    ],
  });

  // Check if we're editing an existing quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/admin/courses/${courseId}/modules/${moduleId}/videos/${videoId}/quiz`
        );
        if (data) {
          setQuiz(data);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        // If quiz doesn't exist, we'll create a new one
      }
    };

    fetchQuiz();
  }, [courseId, moduleId, videoId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuiz((prev) => ({
      ...prev,
      [name]: name === "timeLimit" || name === "passingScore" ? Number(value) : value,
    }));
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value,
    };
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleOptionChange = (questionIndex, optionIndex, field, value) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options[optionIndex][field] = 
      field === "isCorrect" ? value === "true" : value;
    
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addQuestion = () => {
    setQuiz((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: [
            { option: "", isCorrect: false },
            { option: "", isCorrect: false },
          ],
          explanation: "",
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length <= 1) return;
    const updatedQuestions = [...quiz.questions];
    updatedQuestions.splice(index, 1);
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const addOption = (questionIndex) => {
    const updatedQuestions = [...quiz.questions];
    updatedQuestions[questionIndex].options.push({
      option: "",
      isCorrect: false,
    });
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...quiz.questions];
    if (updatedQuestions[questionIndex].options.length <= 2) return;
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    setQuiz((prev) => ({
      ...prev,
      questions: updatedQuestions,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate quiz
      if (!quiz.title.trim()) {
        throw new Error("Quiz title is required");
      }

      if (quiz.questions.length === 0) {
        throw new Error("At least one question is required");
      }

      for (const [qIndex, question] of quiz.questions.entries()) {
        if (!question.question.trim()) {
          throw new Error(`Question ${qIndex + 1} is missing text`);
        }

        if (question.options.length < 2) {
          throw new Error("Each question must have at least 2 options");
        }

        const hasCorrectAnswer = question.options.some((opt) => opt.isCorrect);
        if (!hasCorrectAnswer) {
          throw new Error(`Question ${qIndex + 1} must have at least one correct answer`);
        }

        for (const [oIndex, option] of question.options.entries()) {
          if (!option.option.trim()) {
            throw new Error(`Option ${oIndex + 1} in Question ${qIndex + 1} is empty`);
          }
        }
      }

      // Save quiz
      await axios.post(
        `${API_URL}/admin/courses/${moduleId}/${videoId}/quiz`,
        quiz
      );

      navigate(`/admin/courses/${courseId}/modules/${moduleId}`);
    } catch (err) {
      console.error("Error saving quiz:", err);
      setError(err.response?.data?.message || err.message || "Failed to save quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {quiz._id ? "Edit Quiz" : "Create New Quiz"}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Create or update a quiz for this video
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Quiz Details
            </h2>

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Quiz Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={quiz.title}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="timeLimit"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Time Limit (minutes)
                  </label>
                  <input
                    type="number"
                    id="timeLimit"
                    name="timeLimit"
                    min="1"
                    value={quiz.timeLimit}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="passingScore"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Passing Score (%)
                  </label>
                  <input
                    type="number"
                    id="passingScore"
                    name="passingScore"
                    min="1"
                    max="100"
                    value={quiz.passingScore}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Questions
              </h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="mr-1 h-3 w-3" /> Add Question
              </button>
            </div>

            {quiz.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg p-6"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-md font-medium text-gray-900 dark:text-white">
                    Question {qIndex + 1}
                  </h3>
                  {quiz.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Remove question"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`question-${qIndex}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Question Text <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id={`question-${qIndex}`}
                    value={question.question}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "question", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    required
                  />
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Options <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                    >
                      <FiPlus className="mr-1 h-3 w-3" /> Add Option
                    </button>
                  </div>

                  <div className="mt-2 space-y-2">
                    {question.options.map((option, oIndex) => (
                      <div
                        key={oIndex}
                        className="flex items-center space-x-3"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            value={option.option}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                "option",
                                e.target.value
                              )
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                            placeholder={`Option ${oIndex + 1}`}
                            required
                          />
                        </div>
                        <div className="flex items-center">
                          <select
                            value={option.isCorrect.toString()}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                oIndex,
                                "isCorrect",
                                e.target.value
                              )
                            }
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                          >
                            <option value="false">Incorrect</option>
                            <option value="true">Correct</option>
                          </select>
                        </div>
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(qIndex, oIndex)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            title="Remove option"
                          >
                            <FiTrash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label
                    htmlFor={`explanation-${qIndex}`}
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    Explanation (optional)
                  </label>
                  <textarea
                    id={`explanation-${qIndex}`}
                    rows={2}
                    value={question.explanation}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "explanation", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                    placeholder="Add an explanation for the correct answer"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
            >
              <FiX className="mr-2 h-4 w-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
