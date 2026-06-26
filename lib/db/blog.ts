/**
 * Blog System for AfriMatch
 * Community & Professional articles for African professionals and diaspora
 */

export interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "community" | "professional";
  subcategory: string;
  author: string;
  authorBio: string;
  authorImage: string;
  featuredImage: string;
  tags: string[];
  seoKeywords: string[];
  metaDescription: string;
  readTime: number;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogComment {
  id: string;
  articleId: string;
  userId: string;
  userName: string;
  userImage: string;
  content: string;
  likes: number;
  replies: BlogComment[];
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Blog articles — community and professional content only
 */
export const SAMPLE_ARTICLES: BlogArticle[] = [
  {
    id: "article-001",
    title: "How African Professionals Are Building Global Careers from Lagos to London",
    slug: "african-professionals-global-careers",
    excerpt:
      "A new generation of African professionals is redefining what it means to build a global career — without leaving their roots behind.",
    content: `
      <h2>The Rise of the Global African Professional</h2>
      <p>Across Africa and the diaspora, a new generation of professionals is building careers that span continents. From Lagos to London, Nairobi to New York, African talent is increasingly in demand — and increasingly connected.</p>
      
      <h3>Building Your Network Across Borders</h3>
      <p>The first step to a global career is a strong professional network. Platforms like AfriMatch make it possible to connect with mentors, peers, and employers across all 54 African countries and the global diaspora.</p>
      
      <h3>Skills That Travel</h3>
      <p>Technical skills in software engineering, finance, healthcare, and logistics are in demand globally. Pair these with strong communication and cultural intelligence, and you have a profile that stands out anywhere.</p>
      
      <h3>The Diaspora Advantage</h3>
      <p>African professionals in the diaspora bring a unique perspective — deep cultural knowledge combined with international experience. This combination is increasingly valued by global employers.</p>
      
      <h3>Staying Connected to Your Roots</h3>
      <p>Building a global career does not mean losing your identity. Community platforms help you stay connected to your culture, language, and people — wherever you are in the world.</p>
    `,
    category: "professional",
    subcategory: "Career Growth",
    author: "Amara Osei",
    authorBio: "Career strategist and AfriMatch community contributor",
    authorImage: "https://ui-avatars.com/api/?name=Amara+Osei&background=0369a1&color=fff&size=100",
    featuredImage: "https://ui-avatars.com/api/?name=Global+Career&background=0369a1&color=fff&size=800&font-size=0.1",
    tags: ["career", "diaspora", "networking", "professional-development", "africa"],
    seoKeywords: ["African professionals global careers", "African diaspora network", "career growth Africa"],
    metaDescription:
      "How African professionals are building global careers while staying connected to their roots. Career strategies for the African diaspora.",
    readTime: 6,
    views: 5420,
    likes: 1240,
    shares: 620,
    comments: 78,
    published: true,
    publishedAt: new Date("2024-06-10"),
    createdAt: new Date("2024-06-10"),
    updatedAt: new Date("2024-06-10"),
  },
  {
    id: "article-002",
    title: "How to Ace Your Job Interview in Africa's Competitive Market",
    slug: "ace-job-interview-africa",
    excerpt: "Master the art of job interviews with strategies tailored for Africa's fast-growing professional landscape.",
    content: `
      <h2>Mastering the Job Interview</h2>
      <p>Africa's job market is growing fast. Competition is fierce — but so is opportunity. Here is how to stand out in your next interview.</p>
      
      <h3>1. Research the Company Deeply</h3>
      <p>Before your interview, thoroughly research the company. Understand their mission, values, recent news, and culture. For African companies, also understand their regional context and community impact.</p>
      
      <h3>2. Practice Common Questions</h3>
      <p>Prepare answers for common interview questions like "Tell me about yourself" and "Why do you want this job?" Tailor your answers to the African context where relevant.</p>
      
      <h3>3. Prepare Thoughtful Questions</h3>
      <p>Have questions ready to ask the interviewer. This shows genuine interest in the role and the organisation.</p>
      
      <h3>4. Dress Appropriately</h3>
      <p>Dress professionally and appropriately for the company culture. First impressions matter everywhere.</p>
      
      <h3>5. Follow Up</h3>
      <p>Send a thank-you message within 24 hours of your interview. This reinforces your interest and professionalism.</p>
    `,
    category: "professional",
    subcategory: "Career",
    author: "Michael Eze",
    authorBio: "Career coach and HR specialist with 10 years across West Africa",
    authorImage: "https://ui-avatars.com/api/?name=Michael+Eze&background=0369a1&color=fff&size=100",
    featuredImage: "https://ui-avatars.com/api/?name=Job+Interview&background=0369a1&color=fff&size=800&font-size=0.1",
    tags: ["career", "interview", "job-search", "professional-development"],
    seoKeywords: ["job interview tips Africa", "interview preparation", "career advice Africa"],
    metaDescription:
      "Learn how to ace your job interview in Africa's competitive market with proven strategies and expert tips.",
    readTime: 7,
    views: 5620,
    likes: 1240,
    shares: 620,
    comments: 78,
    published: true,
    publishedAt: new Date("2024-06-09"),
    createdAt: new Date("2024-06-09"),
    updatedAt: new Date("2024-06-09"),
  },
  {
    id: "article-003",
    title: "Building Confidence in Professional Settings",
    slug: "building-confidence-professional",
    excerpt: "Strategies to boost your confidence and command respect in the workplace — from Accra to Amsterdam.",
    content: `
      <h2>Confidence in Professional Settings</h2>
      <p>Confidence is key to success in professional environments. Whether you are presenting to executives or networking at events, here is how to build and maintain it.</p>
      
      <h3>1. Know Your Expertise</h3>
      <p>Be confident in your knowledge and skills. Continuous learning reinforces this confidence.</p>
      
      <h3>2. Practice Public Speaking</h3>
      <p>Regular practice reduces anxiety and improves your presentation skills. Join community groups or professional circles to practice.</p>
      
      <h3>3. Maintain Good Posture</h3>
      <p>Body language affects how others perceive you and how you feel about yourself.</p>
      
      <h3>4. Prepare Thoroughly</h3>
      <p>Preparation builds confidence. Know your material inside and out.</p>
      
      <h3>5. Embrace Learning from Setbacks</h3>
      <p>View setbacks as learning opportunities. This mindset builds resilience and long-term confidence.</p>
    `,
    category: "professional",
    subcategory: "Soft Skills",
    author: "Emma Hassan",
    authorBio: "Executive coach and leadership trainer based in Nairobi",
    authorImage: "https://ui-avatars.com/api/?name=Emma+Hassan&background=7c3aed&color=fff&size=100",
    featuredImage: "https://ui-avatars.com/api/?name=Confidence&background=7c3aed&color=fff&size=800&font-size=0.1",
    tags: ["confidence", "soft-skills", "professional-development", "leadership"],
    seoKeywords: ["professional confidence", "workplace skills", "career development Africa"],
    metaDescription:
      "Build confidence in professional settings with these proven strategies for African professionals.",
    readTime: 6,
    views: 4230,
    likes: 980,
    shares: 450,
    comments: 62,
    published: true,
    publishedAt: new Date("2024-06-08"),
    createdAt: new Date("2024-06-08"),
    updatedAt: new Date("2024-06-08"),
  },
  {
    id: "article-004",
    title: "Why the African Diaspora Is Africa's Most Powerful Asset",
    slug: "african-diaspora-powerful-asset",
    excerpt: "Over 170 million Africans live outside the continent. Here is why their connection to home is Africa's greatest competitive advantage.",
    content: `
      <h2>The Diaspora Dividend</h2>
      <p>The African diaspora sends over $90 billion in remittances to the continent every year — more than foreign direct investment and international aid combined. But money is only part of the story.</p>
      
      <h3>Knowledge Transfer</h3>
      <p>Diaspora professionals bring skills, networks, and international experience that can transform industries back home. From healthcare to fintech, diaspora talent is driving innovation across Africa.</p>
      
      <h3>Community Bonds That Endure</h3>
      <p>Despite living thousands of miles away, diaspora Africans maintain deep cultural ties. Language, food, music, and shared values keep communities connected across borders.</p>
      
      <h3>The Role of Community Platforms</h3>
      <p>Digital platforms are making it easier than ever for diaspora Africans to stay connected to their home communities, find mentors, and contribute to Africa's growth — wherever they are in the world.</p>
      
      <h3>Building Bridges, Not Walls</h3>
      <p>The future of Africa is built by Africans — at home and abroad, working together. Community platforms like AfriMatch exist to make those connections easier, more meaningful, and more impactful.</p>
    `,
    category: "community",
    subcategory: "Diaspora",
    author: "Zara Diallo",
    authorBio: "Writer and community advocate focused on African diaspora issues",
    authorImage: "https://ui-avatars.com/api/?name=Zara+Diallo&background=f59e0b&color=fff&size=100",
    featuredImage: "https://ui-avatars.com/api/?name=Diaspora&background=f59e0b&color=fff&size=800&font-size=0.1",
    tags: ["diaspora", "community", "africa", "networking", "culture"],
    seoKeywords: ["African diaspora", "diaspora community", "Africa diaspora network"],
    metaDescription:
      "Why the African diaspora is Africa's most powerful asset — and how community platforms are strengthening those bonds.",
    readTime: 5,
    views: 3890,
    likes: 1100,
    shares: 520,
    comments: 55,
    published: true,
    publishedAt: new Date("2024-06-07"),
    createdAt: new Date("2024-06-07"),
    updatedAt: new Date("2024-06-07"),
  },
  {
    id: "article-005",
    title: "Mentorship in Africa: How to Find the Right Mentor for Your Career",
    slug: "mentorship-africa-find-mentor",
    excerpt: "A great mentor can change the trajectory of your career. Here is how to find, approach, and build a meaningful mentorship in Africa's professional landscape.",
    content: `
      <h2>The Power of Mentorship</h2>
      <p>Research consistently shows that professionals with mentors advance faster, earn more, and report higher job satisfaction. In Africa's rapidly growing economies, mentorship is more valuable than ever.</p>
      
      <h3>What to Look for in a Mentor</h3>
      <p>The best mentors are not necessarily the most famous or successful people in your field. Look for someone who has navigated a path similar to yours, who is genuinely invested in your growth, and who will give you honest feedback.</p>
      
      <h3>How to Approach a Potential Mentor</h3>
      <p>Be specific about what you are looking for. Instead of "Can you be my mentor?", try "I admire your work in X. I am working on Y and would value 30 minutes of your perspective." Respect their time and come prepared.</p>
      
      <h3>Making the Most of Mentorship</h3>
      <p>Come to every session with specific questions. Follow through on advice. Share your progress. A good mentorship is a two-way relationship built on trust and mutual respect.</p>
      
      <h3>Finding Mentors on AfriMatch</h3>
      <p>AfriMatch's Professional platform connects you with experienced mentors across industries and countries. Book 1-on-1 sessions, join group mentorship programmes, and build lasting professional relationships.</p>
    `,
    category: "professional",
    subcategory: "Mentorship",
    author: "Kofi Mensah",
    authorBio: "Executive mentor and founder of the Pan-African Leadership Circle",
    authorImage: "https://ui-avatars.com/api/?name=Kofi+Mensah&background=16a34a&color=fff&size=100",
    featuredImage: "https://ui-avatars.com/api/?name=Mentorship&background=16a34a&color=fff&size=800&font-size=0.1",
    tags: ["mentorship", "career", "professional-development", "africa", "leadership"],
    seoKeywords: ["mentorship Africa", "find mentor Africa", "professional mentorship"],
    metaDescription:
      "How to find the right mentor for your career in Africa. Practical advice for African professionals seeking mentorship.",
    readTime: 8,
    views: 6100,
    likes: 1450,
    shares: 780,
    comments: 92,
    published: true,
    publishedAt: new Date("2024-06-06"),
    createdAt: new Date("2024-06-06"),
    updatedAt: new Date("2024-06-06"),
  },
];

/**
 * Get all blog articles
 */
export async function getAllArticles(): Promise<BlogArticle[]> {
  return SAMPLE_ARTICLES;
}

/**
 * Get articles by category
 */
export async function getArticlesByCategory(
  category: "community" | "professional"
): Promise<BlogArticle[]> {
  return SAMPLE_ARTICLES.filter((a) => a.category === category);
}

/**
 * Get article by slug
 */
export async function getArticleBySlug(slug: string): Promise<BlogArticle | null> {
  return SAMPLE_ARTICLES.find((a) => a.slug === slug) || null;
}

/**
 * Search articles
 */
export async function searchArticles(query: string): Promise<BlogArticle[]> {
  const lowerQuery = query.toLowerCase();
  return SAMPLE_ARTICLES.filter(
    (a) =>
      a.title.toLowerCase().includes(lowerQuery) ||
      a.excerpt.toLowerCase().includes(lowerQuery) ||
      a.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get trending articles (most viewed)
 */
export async function getTrendingArticles(limit = 5): Promise<BlogArticle[]> {
  return [...SAMPLE_ARTICLES]
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

/**
 * Get related articles (same category, excluding current)
 */
export async function getRelatedArticles(articleId: string, limit = 3): Promise<BlogArticle[]> {
  const current = SAMPLE_ARTICLES.find((a) => a.id === articleId);
  if (!current) return [];
  return SAMPLE_ARTICLES
    .filter((a) => a.id !== articleId && a.category === current.category)
    .slice(0, limit);
}

/**
 * Increment article view count (no-op in sample mode)
 */
export async function incrementArticleViews(articleId: string): Promise<void> {
  // No-op for sample data
}

/**
 * Like an article (no-op in sample mode)
 */
export async function likeArticle(articleId: string, userId?: string): Promise<void> {
  // No-op for sample data
}

/**
 * Share an article (no-op in sample mode)
 */
export async function shareArticle(articleId: string): Promise<void> {
  // No-op for sample data
}

/**
 * Add a comment to an article (no-op in sample mode)
 */
export async function addCommentToArticle(
  articleId: string,
  comment: Omit<BlogComment, "id" | "createdAt" | "updatedAt">
): Promise<BlogComment> {
  return {
    ...comment,
    id: `comment-${Date.now()}`,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/**
 * Publish an article (no-op in sample mode)
 */
export async function publishArticle(articleIdOrArticle: string | BlogArticle): Promise<void> {
  // No-op for sample data
}

/**
 * Schedule an article for future publication (no-op in sample mode)
 */
export async function scheduleArticle(articleId: string, publishAt: Date): Promise<void> {
  // No-op for sample data
}
