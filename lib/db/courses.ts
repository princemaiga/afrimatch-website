import { db } from "@/lib/db/client";

/**
 * Professional Development Courses Schema
 */

export interface Course {
  id: string;
  title: string;
  description: string;
  category: "tech" | "business" | "soft-skills" | "entrepreneurship" | "finance";
  level: "beginner" | "intermediate" | "advanced";
  instructor: string;
  instructorBio: string;
  instructorImage: string;
  thumbnail: string;
  duration: number; // in minutes
  lessons: number;
  rating: number;
  reviews: number;
  price: number;
  currency: string;
  isFree: boolean;
  isPremium: boolean;
  tags: string[];
  skills: string[];
  prerequisites: string[];
  learningOutcomes: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number; // in minutes
  transcript: string;
  resources: string[];
  order: number;
  createdAt: Date;
}

export interface CourseQuiz {
  id: string;
  courseId: string;
  lessonId?: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  createdAt: Date;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: "multiple-choice" | "true-false" | "short-answer";
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export interface CourseCertificate {
  id: string;
  courseId: string;
  userId: string;
  certificateNumber: string;
  issuedAt: Date;
  expiresAt?: Date;
  verificationUrl: string;
}

export interface UserCourseProgress {
  id: string;
  userId: string;
  courseId: string;
  lessonsCompleted: number;
  totalLessons: number;
  progress: number; // percentage
  quizScores: Record<string, number>;
  certificateId?: string;
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
}

/**
 * Sample courses data
 */
export const SAMPLE_COURSES: Course[] = [
  {
    id: "course-001",
    title: "Web Development Fundamentals",
    description:
      "Learn the basics of HTML, CSS, and JavaScript to build modern websites. Perfect for beginners.",
    category: "tech",
    level: "beginner",
    instructor: "John Smith",
    instructorBio: "Senior Web Developer with 15+ years experience",
    instructorImage: "https://ui-avatars.com/api/?name=John+Mensah&background=0369a1&color=fff&size=100",
    thumbnail: "https://ui-avatars.com/api/?name=Web+Dev&background=0369a1&color=fff&size=400&font-size=0.2",
    duration: 1200, // 20 hours
    lessons: 24,
    rating: 4.8,
    reviews: 2340,
    price: 49.99,
    currency: "USD",
    isFree: false,
    isPremium: true,
    tags: ["web", "html", "css", "javascript", "beginner"],
    skills: ["HTML", "CSS", "JavaScript", "Responsive Design"],
    prerequisites: [],
    learningOutcomes: [
      "Build responsive websites",
      "Understand HTML structure",
      "Master CSS styling",
      "Write JavaScript code",
    ],
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "course-002",
    title: "React.js Advanced Patterns",
    description:
      "Master advanced React patterns, hooks, and performance optimization techniques.",
    category: "tech",
    level: "advanced",
    instructor: "Sarah Johnson",
    instructorBio: "React Expert and Open Source Contributor",
    instructorImage: "https://ui-avatars.com/api/?name=Sarah+Okonkwo&background=e11d48&color=fff&size=100",
    thumbnail: "https://ui-avatars.com/api/?name=React&background=7c3aed&color=fff&size=400&font-size=0.2",
    duration: 1800, // 30 hours
    lessons: 36,
    rating: 4.9,
    reviews: 1850,
    price: 79.99,
    currency: "USD",
    isFree: false,
    isPremium: true,
    tags: ["react", "javascript", "advanced", "patterns"],
    skills: ["React Hooks", "Context API", "Performance", "Testing"],
    prerequisites: ["Basic JavaScript", "React Fundamentals"],
    learningOutcomes: [
      "Implement advanced React patterns",
      "Optimize component performance",
      "Master React hooks",
      "Build scalable applications",
    ],
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "course-003",
    title: "Business Communication Skills",
    description:
      "Develop essential communication skills for professional success in the workplace.",
    category: "soft-skills",
    level: "beginner",
    instructor: "Michael Brown",
    instructorBio: "Corporate Communication Coach",
    instructorImage: "https://ui-avatars.com/api/?name=Michael+Eze&background=7c3aed&color=fff&size=100",
    thumbnail: "https://ui-avatars.com/api/?name=Comms&background=047857&color=fff&size=400&font-size=0.2",
    duration: 600, // 10 hours
    lessons: 15,
    rating: 4.7,
    reviews: 3200,
    price: 39.99,
    currency: "USD",
    isFree: false,
    isPremium: false,
    tags: ["communication", "soft-skills", "business"],
    skills: ["Presentation", "Negotiation", "Listening", "Writing"],
    prerequisites: [],
    learningOutcomes: [
      "Improve presentation skills",
      "Master negotiation techniques",
      "Write professional emails",
      "Build confidence",
    ],
    createdAt: new Date("2024-03-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "course-004",
    title: "Entrepreneurship 101",
    description:
      "Start your business journey with this comprehensive guide to entrepreneurship.",
    category: "entrepreneurship",
    level: "beginner",
    instructor: "Emily Davis",
    instructorBio: "Serial Entrepreneur and Business Mentor",
    instructorImage: "https://ui-avatars.com/api/?name=Emily+Hassan&background=047857&color=fff&size=100",
    thumbnail: "https://ui-avatars.com/api/?name=Biz&background=b45309&color=fff&size=400&font-size=0.2",
    duration: 900, // 15 hours
    lessons: 20,
    rating: 4.6,
    reviews: 1500,
    price: 59.99,
    currency: "USD",
    isFree: false,
    isPremium: true,
    tags: ["entrepreneurship", "business", "startup"],
    skills: ["Business Planning", "Fundraising", "Marketing", "Leadership"],
    prerequisites: [],
    learningOutcomes: [
      "Create a business plan",
      "Understand market validation",
      "Learn fundraising basics",
      "Build your startup",
    ],
    createdAt: new Date("2024-04-01"),
    updatedAt: new Date("2024-06-01"),
  },
  {
    id: "course-005",
    title: "Personal Finance Mastery",
    description: "Take control of your finances and build long-term wealth.",
    category: "finance",
    level: "beginner",
    instructor: "David Wilson",
    instructorBio: "Certified Financial Planner",
    instructorImage: "https://ui-avatars.com/api/?name=David+Diallo&background=b45309&color=fff&size=100",
    thumbnail: "https://ui-avatars.com/api/?name=Finance&background=1e3a5f&color=fff&size=400&font-size=0.2",
    duration: 720, // 12 hours
    lessons: 18,
    rating: 4.8,
    reviews: 2100,
    price: 44.99,
    currency: "USD",
    isFree: false,
    isPremium: false,
    tags: ["finance", "money", "investing"],
    skills: ["Budgeting", "Investing", "Retirement Planning", "Tax Planning"],
    prerequisites: [],
    learningOutcomes: [
      "Create a budget",
      "Understand investing basics",
      "Plan for retirement",
      "Build emergency fund",
    ],
    createdAt: new Date("2024-05-01"),
    updatedAt: new Date("2024-06-01"),
  },
];

/**
 * Get all courses
 */
export async function getAllCourses(): Promise<Course[]> {
  // In production, fetch from database
  return SAMPLE_COURSES;
}

/**
 * Get course by ID
 */
export async function getCourseById(courseId: string): Promise<Course | null> {
  const course = SAMPLE_COURSES.find((c) => c.id === courseId);
  return course || null;
}

/**
 * Get courses by category
 */
export async function getCoursesByCategory(
  category: Course["category"]
): Promise<Course[]> {
  return SAMPLE_COURSES.filter((c) => c.category === category);
}

/**
 * Get courses by level
 */
export async function getCoursesByLevel(level: Course["level"]): Promise<Course[]> {
  return SAMPLE_COURSES.filter((c) => c.level === level);
}

/**
 * Search courses
 */
export async function searchCourses(query: string): Promise<Course[]> {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_COURSES.filter(
    (c) =>
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description.toLowerCase().includes(lowerQuery) ||
      c.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get user course progress
 */
export async function getUserCourseProgress(
  userId: string,
  courseId: string
): Promise<UserCourseProgress | null> {
  // In production, fetch from database
  return null;
}

/**
 * Enroll user in course
 */
export async function enrollUserInCourse(
  userId: string,
  courseId: string
): Promise<UserCourseProgress> {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  // In production, save to database
  return {
    id: `progress-${userId}-${courseId}`,
    userId,
    courseId,
    lessonsCompleted: 0,
    totalLessons: course.lessons,
    progress: 0,
    quizScores: {},
    enrolledAt: new Date(),
    lastAccessedAt: new Date(),
  };
}

/**
 * Update course progress
 */
export async function updateCourseProgress(
  userId: string,
  courseId: string,
  lessonsCompleted: number
): Promise<UserCourseProgress> {
  const course = await getCourseById(courseId);
  if (!course) {
    throw new Error("Course not found");
  }

  const progress = (lessonsCompleted / course.lessons) * 100;

  // In production, update database
  return {
    id: `progress-${userId}-${courseId}`,
    userId,
    courseId,
    lessonsCompleted,
    totalLessons: course.lessons,
    progress,
    quizScores: {},
    enrolledAt: new Date(),
    lastAccessedAt: new Date(),
  };
}

/**
 * Complete course and generate certificate
 */
export async function completeCourse(
  userId: string,
  courseId: string
): Promise<CourseCertificate> {
  // In production, save to database
  return {
    id: `cert-${userId}-${courseId}`,
    courseId,
    userId,
    certificateNumber: `AFRIMATCH-${Date.now()}`,
    issuedAt: new Date(),
    verificationUrl: `https://afrimatch.app/verify-certificate/${userId}-${courseId}`,
  };
}
