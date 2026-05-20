import React from 'react';
import { Globe, Search, Layout } from 'lucide-react';
import type { SEO } from '../../../types/blog.types';

interface SEOSectionProps {
  data: SEO;
  onChange: (data: SEO) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  title: string;
}

const SEOSection: React.FC<SEOSectionProps> = ({ data, onChange, slug, onSlugChange, title }) => {
  const updateField = (field: keyof SEO, value: any) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Globe size={20} className="text-blue-600" />
          Search Engine Optimization
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => onSlugChange(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="url-friendly-slug"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Title
            </label>
            <input
              type="text"
              value={data.metaTitle}
              onChange={(e) => updateField('metaTitle', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder={title || "SEO Title"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Meta Description
            </label>
            <textarea
              value={data.metaDescription}
              onChange={(e) => updateField('metaDescription', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Brief summary for search results..."
            />
            <div className="mt-1 flex justify-end">
              <span className={`text-xs ${data.metaDescription.length > 160 ? 'text-red-500' : 'text-gray-400'}`}>
                {data.metaDescription.length}/160
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Search size={16} className="text-gray-400" />
          Search Preview
        </h4>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="text-[#1a0dab] text-xl font-medium truncate mb-1">
            {data.metaTitle || title || "Your Page Title"}
          </div>
          <div className="text-[#006621] text-sm truncate mb-1">
            example.com/blog/{slug || "your-slug"}
          </div>
          <div className="text-[#4d5156] text-sm line-clamp-2">
            {data.metaDescription || "Provide a meta description to see how your blog will appear in search engine results."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SEOSection;
