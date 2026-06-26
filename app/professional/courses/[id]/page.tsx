"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import { getCourseById, enrollUserInCourse, updateCourseProgress, type Course } from "@/lib/db/courses";
import Link from "next/link";

interface CourseDetailPageProps {
  params: {
    id: string;
  };
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { id } = params;
  const [course, setCourse] = useState<Course | null>(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showEnrollModal, setShowEnrollModal] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      const courseData = await getCourseById(id);
      setCourse(courseData);
    } catch (error) {
      console.error("Failed to load course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async () => {
    try {
      const userId = "current-user-id"; // Replace with actual user ID
      await enrollUserInCourse(userId, id);
      setIsEnrolled(true);
      setShowEnrollModal(false);
    } catch (error) {
      console.error("Enrollment failed:", error);
    }
  };

  const handleLessonComplete = async () => {
    try {
      const userId = "current-user-id";
      await updateCourseProgress(userId, id, currentLessonIndex + 1);
      const newProgress = ((currentLessonIndex + 1) / (course?.lessons || 1)) * 100;
      setProgress(newProgress);

      if (currentLessonIndex < (course?.lessons || 0) - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg">Course not found</p>
          <Link href="/professional/courses" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            ← Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/professional/courses" className="text-purple-100 hover:text-white mb-4 inline-block">
            ← Back to Courses
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">{course.title}</h1>
          <p className="text-purple-100">By {course.instructor}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Content */}
          <div className="lg:col-span-2">
            {!isEnrolled ? (
              // Course Preview
              <div className="bg-slate-800 rounded-lg overflow-hidden mb-8">
                <div className="h-96 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                  <div className="text-6xl">📚</div>
                </div>
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-4">Course Overview</h2>
                  <p className="text-slate-300 mb-6">{course.description}</p>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Duration</p>
                      <p className="text-white text-xl font-bold">{course.duration / 60} hours</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Lessons</p>
                      <p className="text-white text-xl font-bold">{course.lessons}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Level</p>
                      <p className="text-white text-xl font-bold capitalize">{course.level}</p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <p className="text-slate-400 text-sm">Rating</p>
                      <p className="text-white text-xl font-bold">★ {course.rating}</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">What You'll Learn</h3>
                  <ul className="space-y-2 mb-8">
                    {course.learningOutcomes.map((outcome, idx) => (
                      <li key={idx} className="flex items-start text-slate-300">
                        <span className="text-green-400 mr-3">✓</span>
                        <span>{outcome}</span>
                      </li>
                    ))}
                  </ul>

                  <h3 className="text-lg font-bold text-white mb-3">Skills You'll Gain</h3>
                  <div className="flex flex-wrap gap-2 mb-8">
                    {course.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowEnrollModal(true)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                  >
                    {course.isFree ? "Enroll Free" : `Enroll Now - $${course.price}`}
                  </button>
                </div>
              </div>
            ) : (
              // Lesson Viewer
              <div className="bg-slate-800 rounded-lg overflow-hidden mb-8">
                {/* Video Player */}
                <div className="h-96 bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center relative">
                  <div className="text-6xl">▶️</div>
                  <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded text-white text-sm">
                    Lesson {currentLessonIndex + 1} of {course.lessons}
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    Lesson {currentLessonIndex + 1}: Sample Lesson Title
                  </h2>
                  <p className="text-slate-400 mb-6">Duration: 45 minutes</p>

                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Course Progress</span>
                      <span className="text-purple-400 font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Lesson Description */}
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-white mb-3">Lesson Overview</h3>
                    <p className="text-slate-300 leading-relaxed">
                      This lesson covers the fundamental concepts of web development. You'll learn about HTML structure,
                      CSS styling, and JavaScript interactivity. By the end of this lesson, you'll be able to create a
                      basic website.
                    </p>
                  </div>

                  {/* Transcript */}
                  <div className="mb-8 bg-slate-700 rounded-lg p-4">
                    <h3 className="text-lg font-bold text-white mb-3">Transcript</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      Welcome to this lesson on web development fundamentals. In this video, we'll explore the three
                      core technologies that power the web: HTML, CSS, and JavaScript. HTML provides the structure,
                      CSS handles the styling, and JavaScript adds interactivity...
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <button
                      onClick={handleLessonComplete}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition-all"
                    >
                      Mark as Complete & Next Lesson
                    </button>
                    <button className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-bold hover:bg-slate-600 transition-all">
                      Download Resources
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Instructor Info */}
            <div className="bg-slate-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-4">About the Instructor</h3>
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{course.instructor}</h4>
                  <p className="text-slate-400 mb-3">{course.instructorBio}</p>
                  <p className="text-slate-300">{course.reviews} students enrolled</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Info Card */}
            <div className="bg-slate-800 rounded-lg p-6 sticky top-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Course Details</h3>

              <div className="space-y-4">
                <div>
                  <p className="text-slate-400 text-sm">Category</p>
                  <p className="text-white font-semibold capitalize">{course.category}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Level</p>
                  <p className="text-white font-semibold capitalize">{course.level}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Duration</p>
                  <p className="text-white font-semibold">{course.duration / 60} hours</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Lessons</p>
                  <p className="text-white font-semibold">{course.lessons} lessons</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm">Rating</p>
                  <p className="text-white font-semibold">★ {course.rating} ({course.reviews} reviews)</p>
                </div>
              </div>

              {isEnrolled && (
                <div className="mt-6 pt-6 border-t border-slate-700">
                  <p className="text-green-400 font-bold mb-2">✓ You're enrolled</p>
                  <p className="text-slate-400 text-sm">Continue learning where you left off</p>
                </div>
              )}
            </div>

            {/* Lessons List */}
            {isEnrolled && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Lessons</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {Array.from({ length: course.lessons }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentLessonIndex(idx)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        currentLessonIndex === idx
                          ? "bg-purple-600 text-white"
                          : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{idx < currentLessonIndex ? "✓" : "▶"}</span>
                        <span className="text-sm">Lesson {idx + 1}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enrollment Modal */}
      {showEnrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold text-white mb-4">Confirm Enrollment</h2>
            <p className="text-slate-300 mb-6">
              You're about to enroll in <strong>{course.title}</strong>
            </p>

            <div className="bg-slate-700 rounded-lg p-4 mb-6">
              <p className="text-slate-400 text-sm">Price</p>
              <p className="text-white text-2xl font-bold">
                {course.isFree ? "FREE" : `$${course.price}`}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEnrollModal(false)}
                className="flex-1 px-4 py-2 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleEnroll}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              >
                Enroll Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
