export interface UserProfile {
  id: string;
  age: number;
  location: string;
  interests: string[];
  gender: string;
  lookingFor: string[];
  bio: string;
  photos: string[];
  verified: boolean;
  createdAt: Date;
}

export interface MatchScore {
  userId: string;
  score: number;
  reasons: string[];
}

/**
 * Calculate match compatibility score between two users
 * Score is 0-100, higher is better
 */
export function calculateMatchScore(user1: UserProfile, user2: UserProfile): MatchScore {
  let score = 0;
  const reasons: string[] = [];

  // Age compatibility (20 points max)
  const ageDifference = Math.abs(user1.age - user2.age);
  if (ageDifference <= 5) {
    score += 20;
    reasons.push("Similar age");
  } else if (ageDifference <= 10) {
    score += 15;
    reasons.push("Close age range");
  } else if (ageDifference <= 15) {
    score += 10;
    reasons.push("Acceptable age difference");
  }

  // Location proximity (15 points max)
  if (user1.location === user2.location) {
    score += 15;
    reasons.push("Same location");
  } else {
    // Simplified: same country
    const user1Country = user1.location.split(",").pop()?.trim();
    const user2Country = user2.location.split(",").pop()?.trim();
    if (user1Country === user2Country) {
      score += 10;
      reasons.push("Same country");
    } else {
      score += 5;
      reasons.push("Different location");
    }
  }

  // Interests match (30 points max)
  const commonInterests = user1.interests.filter((i) =>
    user2.interests.includes(i)
  );
  const interestScore = (commonInterests.length / Math.max(user1.interests.length, user2.interests.length)) * 30;
  score += interestScore;
  if (commonInterests.length > 0) {
    reasons.push(`${commonInterests.length} shared interests`);
  }

  // Verification status (20 points max)
  if (user1.verified && user2.verified) {
    score += 20;
    reasons.push("Both verified");
  } else if (user1.verified || user2.verified) {
    score += 10;
    reasons.push("One verified");
  }

  // Profile completeness (15 points max)
  const profileCompletion =
    (user1.photos.length / 5 + (user1.bio.length > 100 ? 1 : 0)) / 2;
  score += Math.min(profileCompletion * 15, 15);
  if (user1.photos.length >= 3) {
    reasons.push("Complete profile");
  }

  return {
    userId: user2.id,
    score: Math.min(Math.round(score), 100),
    reasons,
  };
}

/**
 * Get top matches for a user
 */
export function getTopMatches(
  currentUser: UserProfile,
  potentialMatches: UserProfile[],
  limit: number = 10
): MatchScore[] {
  return potentialMatches
    .map((match) => calculateMatchScore(currentUser, match))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Filter users based on preferences
 */
export function filterByPreferences(
  users: UserProfile[],
  preferences: {
    ageMin?: number;
    ageMax?: number;
    locations?: string[];
    interests?: string[];
    verifiedOnly?: boolean;
  }
): UserProfile[] {
  return users.filter((user) => {
    if (preferences.ageMin && user.age < preferences.ageMin) return false;
    if (preferences.ageMax && user.age > preferences.ageMax) return false;
    if (preferences.locations && !preferences.locations.includes(user.location)) {
      return false;
    }
    if (preferences.interests && preferences.interests.length > 0) {
      const hasCommonInterest = user.interests.some((i) =>
        preferences.interests?.includes(i)
      );
      if (!hasCommonInterest) return false;
    }
    if (preferences.verifiedOnly && !user.verified) return false;

    return true;
  });
}

/**
 * Calculate compatibility percentage
 */
export function getCompatibilityPercentage(score: MatchScore): string {
  if (score.score >= 80) return "Excellent Match";
  if (score.score >= 60) return "Good Match";
  if (score.score >= 40) return "Fair Match";
  return "New Connection";
}
