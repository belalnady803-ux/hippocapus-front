import { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../store/authStore";
import { FiClock, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-hot-toast";

const QuizPlayer = ({ quiz, onClose }) => {
    // Initialize state from localStorage if available
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
        try {
            const saved = localStorage.getItem(`quiz_progress_${quiz._id}`);
            return saved ? JSON.parse(saved).currentQuestionIndex : 0;
        } catch (e) { return 0; }
    });

    const [answers, setAnswers] = useState(() => {
        try {
            const saved = localStorage.getItem(`quiz_progress_${quiz._id}`);
            return saved ? JSON.parse(saved).answers : {};
        } catch (e) { return {}; }
    });

    const [timeLeft, setTimeLeft] = useState(() => {
        try {
            const saved = localStorage.getItem(`quiz_progress_${quiz._id}`);
            return saved ? JSON.parse(saved).timeLeft : quiz.timeLimit * 60;
        } catch (e) { return quiz.timeLimit * 60; }
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState(null); // { score, isPassed, details: [...] }
    const [isReviewing, setIsReviewing] = useState(false);
    const [fadeKey, setFadeKey] = useState(0); // For animation reset

    const currentQuestion = quiz.questions[currentQuestionIndex];

    // Persist progress
    useEffect(() => {
        if (!result && !isSubmitting) {
            localStorage.setItem(`quiz_progress_${quiz._id}`, JSON.stringify({
                currentQuestionIndex,
                answers,
                timeLeft
            }));
        }
    }, [currentQuestionIndex, answers, timeLeft, result, isSubmitting, quiz._id]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (result) return;

            if (e.key === "ArrowRight") {
                if (currentQuestionIndex < quiz.questions.length - 1) handleNext();
            } else if (e.key === "ArrowLeft") {
                if (currentQuestionIndex > 0) handlePrevious();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [currentQuestionIndex, quiz.questions.length, result]);

    // Timer logic
    useEffect(() => {
        if (result || timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, result]);

    const handleOptionSelect = (optionId) => {
        if (result) return; // Prevent changing answers after submission
        setAnswers((prev) => ({
            ...prev,
            [currentQuestion._id]: optionId,
        }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setFadeKey(prev => prev + 1);
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setFadeKey(prev => prev + 1);
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleRetake = () => {
        if (window.confirm("Are you sure you want to retake the quiz? All previous progress will be reset.")) {
            // Clear storage
            localStorage.removeItem(`quiz_progress_${quiz._id}`);

            // Reset state
            setResult(null);
            setIsReviewing(false);
            setAnswers({});
            setCurrentQuestionIndex(0);
            setTimeLeft(quiz.timeLimit * 60);
            setIsSubmitting(false);
            setFadeKey(prev => prev + 1);
        }
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            const payload = {
                answers: Object.entries(answers).map(([questionId, optionId]) => ({
                    questionId,
                    optionId,
                })),
            };

            const response = await axios.post(`${API_URL}/quizzes/${quiz._id}/submit`, payload);

            // Clear storage on successful submission
            localStorage.removeItem(`quiz_progress_${quiz._id}`);

            setResult(response.data.data);
        } catch (err) {
            console.error("Quiz submission error:", err);
            toast.error("Failed to submit quiz. Please try again.");
            setIsSubmitting(false); // Re-enable if failed
        }
    };

    // Format time as MM:SS
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    // Render Result View
    if (result) {
        if (isReviewing) {
            return (
                <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col overflow-hidden animate-fade-in">
                    <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center z-10">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quiz Review</h2>
                        <button
                            onClick={() => setIsReviewing(false)}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <FiXCircle className="w-8 h-8" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-8">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {result.details?.map((detail, index) => {
                                const question = quiz.questions.find(q => q._id === detail.questionId);
                                if (!question) return null;

                                return (
                                    <div key={detail.questionId} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                                        <div className="flex items-start gap-4 mb-6">
                                            <span className={`
                                                flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-bold text-white
                                                ${detail.isCorrect ? 'bg-green-500' : 'bg-red-500'}
                                            `}>
                                                {index + 1}
                                            </span>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                                    {question.question}
                                                </h3>

                                                <div className="space-y-3">
                                                    {question.options.map((option) => {
                                                        const isSelected = option._id === detail.userOptionId;
                                                        const isCorrect = option._id === detail.correctOptionId;

                                                        let borderColor = 'border-gray-200 dark:border-gray-700';
                                                        let bgColor = 'hover:bg-gray-50 dark:hover:bg-gray-700';
                                                        let icon = null;

                                                        if (isCorrect) {
                                                            borderColor = 'border-green-500';
                                                            bgColor = 'bg-green-50 dark:bg-green-900/20';
                                                            icon = <FiCheckCircle className="text-green-500 w-5 h-5" />;
                                                        } else if (isSelected && !detail.isCorrect) {
                                                            borderColor = 'border-red-500';
                                                            bgColor = 'bg-red-50 dark:bg-red-900/20';
                                                            icon = <FiXCircle className="text-red-500 w-5 h-5" />;
                                                        } else if (isSelected) {
                                                            // Correctly selected (already covered by isCorrect check usually, 
                                                            // but if user selected correct, styling is green)
                                                            borderColor = 'border-green-500';
                                                            bgColor = 'bg-green-50 dark:bg-green-900/20';
                                                        }

                                                        return (
                                                            <div
                                                                key={option._id}
                                                                className={`
                                                                    p-4 rounded-lg border-2 flex items-center justify-between
                                                                    ${borderColor} ${bgColor} transition-colors
                                                                `}
                                                            >
                                                                <span className="text-gray-700 dark:text-gray-200 font-medium">
                                                                    {option.option}
                                                                </span>
                                                                {icon}
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                {detail.explanation && (
                                                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200">
                                                        <span className="font-bold block mb-1">Explanation:</span>
                                                        {detail.explanation}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-4 shadow-lg flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Close Quiz
                        </button>
                    </div>
                </div>
            );
        }

        const isPassed = result.isPassed;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full p-8 text-center">
                    <div className="mb-6 flex justify-center">
                        {isPassed ? (
                            <FiCheckCircle className="w-20 h-20 text-green-500" />
                        ) : (
                            <FiXCircle className="w-20 h-20 text-red-500" />
                        )}
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {isPassed ? "Congratulations!" : "Keep Trying!"}
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        You scored <span className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{result.score}%</span>
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">Total Questions</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.totalQuestions}</p>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
                            <p className="text-gray-500 dark:text-gray-400">Correct Answers</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{result.correctAnswers}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => setIsReviewing(true)}
                            className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            Review Quiz
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={handleRetake}
                                className="flex-1 px-4 py-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                Retake Quiz
                            </button>
                            <button
                                onClick={onClose}
                                className="flex-1 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 z-50 flex flex-col animate-fade-in">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">{quiz.title}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Question {currentQuestionIndex + 1} of {quiz.questions.length}
                    </p>
                </div>
                <div className={`flex items-center gap-2 text-xl font-mono font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-blue-600'}`}>
                    <FiClock />
                    {formatTime(timeLeft)}
                </div>
            </div>

            {/* Question Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 flex items-center justify-center">
                <div key={fadeKey} className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 animate-fade-in">
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                            {currentQuestion.question}
                        </h3>

                        <div className="space-y-4">
                            {currentQuestion.options.map((option) => (
                                <div
                                    key={option._id}
                                    onClick={() => handleOptionSelect(option._id)}
                                    className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all flex items-center gap-3
                    ${answers[currentQuestion._id] === option._id
                                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-500'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-800'}
                  `}
                                >
                                    <div className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                    ${answers[currentQuestion._id] === option._id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'}
                  `}>
                                        {answers[currentQuestion._id] === option._id && (
                                            <div className="w-2.5 h-2.5 rounded-full bg-white" />
                                        )}
                                    </div>
                                    <span className="text-lg text-gray-700 dark:text-gray-200">{option.option}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Navigation */}
            <div className="bg-white dark:bg-gray-800 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-between max-w-full">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="px-6 py-2 rounded-lg text-gray-700 dark:text-gray-200 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-8 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-70 transition-colors flex items-center gap-2"
                    >
                        {isSubmitting ? "Submitting..." : "Finish Quiz"}
                        {!isSubmitting && <FiCheckCircle />}
                    </button>
                ) : (
                    <button
                        onClick={handleNext}
                        className="px-8 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Next
                    </button>
                )}
            </div>

            {/* Exit Button - Top Right Absolute */}
            <button
                onClick={() => {
                    if (window.confirm("Are you sure you want to quit? Your progress will be lost.")) {
                        onClose();
                    }
                }}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Quit Quiz"
            >
                <FiXCircle className="w-8 h-8" />
            </button>
        </div>
    );
};

export default QuizPlayer;
