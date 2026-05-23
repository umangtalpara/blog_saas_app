import React, { useState } from 'react';
import { commentService } from '../../../shared/services/comment.service';

interface CommentSectionProps {
  blogSlug: string;
  tenantSlug: string;
  initialComments: any[];
}

const CommentSection: React.FC<CommentSectionProps> = ({ blogSlug, tenantSlug, initialComments }) => {
  const [comments] = useState(initialComments);
  const [content, setContent] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await commentService.submitComment(blogSlug, tenantSlug, { content, authorName, authorEmail });
      setSubmitted(true);
      setContent('');
      setAuthorName('');
      setAuthorEmail('');
    } catch (err) {
      console.error('Failed to submit comment', err);
      alert('Failed to submit comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-16 pt-16 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Comments ({comments.length})</h3>

      <div className="space-y-8 mb-12">
        {comments.map((comment: any) => (
          <div key={comment._id} className="bg-gray-50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-gray-900">{comment.authorName}</span>
              <span className="text-sm text-gray-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
          </div>
        ))}
        {comments.length === 0 && (
          <p className="text-gray-500 text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        )}
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
        <h4 className="text-lg font-bold text-gray-900 mb-6">Leave a comment</h4>
        {submitted ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center">
            Your comment has been submitted and is awaiting moderation.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                required
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                required
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Post Comment'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default CommentSection;
