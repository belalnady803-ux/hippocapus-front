import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { FiSave, FiX, FiPlus, FiTrash2, FiClock, FiCheckSquare, FiAlertCircle } from "react-icons/fi";
import { API_URL } from "../store/authStore";
import { toast } from "react-hot-toast";

const QuizForm = () => {
  const { courseId, moduleId, videoId, quizId } = useParams();
  const isEditMode = !!quizId;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState({
    title: "",
    timeLimit: 10,
    passingScore: 80,
    questions: [
      {
        question: "",
        options: [
          { option: "", isCorrect: false },
          { option: "", isCorrect: false },
        ],
      },
    ],
  });

  // Check if we're editing an existing quiz
  useEffect(() => {
    const fetchQuiz = async () => {
      if (!isEditMode) return;
      try {
        const { data } = await axios.get(
          `${API_URL}/admin/courses/${moduleId}/${videoId}/quiz/${quizId}`
        );
        if (data && data.data) {
          setQuiz(data.data);
        } else if (data) {
          setQuiz(data);
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        setError("Failed to fetch quiz details.");
        toast.error("Error loading quiz");
      }
    };

    fetchQuiz();
  }, [moduleId, videoId, quizId, isEditMode]);

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
        },
      ],
    }));
  };

  const removeQuestion = (index) => {
    if (quiz.questions.length <= 1) return;
    if (!window.confirm("Are you sure you want to remove this question?")) return;
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
      if (!quiz.title.trim()) throw new Error("Quiz title is required");
      if (quiz.questions.length === 0) throw new Error("At least one question is required");

      for (const [qIndex, question] of quiz.questions.entries()) {
        if (!question.question.trim()) throw new Error(`Question ${qIndex + 1} is missing text`);
        if (question.options.length < 2) throw new Error(`Question ${qIndex + 1} must have at least 2 options`);

        const hasCorrectAnswer = question.options.some((opt) => opt.isCorrect);
        if (!hasCorrectAnswer) throw new Error(`Question ${qIndex + 1} must have one correct answer`);

        for (const [oIndex, option] of question.options.entries()) {
          if (!option.option.trim()) throw new Error(`Option ${oIndex + 1} in Question ${qIndex + 1} is empty`);
        }
      }

      // Save quiz
      // Using endpoints as requested:
      // Add: POST /admin/courses/:moduleId/:videoId/quiz
      // Update: PUT /admin/courses/:moduleId/:videoId/quiz/:quizId
      const endPoint = !isEditMode
        ? `${API_URL}/admin/courses/${moduleId}/${videoId}/quiz`
        : `${API_URL}/admin/courses/${moduleId}/${videoId}/quiz/${quizId}`;

      const method = isEditMode ? "put" : "post";

      await axios[method](endPoint, quiz);

      toast.success(isEditMode ? "Quiz updated successfully" : "Quiz created successfully");
      navigate(`/admin/courses/${courseId}/modules/${moduleId}`);
    } catch (err) {
      console.error("Error saving quiz:", err);
      const msg = err.response?.data?.message || err.message || "Failed to save quiz";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl sm:tracking-tight">
              {isEditMode ? "Edit Quiz" : "Create Quiz"}
            </h1>
            <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">
              {isEditMode ? "Update existing quiz details and questions." : "Design a new quiz for your students."}
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-6 border border-red-200 animate-fade-in">
            <div className="flex">
              <div className="flex-shrink-0">
                <FiAlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Submission Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Quiz Settings Card */}
          <div className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden ring-1 ring-black ring-opacity-5">
            <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white flex items-center">
                <FiCheckSquare className="mr-2" /> Quiz Settings
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Quiz Title
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    value={quiz.title}
                    onChange={handleChange}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                    placeholder="e.g., Module 1 Final Assessment"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="timeLimit" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Time Limit (minutes)
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiClock className="text-gray-400" />
                    </div>
                    <input
                      type="number"
                      name="timeLimit"
                      id="timeLimit"
                      min="1"
                      value={quiz.timeLimit}
                      onChange={handleChange}
                      className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="passingScore" className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Passing Score (%)
                  </label>
                  <div className="mt-1">
                    <input
                      type="number"
                      name="passingScore"
                      id="passingScore"
                      min="0"
                      max="100"
                      value={quiz.passingScore}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-2.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Questions list</h2>
              <button
                type="button"
                onClick={addQuestion}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Question
              </button>
            </div>

            {quiz.questions.map((question, qIndex) => (
              <div
                key={qIndex}
                className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl overflow-hidden ring-1 ring-black ring-opacity-5 transition-all hover:shadow-xl"
              >
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sm:px-6">
                  <h3 className="text-md font-bold text-gray-900 dark:text-white">
                    Question {qIndex + 1}
                  </h3>
                  {quiz.questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      title="Remove Question"
                    >
                      <FiTrash2 className="h-5 w-5" />
                    </button>
                  )}
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Question Text
                    </label>
                    <textarea
                      rows={2}
                      value={question.question}
                      onChange={(e) => handleQuestionChange(qIndex, "question", e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white p-3"
                      placeholder="What is the main concept of...?"
                      required
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Answer Options
                    </label>
                    {question.options.map((option, oIndex) => (
                      <div key={oIndex} className="flex items-start space-x-3 group">
                        <div className="flex-1">
                          <div className="flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                              {String.fromCharCode(65 + oIndex)}
                            </span>
                            <input
                              type="text"
                              value={option.option}
                              onChange={(e) => handleOptionChange(qIndex, oIndex, "option", e.target.value)}
                              className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                              placeholder={`Option ${oIndex + 1}`}
                              required
                            />
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 pt-1">
                          <select
                            value={option.isCorrect.toString()}
                            onChange={(e) => handleOptionChange(qIndex, oIndex, "isCorrect", e.target.value)}
                            className={`
                              block w-32 pl-3 pr-8 py-2 text-base border-gray-300 focus:outline-none sm:text-sm rounded-md
                              ${option.isCorrect
                                ? 'bg-green-50 border-green-300 text-green-700 focus:ring-green-500 focus:border-green-500 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300'
                                : 'dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-blue-500 focus:border-blue-500'}
                            `}
                          >
                            <option value="false">❌ Incorrect</option>
                            <option value="true">✅ Correct</option>
                          </select>

                          {question.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(qIndex, oIndex)}
                              className="text-gray-400 hover:text-red-500 p-2"
                              title="Remove Option"
                            >
                              <FiX className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="mt-2 text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium flex items-center"
                    >
                      <FiPlus className="mr-1 h-4 w-4" /> Add Another Option
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-5 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-bold rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all transform active:scale-95"
            >
              <FiSave className="mr-2 h-5 w-5" />
              {loading ? "Saving..." : "Save Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizForm;
