"use client";

import { useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TableKit } from "@tiptap/extension-table";

// WYSIWYG editor for blog post content. Edits rich HTML and mirrors it into a
// hidden <textarea name={name}> so the existing server action (savePost) keeps
// receiving `content` from the form with no changes. The stored HTML is always
// re-sanitized before it is rendered on the public site (see lib/sanitize).

const btn =
  "px-2.5 py-1 rounded-md text-sm border border-line text-muted hover:text-fg hover:border-fg/40 disabled:opacity-40 transition-colors";
const btnActive = "bg-brand text-ink border-brand hover:text-ink";

function ToolbarButton({
  editor,
  label,
  title,
  onClick,
  isActive,
  disabled,
}: {
  editor: Editor;
  label: string;
  title: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) {
  // `editor` is threaded in only so this re-renders as selection/state changes.
  void editor;
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`${btn} ${isActive ? btnActive : ""}`}
    >
      {label}
    </button>
  );
}

export function RichTextEditor({
  name = "content",
  initialHTML = "",
}: {
  name?: string;
  initialHTML?: string;
}) {
  const [html, setHtml] = useState(initialHTML);

  const editor = useEditor({
    immediatelyRender: false, // avoid SSR hydration mismatch in Next.js
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          HTMLAttributes: { rel: "noopener noreferrer nofollow", target: "_blank" },
        },
      }),
      Image.configure({ inline: false }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: initialHTML,
    editorProps: {
      attributes: {
        class:
          "prose-tws min-h-[22rem] max-w-none rounded-b-xl bg-ink/60 px-4 py-3 focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => setHtml(editor.getHTML()),
  });

  return (
    <div className="rounded-xl border border-line">
      {editor && (
        <div className="flex flex-wrap gap-1.5 border-b border-line p-2">
          <ToolbarButton editor={editor} label="H2" title="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })} />
          <ToolbarButton editor={editor} label="H3" title="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })} />
          <ToolbarButton editor={editor} label="B" title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")} />
          <ToolbarButton editor={editor} label="I" title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")} />
          <ToolbarButton editor={editor} label="S" title="Strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")} />
          <ToolbarButton editor={editor} label="• List" title="Bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")} />
          <ToolbarButton editor={editor} label="1. List" title="Numbered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")} />
          <ToolbarButton editor={editor} label="❝ Quote" title="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")} />
          <ToolbarButton editor={editor} label="Link" title="Add/edit link"
            onClick={() => {
              const prev = editor.getAttributes("link").href as string | undefined;
              const url = window.prompt("Link URL", prev ?? "https://");
              if (url === null) return;
              if (url === "") {
                editor.chain().focus().extendMarkRange("link").unsetLink().run();
              } else {
                editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
              }
            }}
            isActive={editor.isActive("link")} />
          <ToolbarButton editor={editor} label="Image" title="Insert image by URL"
            onClick={() => {
              const url = window.prompt("Image URL (https://…)");
              if (!url) return;
              const alt = window.prompt("Alt text (describe the image)") ?? "";
              editor.chain().focus().setImage({ src: url, alt }).run();
            }} />
          <ToolbarButton editor={editor} label="Table" title="Insert 3×3 table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            } />
          <span className="mx-1 w-px self-stretch bg-line" aria-hidden />
          <ToolbarButton editor={editor} label="↶" title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()} />
          <ToolbarButton editor={editor} label="↷" title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()} />
        </div>
      )}

      <EditorContent editor={editor} />

      {/* Submitted with the form; kept in sync with the editor's HTML. */}
      <textarea name={name} value={html} readOnly hidden />
    </div>
  );
}
