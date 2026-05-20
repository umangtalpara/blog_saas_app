import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu, FloatingMenu } from '@tiptap/react/menus';
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
  Heading1, Heading2, Heading3, Type, CheckSquare, Video as YoutubeIcon
} from 'lucide-react';

const lowlight = createLowlight(common);

interface RichEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({ content, onChange, placeholder = 'Start writing...' }) => {
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
          class: 'rounded-lg max-w-full h-auto my-8',
        },
      }),
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
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px]',
      },
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
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

  const MenuButton = ({ onClick, isActive, children, title }: any) => (
    <button
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`p-2 rounded-md transition-colors ${
        isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
      }`}
      title={title}
    >
      {children}
    </button>
  );

  return (
    <div className="relative">
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
        <MenuButton onClick={addImage} title="Insert Image">
          <ImageIcon size={18} />
        </MenuButton>
        <MenuButton onClick={addYoutubeVideo} title="Insert YouTube Video">
          <YoutubeIcon size={18} />
        </MenuButton>
      </div>

      <EditorContent editor={editor} />

      {editor && (
        <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }} className="bg-white shadow-xl border border-gray-200 rounded-lg overflow-hidden flex divide-x divide-gray-100">
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
