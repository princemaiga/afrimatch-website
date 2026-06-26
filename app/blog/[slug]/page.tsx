"use client";
export const dynamic = "force-dynamic";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getArticleBySlug, getRelatedArticles, incrementArticleViews, likeArticle, shareArticle, addCommentToArticle, type BlogArticle } from "@/lib/db/blog";

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = params;
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<BlogArticle[]>([]);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticle();
  }, [slug]);

  const loadArticle = async () => {
    try {
      const articleData = await getArticleBySlug(slug);
      if (articleData) {
        setArticle(articleData);
        await incrementArticleViews(articleData.id);

        const related = await getRelatedArticles(articleData.id);
        setRelatedArticles(related);
      }
    } catch (error) {
      console.error("Failed to load article:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (article) {
      await likeArticle(article.id);
      setLiked(!liked);
      setArticle({
        ...article,
        likes: article.likes + (liked ? -1 : 1),
      });
    }
  };

  const handleShare = async (platform: string) => {
    if (article) {
      await shareArticle(article.id);
      const url = `https://afrimatch.app/blog/${article.slug}`;
      const title = article.title;

      const shareUrls: Record<string, string> = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      };

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], "_blank");
      }
    }
  };

  const handleAddComment = async () => {
    if (article && newComment.trim()) {
      const comment = await addCommentToArticle(article.id, {
        articleId: article.id,
        userId: "current-user-id",
        userName: "Current User",
        userImage: "https://ui-avatars.com/api/?name=User&background=f59e0b&color=fff&size=40",
        content: newComment,
        likes: 0,
        replies: [],
      });

      setComments([...comments, comment]);
      setNewComment("");
      setArticle({
        ...article,
        comments: article.comments + 1,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-slate-400 text-lg">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-400 text-lg">Article not found</p>
          <Link href="/blog" className="text-purple-400 hover:text-purple-300 mt-4 inline-block">
            ← Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Link href="/blog" className="text-purple-100 hover:text-white mb-4 inline-block">
            ← Back to Blog
          </Link>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-purple-200 uppercase">{article.category}</span>
            <span className="text-xs font-semibold text-purple-200 uppercase">{article.subcategory}</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{article.title}</h1>
          <p className="text-purple-100 text-lg">{article.excerpt}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Article Content */}
          <div className="lg:col-span-2">
            {/* Article Meta */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-slate-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold">
                  {article.author.charAt(0)}
                </div>
                <div>
                  <p className="text-white font-semibold">{article.author}</p>
                  <p className="text-slate-400 text-sm">
                    {new Date(article.publishedAt).toLocaleDateString()} • {article.readTime} min read
                  </p>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="prose prose-invert max-w-none mb-12">
              <div
                className="text-slate-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Social Sharing */}
            <div className="bg-slate-800 rounded-lg p-6 mb-12">
              <p className="text-white font-bold mb-4">Share this article</p>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => handleShare("facebook")}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <span>f</span> Facebook
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <span>𝕏</span> Twitter
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="flex items-center gap-2 bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <span>in</span> LinkedIn
                </button>
                <button
                  onClick={() => handleShare("whatsapp")}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all"
                >
                  <span>💬</span> WhatsApp
                </button>
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    liked
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300"
                  }`}
                >
                  <span>👏</span> Applaud ({article.likes})
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="mb-12">
              <p className="text-slate-400 text-sm mb-3">Tags:</p>
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog?search=${tag}`}
                    className="bg-purple-600/20 hover:bg-purple-600/40 text-purple-400 px-3 py-1 rounded-full text-sm transition-all"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-slate-800 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Comments ({article.comments})</h3>

              {/* Add Comment */}
              <div className="mb-8 pb-8 border-b border-slate-700">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="w-full px-4 py-3 bg-slate-700 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-purple-600 focus:outline-none resize-none"
                  rows={4}
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  Post Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-6">
                {comments.length === 0 ? (
                  <p className="text-slate-400 text-center py-8">No comments yet. Be the first to comment!</p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-white font-semibold">{comment.userName}</p>
                        <p className="text-slate-300 mt-1">{comment.content}</p>
                        <button className="text-purple-400 hover:text-purple-300 text-sm mt-2">
                          👏 Applaud ({comment.likes})
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Article Stats */}
            <div className="bg-slate-800 rounded-lg p-6 sticky top-4 mb-6">
              <h3 className="text-lg font-bold text-white mb-4">Article Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Views</span>
                  <span className="text-white font-bold">👁️ {article.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Applause</span>
                  <span className="text-white font-bold">👏 {article.likes.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shares</span>
                  <span className="text-white font-bold">📤 {article.shares.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Comments</span>
                  <span className="text-white font-bold">💬 {article.comments}</span>
                </div>
              </div>
            </div>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-bold text-white mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedArticles.map((related) => (
                    <Link
                      key={related.id}
                      href={`/blog/${related.slug}`}
                      className="block group"
                    >
                      <p className="text-sm font-semibold text-purple-400 group-hover:text-purple-300 line-clamp-2">
                        {related.title}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {new Date(related.publishedAt).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
