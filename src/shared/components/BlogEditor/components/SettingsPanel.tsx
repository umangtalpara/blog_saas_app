import React from 'react';
import { Settings, Shield, MessageSquare, Star } from 'lucide-react';
import TagSelector from './TagSelector';
import CategorySelector from './CategorySelector';

interface SettingsPanelProps {
  tags: string[];
  categories: string[];
  onTagsChange: (tags: string[]) => void;
  onCategoriesChange: (categories: string[]) => void;
  allowComments: boolean;
  onAllowCommentsChange: (allow: boolean) => void;
  featured: boolean;
  onFeaturedChange: (featured: boolean) => void;
  visibility: 'public' | 'private';
  onVisibilityChange: (visibility: 'public' | 'private') => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  tags, categories, onTagsChange, onCategoriesChange,
  allowComments, onAllowCommentsChange, featured, onFeaturedChange,
  visibility, onVisibilityChange
}) => {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Settings size={20} className="text-blue-600" />
          General Settings
        </h3>
        
        <div className="space-y-6">
          <TagSelector value={tags} onChange={onTagsChange} />
          <CategorySelector value={categories} onChange={onCategoriesChange} />
        </div>
      </div>

      <div className="pt-8 border-t border-gray-100">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-gray-400" />
          Visibility & Interaction
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <MessageSquare size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Allow Comments</div>
                <div className="text-xs text-gray-500">Readers can leave comments</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={allowComments} 
                onChange={(e) => onAllowCommentsChange(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg">
                <Star size={18} />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">Featured Post</div>
                <div className="text-xs text-gray-500">Highlight this post on home page</div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={featured} 
                onChange={(e) => onFeaturedChange(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="pt-2">
            <label className="block text-xs font-medium text-gray-500 mb-2">Post Visibility</label>
            <select
              value={visibility}
              onChange={(e) => onVisibilityChange(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white"
            >
              <option value="public">Public - Everyone can see</option>
              <option value="private">Private - Only you can see</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;
