/**
 * Gamification & Viral Growth Loops
 * Implements engagement mechanics and viral features
 */

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points: number;
  condition: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
}

export interface UserAchievements {
  userId: string;
  achievements: Achievement[];
  totalPoints: number;
  level: number;
  streak: number;
}

export interface ViralLoop {
  id: string;
  name: string;
  trigger: string;
  action: string;
  reward: string;
  conversionRate: number;
}

/**
 * Achievement system
 */
export const achievements: Achievement[] = [
  {
    id: "first_match",
    name: "First Match",
    description: "Get your first match",
    icon: "💕",
    points: 10,
    condition: "match_count >= 1",
    rarity: "common",
  },
  {
    id: "matchmaker",
    name: "Matchmaker",
    description: "Get 10 matches",
    icon: "💑",
    points: 50,
    condition: "match_count >= 10",
    rarity: "uncommon",
  },
  {
    id: "conversation_starter",
    name: "Conversation Starter",
    description: "Send your first message",
    icon: "💬",
    points: 5,
    condition: "message_count >= 1",
    rarity: "common",
  },
  {
    id: "chatty",
    name: "Chatty",
    description: "Send 100 messages",
    icon: "🗣️",
    points: 100,
    condition: "message_count >= 100",
    rarity: "rare",
  },
  {
    id: "profile_perfectionist",
    name: "Profile Perfectionist",
    description: "Complete your profile with all details",
    icon: "✨",
    points: 25,
    condition: "profile_completion >= 100",
    rarity: "uncommon",
  },
  {
    id: "photo_enthusiast",
    name: "Photo Enthusiast",
    description: "Upload 5 profile photos",
    icon: "📸",
    points: 20,
    condition: "photo_count >= 5",
    rarity: "uncommon",
  },
  {
    id: "verified_user",
    name: "Verified User",
    description: "Complete email and phone verification",
    icon: "✅",
    points: 15,
    condition: "verified = true",
    rarity: "uncommon",
  },
  {
    id: "job_seeker",
    name: "Job Seeker",
    description: "Apply for 5 jobs",
    icon: "💼",
    points: 30,
    condition: "job_applications >= 5",
    rarity: "uncommon",
  },
  {
    id: "course_master",
    name: "Course Master",
    description: "Complete 3 professional courses",
    icon: "🎓",
    points: 75,
    condition: "courses_completed >= 3",
    rarity: "rare",
  },
  {
    id: "mentor",
    name: "Mentor",
    description: "Mentor 5 users",
    icon: "🤝",
    points: 100,
    condition: "mentees >= 5",
    rarity: "epic",
  },
  {
    id: "week_warrior",
    name: "Week Warrior",
    description: "Maintain 7-day login streak",
    icon: "🔥",
    points: 40,
    condition: "streak >= 7",
    rarity: "rare",
  },
  {
    id: "month_master",
    name: "Month Master",
    description: "Maintain 30-day login streak",
    icon: "🏆",
    points: 200,
    condition: "streak >= 30",
    rarity: "epic",
  },
];

/**
 * Viral growth loops
 */
export const viralLoops: ViralLoop[] = [
  {
    id: "invite_friends",
    name: "Invite Friends",
    trigger: "User completes profile",
    action: "Share referral link with friends",
    reward: "5 bonus credits + 1 month premium for each friend who joins",
    conversionRate: 0.15,
  },
  {
    id: "share_match",
    name: "Share Match",
    trigger: "User gets a match",
    action: "Share match on social media",
    reward: "10 bonus credits + featured profile for 1 week",
    conversionRate: 0.08,
  },
  {
    id: "success_story",
    name: "Success Story",
    trigger: "User in relationship for 3+ months",
    action: "Share success story on platform",
    reward: "Premium subscription for 3 months + featured testimonial",
    conversionRate: 0.05,
  },
  {
    id: "job_referral",
    name: "Job Referral",
    trigger: "User applies for job",
    action: "Refer friend for same job",
    reward: "Bonus credits + priority job recommendations",
    conversionRate: 0.12,
  },
  {
    id: "course_sharing",
    name: "Course Sharing",
    trigger: "User completes course",
    action: "Share course completion on social media",
    reward: "Certificate + 20 bonus credits",
    conversionRate: 0.1,
  },
];

/**
 * Gamification mechanics
 */
export class GamificationEngine {
  /**
   * Calculate user level based on points
   */
  calculateLevel(points: number): number {
    // Level formula: level = floor(sqrt(points / 100)) + 1
    return Math.floor(Math.sqrt(points / 100)) + 1;
  }

  /**
   * Calculate points needed for next level
   */
  pointsForNextLevel(currentLevel: number): number {
    return currentLevel * currentLevel * 100;
  }

  /**
   * Calculate progress to next level
   */
  progressToNextLevel(currentPoints: number, currentLevel: number): number {
    const currentLevelPoints = (currentLevel - 1) * (currentLevel - 1) * 100;
    const nextLevelPoints = currentLevel * currentLevel * 100;
    const progress =
      ((currentPoints - currentLevelPoints) /
        (nextLevelPoints - currentLevelPoints)) *
      100;
    return Math.min(100, Math.max(0, progress));
  }

  /**
   * Award achievement
   */
  awardAchievement(
    achievement: Achievement
  ): { points: number; level: number } {
    return {
      points: achievement.points,
      level: this.calculateLevel(achievement.points),
    };
  }

