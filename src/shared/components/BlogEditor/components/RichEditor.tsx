import React, { useRef } from 'react';
import { useEditor, EditorContent, Node, mergeAttributes } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Youtube from '@tiptap/extension-youtube';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { common, createLowlight } from 'lowlight';
import { 
  Bold, Italic, Underline as UnderlineIcon, List, ListOrdered, 
  Code, Quote, Image as ImageIcon, Link as LinkIcon, 
  Heading1, Heading2, Heading3, CheckSquare, Video as VideoIcon,
  Play as YoutubeIcon, Loader2
} from 'lucide-react';
import { mediaService } from '../../../services/media.service';

const lowlight = createLowlight(common);

const MenuButton = ({ onClick, isActive, children, title, disabled }: any) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClick();
    }}
    disabled={disabled}
    className={`p-2 rounded-md transition-colors ${
      isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    title={title}
  >
    {children}
  </button>
);

// Custom Video Extension
const Video = Node.create({
  name: 'video',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      width: {
        default: '100%',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, { class: 'rounded-lg max-w-full my-8 block mx-auto' })];
  },

  addCommands(): any {
    return {
      setVideo: (options: { src: string }) => ({ commands }: any) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        });
      },
    };
  },
});
interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (url: string) => void;
  onVideoUpload?: (url: string) => void;
  placeholder?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({ 
  content, 
  onChange, 
  onImageUpload,
  onVideoUpload,
  placeholder = 'Start writing...' 
}) => {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!editor) return;

    try {
      setIsUploading(true);
      const url = await mediaService.upload(file);

      if (file.type.startsWith('image/')) {
        editor.chain().focus().setImage({ src: url }).run();
        if (onImageUpload) onImageUpload(url);
      } else if (file.type.startsWith('video/')) {
        (editor.commands as any).setVideo({ src: url });
        if (onVideoUpload) onVideoUpload(url);
      }
    } catch (error) {
      console.error('Media upload failed:', error);
      alert('Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Underline,
      Link.configure({
        openOnClick: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-8 block mx-auto',
        },
      }),
      Video,
      Placeholder.configure({
        placeholder,
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Youtube.configure({
        width: 840,
        height: 480,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-4 py-2',
      },
      handleDrop: (_view, event, _slice, moved) => {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');

          if (isImage || isVideo) {
            handleFileUpload(file);
            return true;
          }
        }
        return false;
      },
      handlePaste: (_view, event, _slice) => {
        if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
          const file = event.clipboardData.files[0];
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');

          if (isImage || isVideo) {
            handleFileUpload(file);
            return true;
          }
        }
        return false;
      },
    },
  });

  if (!editor) {
    return null;
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const triggerVideoUpload = () => {
    videoInputRef.current?.click();
  };

  const addYoutubeVideo = () => {
    const url = window.prompt('Enter YouTube URL');
    if (url) {
      editor.commands.setYoutubeVideo({
        src: url,
      });
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = '';
        }}
      />
      <input
        type="file"
        ref={videoInputRef}
        className="hidden"
        accept="video/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileUpload(file);
          e.target.value = '';
        }}
      />

      {isUploading && (
        <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-[1px] flex items-center justify-center rounded-lg">
          <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-600" size={20} />
            <span className="text-sm font-medium text-gray-700">Uploading media...</span>
          </div>
        </div>
      )}

      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-100 py-2 mb-8 flex flex-wrap gap-1">
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <Heading1 size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <Heading2 size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <Heading3 size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-200 mx-1 my-auto" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBold().run()} 
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <Bold size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleItalic().run()} 
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <Italic size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleUnderline().run()} 
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <UnderlineIcon size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-200 mx-1 my-auto" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <List size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <ListOrdered size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleTaskList().run()} 
          isActive={editor.isActive('taskList')}
          title="Task List"
        >
          <CheckSquare size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-200 mx-1 my-auto" />
        <MenuButton 
          onClick={() => editor.chain().focus().toggleCodeBlock().run()} 
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <Code size={18} />
        </MenuButton>
        <MenuButton 
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <Quote size={18} />
        </MenuButton>
        <div className="w-px h-6 bg-gray-200 mx-1 my-auto" />
        <MenuButton onClick={setLink} isActive={editor.isActive('link')} title="Insert Link">
          <LinkIcon size={18} />
        </MenuButton>
        <MenuButton onClick={triggerImageUpload} title="Upload Image" disabled={isUploading}>
          <ImageIcon size={18} />
        </MenuButton>
        <MenuButton onClick={triggerVideoUpload} title="Upload Video" disabled={isUploading}>
          <VideoIcon size={18} />
        </MenuButton>
        <MenuButton onClick={addYoutubeVideo} title="Insert YouTube Video">
          <YoutubeIcon size={18} />
        </MenuButton>
      </div>

      <EditorContent editor={editor} />

      {editor && (
        <BubbleMenu editor={editor} className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden flex divide-x divide-gray-100">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`px-3 py-1.5 hover:bg-gray-50 transition-colors ${editor.isActive('bold') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          >
            <Bold size={16} />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`px-3 py-1.5 hover:bg-gray-50 transition-colors ${editor.isActive('italic') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          >
            <Italic size={16} />
          </button>
          <button
            onClick={setLink}
            className={`px-3 py-1.5 hover:bg-gray-50 transition-colors ${editor.isActive('link') ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
          >
            <LinkIcon size={16} />
          </button>
        </BubbleMenu>
      )}
    </div>
  );
};

export default RichEditor;

