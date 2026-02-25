// components/RichTextEditor.jsx

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Undo,
  Redo,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Minus,
} from "lucide-react";
import { useEffect } from "react";

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Write description...",
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      HorizontalRule,
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const ToolbarButton = ({ onClick, isActive, children }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-2 rounded-md transition ${
        isActive ? "bg-[#927f68] text-white" : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      {children}
    </button>
  );

  const setLink = () => {
    const url = prompt("Enter URL");
    if (!url) return;
    editor.chain().focus().setLink({ href: url }).run();
  };
  useEffect(() => {
    if (editor && content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);
  return (
    <div className="border border-gray-300 rounded-xl overflow-hidden shadow-sm">
      {/* TOOLBAR */}
      <div className="bg-[#f5efdd] border-b p-2 flex flex-wrap gap-1 items-center">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive("bold")}
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive("italic")}
        >
          <Italic size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive("underline")}
        >
          <UnderlineIcon size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive("strike")}
        >
          <Strikethrough size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          isActive={editor.isActive("heading", { level: 1 })}
        >
          <Heading1 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          isActive={editor.isActive("heading", { level: 2 })}
        >
          <Heading2 size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          isActive={editor.isActive("heading", { level: 3 })}
        >
          <Heading3 size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive("bulletList")}
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive("orderedList")}
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive("blockquote")}
        >
          <Quote size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive("codeBlock")}
        >
          <Code size={18} />
        </ToolbarButton>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          isActive={editor.isActive({ textAlign: "left" })}
        >
          <AlignLeft size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          isActive={editor.isActive({ textAlign: "center" })}
        >
          <AlignCenter size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          isActive={editor.isActive({ textAlign: "right" })}
        >
          <AlignRight size={18} />
        </ToolbarButton>

        <div className="flex-1" />

        <ToolbarButton onClick={setLink} isActive={editor.isActive("link")}>
          <LinkIcon size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().unsetLink().run()}
          isActive={false}
        >
          ❌
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          isActive={false}
        >
          <Minus size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          isActive={false}
        >
          <Undo size={18} />
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          isActive={false}
        >
          <Redo size={18} />
        </ToolbarButton>
      </div>

      {/* EDITOR */}
      <EditorContent
        editor={editor}
        className="prose max-w-none p-4 min-h-[250px] focus:outline-none
        [&_.ProseMirror]:outline-none
        [&_h1]:text-2xl
        [&_h2]:text-xl
        [&_h3]:text-lg
        [&_blockquote]:border-l-4 [&_blockquote]:pl-4 [&_blockquote]:italic
        [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded"
      />
    </div>
  );
}
