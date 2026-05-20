import React from 'react';
import { Send, Clock, FileText, CheckCircle } from 'lucide-react';
import type { BlogStatus } from '../../../types/blog.types';

interface PublishSectionProps {
  status: BlogStatus;
  onStatusChange: (status: BlogStatus) => void;
  onSave: (status?: BlogStatus) => void;
  saving: boolean;
}

const PublishSection: React.FC<PublishSectionProps> = ({ status, onStatusChange, onSave, saving }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Send size={16} className="text-blue-600" />
        Publishing
      </h3>

      <div className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500 flex items-center gap-2">
            <FileText size={14} />
            Status:
          </span>
          <span className={`font-semibold capitalize ${
            status === 'published' ? 'text-green-600' : 
            status === 'scheduled' ? 'text-blue-600' : 'text-yellow-600'
          }`}>
            {status}
          </span>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-col gap-2">
          {status !== 'published' ? (
            <button
              onClick={() => onSave('published')}
              disabled={saving}
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <CheckCircle size={18} />
              Publish Now
            </button>
          ) : (
            <button
              onClick={() => onSave('draft')}
              disabled={saving}
              className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Revert to Draft
            </button>
          )}
          
          <button
            onClick={() => onSave()}
            disabled={saving}
            className="w-full border border-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishSection;