  /**
   * Calculate streak bonus
   */
  calculateStreakBonus(streak: number): number {
    // Bonus increases by 10% for each day of streak
    return Math.floor(streak * 0.1);
  }

  /**
   * Update login streak
   */
  updateLoginStreak(lastLoginDate: Date, currentDate: Date): number {
    const daysDiff = Math.floor(
      (currentDate.getTime() - lastLoginDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff === 0) {
      return 0; // Already logged in today
    } else if (daysDiff === 1) {
      return 1; // Streak continues
    } else {
      return -1; // Streak broken
    }
  }

  /**
   * Get leaderboard position
   */
  getLeaderboardPosition(
    userPoints: number,
    allUserPoints: number[]
  ): number {
    return (
      allUserPoints.filter((points) => points > userPoints).length + 1
    );
  }

  /**
   * Calculate daily challenge reward
   */
  getDailyChallengeReward(challengeType: string): {
    points: number;
    bonus: number;
  } {
    const rewards: Record<string, { points: number; bonus: number }> = {
      send_message: { points: 5, bonus: 2 },
      complete_profile: { points: 10, bonus: 5 },
      upload_photo: { points: 5, bonus: 2 },
      apply_job: { points: 15, bonus: 7 },
      complete_course: { points: 50, bonus: 25 },
      get_match: { points: 10, bonus: 5 },
      login: { points: 2, bonus: 1 },
    };

    return rewards[challengeType] || { points: 0, bonus: 0 };
  }
}

export const gamificationEngine = new GamificationEngine();

/**
 * Viral loop tracker
 */
export class ViralLoopTracker {
  private conversions: Map<string, number> = new Map();
  private triggers: Map<string, number> = new Map();

  /**
   * Track viral loop trigger
   */
  trackTrigger(loopId: string): void {
    const count = this.triggers.get(loopId) || 0;
    this.triggers.set(loopId, count + 1);
  }

  /**
   * Track viral loop conversion
   */
  trackConversion(loopId: string): void {
    const count = this.conversions.get(loopId) || 0;
    this.conversions.set(loopId, count + 1);
  }

  /**
   * Get viral coefficient
   */
  getViralCoefficient(loopId: string): number {
    const triggers = this.triggers.get(loopId) || 0;
    const conversions = this.conversions.get(loopId) || 0;

    if (triggers === 0) return 0;
    return conversions / triggers;
  }

  /**
   * Get all viral metrics
   */
  getAllMetrics(): Array<{
    loopId: string;
    triggers: number;
    conversions: number;
    coefficient: number;
  }> {
    const metrics = [];

    for (const [loopId] of this.triggers) {
      metrics.push({
        loopId,
        triggers: this.triggers.get(loopId) || 0,
        conversions: this.conversions.get(loopId) || 0,
        coefficient: this.getViralCoefficient(loopId),
      });
    }

    return metrics.sort((a, b) => b.coefficient - a.coefficient);
  }
}

export const viralLoopTracker = new ViralLoopTracker();

/**
 * Daily challenges
 */
export const dailyChallenges = [
  {
    id: "send_message",
    title: "Send a Message",
    description: "Send a message to a match",
    points: 5,
    bonus: 2,
    icon: "💬",
  },
  {
    id: "complete_profile",
    title: "Complete Your Profile",
    description: "Fill in all profile fields",
    points: 10,
    bonus: 5,
    icon: "✨",
  },
  {
    id: "upload_photo",
    title: "Upload a Photo",
    description: "Add a new photo to your profile",
    points: 5,
    bonus: 2,
    icon: "📸",
  },
  {
    id: "apply_job",
    title: "Apply for a Job",
    description: "Apply for a job listing",
    points: 15,
    bonus: 7,
    icon: "💼",
  },
  {
    id: "complete_course",
    title: "Complete a Course",
    description: "Finish a professional development course",
    points: 50,
    bonus: 25,
    icon: "🎓",
  },
  {
    id: "get_match",
    title: "Get a Match",
    description: "Receive a new match",
    points: 10,
    bonus: 5,
    icon: "💕",
  },
  {
    id: "login",
    title: "Daily Login",
    description: "Log in to the app",
    points: 2,
    bonus: 1,
    icon: "🔓",
  },
];

/**
 * Leaderboard system
 */
export class LeaderboardSystem {
  /**
   * Get global leaderboard
   */
  getGlobalLeaderboard(
    users: Array<{ userId: string; points: number; name: string }>,
    limit: number = 100
  ) {
    return users
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        name: user.name,
        points: user.points,
        medal: this.getMedalForRank(index + 1),
      }));
  }

  /**
   * Get regional leaderboard
   */
  getRegionalLeaderboard(
    users: Array<{ userId: string; points: number; name: string; country: string }>,
    country: string,
    limit: number = 50
  ) {
    return users
      .filter((user) => user.country === country)
      .sort((a, b) => b.points - a.points)
      .slice(0, limit)
      .map((user, index) => ({
        rank: index + 1,
        userId: user.userId,
        name: user.name,
        points: user.points,
        medal: this.getMedalForRank(index + 1),
      }));
  }

  /**
   * Get medal for rank
   */
  private getMedalForRank(rank: number): string {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return "⭐";
  }

  /**
   * Get user rank
   */
  getUserRank(
    userId: string,
    users: Array<{ userId: string; points: number }>
  ): number {
    const sorted = users.sort((a, b) => b.points - a.points);
    return sorted.findIndex((user) => user.userId === userId) + 1;
  }
}

export const leaderboardSystem = new LeaderboardSystem();
