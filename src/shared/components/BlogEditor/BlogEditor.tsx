import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Eye, Settings, Share2, Save, 
  ChevronRight, Globe, BarChart3, Clock, AlertCircle
} from 'lucide-react';
import { useBlogEditor } from './hooks/useBlogEditor';
import { useAutosave } from './hooks/useAutosave';
import TitleInput from './components/TitleInput';
import SubtitleInput from './components/SubtitleInput';
import CoverUploader from './components/CoverUploader';
import RichEditor from './components/RichEditor';
import SEOSection from './components/SEOSection';
import SettingsPanel from './components/SettingsPanel';
import PublishSection from './components/PublishSection';
import ScheduleSection from './components/ScheduleSection';
import PreviewPanel from './components/PreviewPanel';
import { useApp } from '../../context/AppContext';

const BlogEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showNotification } = useApp();
  const { formData, loading, saving, updateField, save, setFormData } = useBlogEditor(id);
  
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'seo' | 'settings'>('editor');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Enable autosave only for existing blogs or after first manual save
  useAutosave(id, formData, !!id);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading editor...</p>
        </div>
      </div>
    );
  }

  const handleSave = async (statusOverride?: string) => {
    try {
      const result = await save(statusOverride);
      showNotification('Success', `Blog ${id ? 'updated' : 'created'} successfully!`, 'success');
      if (!id && result._id) {
        navigate(`/admin/blogs/edit/${result._id}`, { replace: true });
      }
    } catch (err) {
      showNotification('Error', 'Failed to save blog', 'error');
    }
  };

  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const wordCount = formData.content.replace(/<[^>]*>/g, '').split(/\s+/).length;

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden">
      {/* Top Navbar */}
      <header className="h-16 border-b border-gray-100 px-4 flex items-center justify-between bg-white z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/blogs')}
            className="p-2 hover:bg-gray-50 rounded-lg text-gray-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400">Blogs</span>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="font-medium text-gray-900 truncate max-w-[200px]">
              {formData.title || 'Untitled Draft'}
            </span>
          </div>
          {saving && (
            <span className="text-xs text-gray-400 animate-pulse flex items-center gap-1 ml-2">
              <Save size={12} />
              Saving...
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-1 mr-2">
            <button 
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'editor' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Write
            </button>
            <button 
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Preview
            </button>
          </div>
          
          <button 
            onClick={() => handleSave()}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-200 rounded-lg transition-colors"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('published')}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm shadow-blue-200"
          >
            Publish
          </button>
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg transition-colors ${sidebarOpen ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <Settings size={20} />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-white custom-scrollbar">
          {activeTab === 'editor' && (
            <div className="max-w-4xl mx-auto px-6 py-12">
              <CoverUploader 
                value={formData.coverImage} 
                onChange={(url) => updateField('coverImage', url)} 
              />
              <TitleInput 
                value={formData.title} 
                onChange={(val) => updateField('title', val)} 
              />
              <SubtitleInput 
                value={formData.subtitle} 
                onChange={(val) => updateField('subtitle', val)} 
              />
              <RichEditor 
                content={formData.content} 
                onChange={(content) => updateField('content', content)} 
              />
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="h-full p-6">
              <PreviewPanel 
                content={formData.content}
                title={formData.title}
                subtitle={formData.subtitle}
                coverImage={formData.coverImage}
              />
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="max-w-3xl mx-auto px-6 py-12">
              <SEOSection 
                data={formData.seo} 
                onChange={(seo) => updateField('seo', seo)}
                slug={formData.slug}
                onSlugChange={(slug) => updateField('slug', slug)}
                title={formData.title}
              />
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto px-6 py-12">
              <SettingsPanel 
                tags={formData.tags}
                categories={formData.categories}
                onTagsChange={(tags) => updateField('tags', tags)}
                onCategoriesChange={(cats) => updateField('categories', cats)}
                allowComments={formData.allowComments}
                onAllowCommentsChange={(allow) => updateField('allowComments', allow)}
                featured={formData.featured}
                onFeaturedChange={(feat) => updateField('featured', feat)}
                visibility={formData.visibility}
                onVisibilityChange={(vis) => updateField('visibility', vis)}
              />
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 border-l border-gray-100 bg-gray-50/50 overflow-y-auto p-6 hidden lg:block custom-scrollbar">
            <div className="space-y-8">
              <PublishSection 
                status={formData.status}
                onStatusChange={(status) => updateField('status', status)}
                onSave={handleSave}
                saving={saving}
              />

              <div className="space-y-4">
                <button 
                  onClick={() => setActiveTab('seo')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'seo' ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <Globe size={18} />
                    <span className="text-sm font-medium">SEO Settings</span>
                  </div>
                  <ChevronRight size={14} />
                </button>

                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-white shadow-sm border border-gray-200 text-blue-600' : 'text-gray-600 hover:bg-white hover:shadow-sm'}`}
                >
                  <div className="flex items-center gap-3">
                    <Settings size={18} />
                    <span className="text-sm font-medium">Post Settings</span>
                  </div>
                  <ChevronRight size={14} />
                </button>
              </div>

              <ScheduleSection 
                scheduleAt={formData.scheduleAt}
                onChange={(date) => updateField('scheduleAt', date)}
              />

              <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                <h4 className="text-sm font-semibold mb-4 flex items-center gap-2">
                  <BarChart3 size={16} />
                  Post Stats
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold">{wordCount}</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Words</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">{calculateReadingTime(formData.content)}m</div>
                    <div className="text-[10px] uppercase tracking-wider opacity-70">Read Time</div>
                  </div>
                </div>
              </div>

              {!formData.coverImage && (
                <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100 flex gap-3">
                  <AlertCircle size={18} className="text-yellow-600 shrink-0" />
                  <p className="text-xs text-yellow-700 leading-relaxed">
                    Adding a cover image helps your post stand out and get more clicks.
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
