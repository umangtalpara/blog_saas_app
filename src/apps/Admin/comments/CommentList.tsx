import React, { useEffect, useState } from 'react';
import { 
  CheckCircle, XCircle, Trash2, ExternalLink, 
  MessageCircle, Clock
} from 'lucide-react';
import { commentService } from '../../../shared/services/comment.service';
import type { Comment } from '../../../shared/services/comment.service';
import { useApp } from '../../../shared/context/AppContext';

const CommentList: React.FC = () => {
  const { showNotification, showConfirm } = useApp();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      const data = await commentService.getAdminComments();
      setComments(data);
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await commentService.updateStatus(id, status);
      showNotification('Success', `Comment ${status} successfully`, 'success');
      fetchComments();
    } catch (err) {
      showNotification('Error', 'Failed to update comment status', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm({
      title: 'Delete Comment',
      message: 'Are you sure you want to permanently delete this comment?',
      confirmText: 'Delete',
      type: 'danger',
      onConfirm: async () => {
        try {
          await commentService.deleteComment(id);
          showNotification('Deleted', 'Comment has been removed', 'success');
          fetchComments();
        } catch (err) {
          showNotification('Error', 'Failed to delete comment', 'error');
        }
      }
    });
  };

  const filteredComments = comments.filter(c => filter === 'all' || c.status === filter);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
          <p className="text-gray-500">Manage and moderate reader feedback.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === s ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Comment</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Post</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredComments.map((comment) => (
                <tr key={comment._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{comment.authorName}</div>
                    <div className="text-xs text-gray-400">{comment.authorEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-700 line-clamp-2 max-w-xs">{comment.content}</div>
                    <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-1">
                      <Clock size={10} />
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
                      <span className="truncate max-w-[150px]">{comment.blogId?.title || 'Unknown Post'}</span>
                      <ExternalLink size={14} className="shrink-0" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      comment.status === 'approved' ? 'bg-green-100 text-green-700' :
                      comment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {comment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {comment.status !== 'approved' && (
                        <button 
                          onClick={() => handleUpdateStatus(comment._id, 'approved')}
                          className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      {comment.status !== 'rejected' && (
                        <button 
                          onClick={() => handleUpdateStatus(comment._id, 'rejected')}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      )}
                      <button 
                        onClick={() => handleDelete(comment._id)}
                        className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredComments.length === 0 && (
          <div className="py-20 text-center">
            <MessageCircle size={40} className="text-gray-200 mx-auto mb-4" />
            <p className="text-gray-500 font-medium">No comments found matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentList;
