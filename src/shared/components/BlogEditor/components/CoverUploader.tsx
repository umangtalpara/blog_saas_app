import React, { useRef } from 'react';
import { Image as ImageIcon, X, Upload } from 'lucide-react';
import { useMediaUpload } from '../hooks/useMediaUpload';

interface CoverUploaderProps {
  value: string;
  onChange: (url: string) => void;
}

const CoverUploader: React.FC<CoverUploaderProps> = ({ value, onChange }) => {
  const { upload, uploading, progress } = useMediaUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await upload(file, 'blogs/cover');
        onChange(url);
      } catch (err: any) {
        alert(err.message || 'Failed to upload cover image');
      }
    }
  };

  const removeCover = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="mb-8 group relative">
      {value ? (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl bg-gray-100">
          <img src={value} alt="Cover" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white text-gray-900 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <Upload size={18} />
              Replace
            </button>
            <button
              onClick={removeCover}
              className="bg-white text-red-600 p-2 rounded-lg hover:bg-red-50 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full aspect-[21/9] border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50/30 transition-all group"
        >
          <div className="p-4 rounded-full bg-gray-50 group-hover:bg-blue-50 transition-colors">
            <ImageIcon size={32} />
          </div>
          <span className="font-medium">Add a cover image</span>
          <span className="text-sm opacity-60">High resolution image (1500x600 recommended)</span>
          {uploading && (
            <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center rounded-xl">
              <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 font-medium">Uploading {progress}%</span>
            </div>
          )}
        </button>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default CoverUploader;
