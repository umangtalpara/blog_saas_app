import React from 'react';
import { Eye, Smartphone, Monitor } from 'lucide-react';

interface PreviewPanelProps {
  content: string;
  title: string;
  subtitle: string;
  coverImage: string;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({ content, title, subtitle, coverImage }) => {
  const [device, setDevice] = React.useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <Eye size={18} className="text-blue-600" />
          Live Preview
        </h3>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setDevice('desktop')}
            className={`p-1.5 rounded-md transition-all ${device === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
          >
            <Monitor size={16} />
          </button>
          <button 
            onClick={() => setDevice('mobile')}
            className={`p-1.5 rounded-md transition-all ${device === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
          >
            <Smartphone size={16} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className={`mx-auto bg-white shadow-sm transition-all duration-300 ${device === 'mobile' ? 'max-w-[375px]' : 'max-w-4xl'} min-h-full rounded-lg overflow-hidden`}>
          {coverImage && (
            <img src={coverImage} alt="Cover" className="w-full aspect-[21/9] object-cover" />
          )}
          <div className="p-6 md:p-12">
            <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-4">{title || 'Untitled Story'}</h1>
            {subtitle && (
              <p className="text-xl text-gray-500 font-medium mb-8 leading-relaxed">{subtitle}</p>
            )}
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPanel;
