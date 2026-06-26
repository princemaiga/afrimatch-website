"use client";
export const dynamic = "force-dynamic";

import { useState } from "react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false";
  options: string[];
  correctAnswer: string;
  explanation: string;
}

const SAMPLE_QUIZ: QuizQuestion[] = [
  {
    id: "q1",
    question: "What does HTML stand for?",
    type: "multiple-choice",
    options: [
      "Hyper Text Markup Language",
      "High Tech Modern Language",
      "Home Tool Markup Language",
      "Hyperlinks and Text Markup Language",
    ],
    correctAnswer: "Hyper Text Markup Language",
    explanation:
      "HTML stands for Hyper Text Markup Language. It's the standard markup language used to create web pages.",
  },
  {
    id: "q2",
    question: "CSS is used for styling web pages.",
    type: "true-false",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "CSS (Cascading Style Sheets) is indeed used for styling and layout of web pages. It controls colors, fonts, spacing, and more.",
  },
  {
    id: "q3",
    question: "Which of the following is a JavaScript framework?",
    type: "multiple-choice",
    options: ["React", "Python", "Java", "C++"],
    correctAnswer: "React",
    explanation:
      "React is a popular JavaScript library for building user interfaces. Python, Java, and C++ are programming languages, not JavaScript frameworks.",
  },
  {
    id: "q4",
    question: "What is the purpose of a web server?",
    type: "multiple-choice",
    options: [
      "To serve web pages to clients",
      "To store user passwords",
      "To design websites",
      "To compile code",
    ],
    correctAnswer: "To serve web pages to clients",
    explanation:
      "A web server's primary purpose is to serve web pages and content to clients (users) who request them through their browsers.",
  },
  {
    id: "q5",
    question: "Responsive design means a website works on all device sizes.",
    type: "true-false",
    options: ["True", "False"],
    correctAnswer: "True",
    explanation:
      "Responsive design is an approach to web design that makes web pages render well on a variety of devices and window or screen sizes.",
  },
];

interface QuizPageProps {
  params: {
    id: string;
  };
}

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = params;
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (answer: string) => {
    setAnswers({
      ...answers,
      [SAMPLE_QUIZ[currentQuestion].id]: answer,
    });
  };

  const handleNext = () => {
    if (currentQuestion < SAMPLE_QUIZ.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    SAMPLE_QUIZ.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        correctCount++;
      }
    });
    setScore((correctCount / SAMPLE_QUIZ.length) * 100);
    setShowResults(true);
  };

  const question = SAMPLE_QUIZ[currentQuestion];
  const isAnswered = answers[question.id] !== undefined;
  const isLastQuestion = currentQuestion === SAMPLE_QUIZ.length - 1;
  const allAnswered = Object.keys(answers).length === SAMPLE_QUIZ.length;

  if (showResults) {
    const passed = score >= 70;
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full text-center">
          <div className={`text-6xl mb-4 ${passed ? "text-green-400" : "text-red-400"}`}>
            {passed ? "🎉" : "📚"}
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">
            {passed ? "Congratulations!" : "Keep Learning!"}
          </h1>

          <div className="text-5xl font-bold text-purple-400 mb-2">{Math.round(score)}%</div>

          <p className="text-slate-300 mb-6">
            You answered {Object.keys(answers).length} out of {SAMPLE_QUIZ.length} questions correctly.
          </p>

          {passed && (
            <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 mb-6">
              <p className="text-green-400 font-semibold">✓ Quiz Passed!</p>
              <p className="text-green-300 text-sm mt-1">You've earned a certificate for this course.</p>
            </div>
          )}

          {!passed && (
            <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-4 mb-6">
              <p className="text-yellow-400 font-semibold">⚠ Quiz Not Passed</p>
              <p className="text-yellow-300 text-sm mt-1">You need 70% to pass. Try again!</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => {
                setCurrentQuestion(0);
                setAnswers({});
                setShowResults(false);
                setScore(0);
              }}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold transition-all"
            >
              Retake Quiz
            </button>
            <Link
              href={`/professional/courses/${id}`}
              className="block bg-slate-700 hover:bg-slate-600 text-white py-2 rounded-lg font-bold transition-all"
            >
              Back to Course
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/professional/courses/${id}`} className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
            ← Back to Course
          </Link>
          <h1 className="text-3xl font-bold text-white">Course Quiz</h1>
        </div>

        {/* Progress */}
        <div className="bg-slate-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-300">
              Question {currentQuestion + 1} of {SAMPLE_QUIZ.length}
            </span>
            <span className="text-purple-400 font-bold">{Math.round(((currentQuestion + 1) / SAMPLE_QUIZ.length) * 100)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / SAMPLE_QUIZ.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-slate-800 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-8">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`w-full text-left px-6 py-4 rounded-lg border-2 transition-all ${
                  answers[question.id] === option
                    ? "border-purple-600 bg-purple-600/20 text-white"
                    : "border-slate-600 bg-slate-700 text-slate-300 hover:border-purple-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answers[question.id] === option
                        ? "border-purple-600 bg-purple-600"
                        : "border-slate-500"
                    }`}
                  >
                    {answers[question.id] === option && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                  <span>{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Explanation (shown after answer) */}
          {isAnswered && (
            <div
              className={`rounded-lg p-4 mb-8 ${
                answers[question.id] === question.correctAnswer
                  ? "bg-green-500/20 border border-green-500"
                  : "bg-red-500/20 border border-red-500"
              }`}
            >
              <p className={`font-semibold mb-2 ${answers[question.id] === question.correctAnswer ? "text-green-400" : "text-red-400"}`}>
                {answers[question.id] === question.correctAnswer ? "✓ Correct!" : "✗ Incorrect"}
              </p>
              <p className="text-slate-300">{question.explanation}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            ← Previous
          </button>

          {isLastQuestion ? (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isAnswered}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          )}
        </div>

        {/* Question Navigator */}
        <div className="mt-8 bg-slate-800 rounded-lg p-6">
          <p className="text-slate-300 font-semibold mb-4">Jump to Question</p>
          <div className="grid grid-cols-5 gap-2">
            {SAMPLE_QUIZ.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`aspect-square rounded-lg font-bold transition-all ${
                  currentQuestion === idx
                    ? "bg-purple-600 text-white"
                    : answers[SAMPLE_QUIZ[idx].id]
                    ? "bg-green-600 text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
