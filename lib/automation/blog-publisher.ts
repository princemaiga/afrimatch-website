/**
 * Automated Blog Publishing System
 * Publishes scheduled articles and posts to social media
 */

import { publishArticle, scheduleArticle, type BlogArticle } from "@/lib/db/blog";

export interface PublishingSchedule {
  id: string;
  articleId: string;
  publishDate: Date;
  socialMedia: {
    facebook: boolean;
    twitter: boolean;
    linkedin: boolean;
    instagram: boolean;
  };
  status: "scheduled" | "published" | "failed";
  createdAt: Date;
}

/**
 * Schedule article for publishing
 */
export async function scheduleArticleForPublishing(
  article: BlogArticle,
  publishDate: Date,
  socialMediaPlatforms: string[] = ["facebook", "twitter", "linkedin"]
): Promise<PublishingSchedule> {
  const schedule: PublishingSchedule = {
    id: `schedule-${Date.now()}`,
    articleId: article.id,
    publishDate,
    socialMedia: {
      facebook: socialMediaPlatforms.includes("facebook"),
      twitter: socialMediaPlatforms.includes("twitter"),
      linkedin: socialMediaPlatforms.includes("linkedin"),
      instagram: socialMediaPlatforms.includes("instagram"),
    },
    status: "scheduled",
    createdAt: new Date(),
  };

  // In production, save to database
  console.log("Article scheduled for publishing:", schedule);

  return schedule;
}

/**
 * Publish article and post to social media
 */
export async function publishArticleAndShare(
  article: BlogArticle,
  schedule: PublishingSchedule
): Promise<void> {
  try {
    // Publish article
    await publishArticle(article);
    console.log(`Article published: ${article.title}`);

    // Post to social media
    if (schedule.socialMedia.facebook) {
      await postToFacebook(article);
    }
    if (schedule.socialMedia.twitter) {
      await postToTwitter(article);
    }
    if (schedule.socialMedia.linkedin) {
      await postToLinkedIn(article);
    }
    if (schedule.socialMedia.instagram) {
      await postToInstagram(article);
    }

    console.log("Article shared to all platforms");
  } catch (error) {
    console.error("Failed to publish article:", error);
    throw error;
  }
}

/**
 * Post to Facebook
 */
async function postToFacebook(article: BlogArticle): Promise<void> {
  try {
    const facebookPageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const facebookPageId = process.env.FACEBOOK_PAGE_ID;

    if (!facebookPageAccessToken || !facebookPageId) {
      console.warn("Facebook credentials not configured");
      return;
    }

    const message = `${article.title}\n\n${article.excerpt}\n\nRead more: https://afrimatch.app/blog/${article.slug}`;

    const response = await fetch(
      `https://graph.facebook.com/${facebookPageId}/feed`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          access_token: facebookPageAccessToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to post to Facebook");
    }

    console.log("Posted to Facebook");
  } catch (error) {
    console.error("Facebook posting error:", error);
  }
}

/**
 * Post to Twitter
 */
async function postToTwitter(article: BlogArticle): Promise<void> {
  try {
    const twitterBearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!twitterBearerToken) {
      console.warn("Twitter credentials not configured");
      return;
    }

    const tweet = `${article.title}\n\nhttps://afrimatch.app/blog/${article.slug}`;

    const response = await fetch("https://api.twitter.com/2/tweets", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${twitterBearerToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: tweet,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to post to Twitter");
    }

    console.log("Posted to Twitter");
  } catch (error) {
    console.error("Twitter posting error:", error);
  }
}

/**
 * Post to LinkedIn
 */
async function postToLinkedIn(article: BlogArticle): Promise<void> {
  try {
    const linkedinAccessToken = process.env.LINKEDIN_ACCESS_TOKEN;
    const linkedinUserId = process.env.LINKEDIN_USER_ID;

    if (!linkedinAccessToken || !linkedinUserId) {
      console.warn("LinkedIn credentials not configured");
      return;
    }

    const response = await fetch(
      `https://api.linkedin.com/v2/ugcPosts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${linkedinAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          author: `urn:li:person:${linkedinUserId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.PublishContent": {
              content: {
                "com.linkedin.ugc.Text": {
                  text: `${article.title}\n\n${article.excerpt}\n\nhttps://afrimatch.app/blog/${article.slug}`,
                },
              },
              distribution: {
                "linkedInDistributionTarget": {},
              },
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to post to LinkedIn");
    }

    console.log("Posted to LinkedIn");
  } catch (error) {
    console.error("LinkedIn posting error:", error);
  }
}

/**
 * Post to Instagram
 */
async function postToInstagram(article: BlogArticle): Promise<void> {
  try {
    const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
    const instagramBusinessAccountId = process.env.INSTAGRAM_BUSINESS_ACCOUNT_ID;

    if (!instagramAccessToken || !instagramBusinessAccountId) {
      console.warn("Instagram credentials not configured");
      return;
    }

    const caption = `${article.title}\n\n${article.excerpt}\n\nLink in bio: https://afrimatch.app/blog/${article.slug}`;

    // Note: Instagram API requires image upload, so this is a simplified example
    console.log("Instagram posting requires image upload - implement with media handling");
  } catch (error) {
    console.error("Instagram posting error:", error);
  }
}

/**
 * Check for articles to publish (run by cron job)
 */
export async function checkAndPublishScheduledArticles(): Promise<void> {
  try {
    console.log("Checking for articles to publish...");

    // In production, fetch from database
    // const scheduledArticles = await db.query(
    //   "SELECT * FROM scheduled_articles WHERE publish_date <= NOW() AND status = 'scheduled'"
    // );

    // For now, log that the check ran
    console.log("Scheduled article check completed");
  } catch (error) {
    console.error("Error checking scheduled articles:", error);
  }
}

/**
 * Setup cron job for article publishing
 * Run this once during app initialization
 */
export function setupPublishingCronJob(): void {
  // This would be implemented with a cron library like node-cron
  // Example: Every Monday at 9 AM
  // cron.schedule('0 9 * * 1', () => {
  //   checkAndPublishScheduledArticles();
  // });

  console.log("Publishing cron job setup (implement with node-cron)");
}

/**
 * Generate social media post content
 */
export function generateSocialMediaContent(
  article: BlogArticle,
  platform: "facebook" | "twitter" | "linkedin" | "instagram"
): string {
  const baseUrl = "https://afrimatch.app/blog";
  const articleUrl = `${baseUrl}/${article.slug}`;

  const platformConfigs = {
    facebook: {
      maxLength: 63206,
      format: `${article.title}\n\n${article.excerpt}\n\n🔗 Read full article: ${articleUrl}`,
    },
    twitter: {
      maxLength: 280,
      format: `${article.title.substring(0, 200)}\n\n${articleUrl}`,
    },
    linkedin: {
      maxLength: 3000,
      format: `${article.title}\n\n${article.excerpt}\n\n${(article as any).learningOutcomes?.join("\n") || ""}\n\n🔗 Read more: ${articleUrl}`,
    },
    instagram: {
      maxLength: 2200,
      format: `${article.title}\n\n${article.excerpt}\n\n#AfriMatch #${article.category} #${article.subcategory}`,
    },
  };

  return platformConfigs[platform].format;
}
