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
  "px-2.5 py-1 rounded-md text-sm border border-line text-muted hover:text-fg hover:border-fg/40 disabled:opacity-40 disabled:hover:text-muted disabled:hover:border-line transition-colors";
const btnActive = "bg-brand text-ink border-brand hover:text-ink";

function ToolbarButton({
  label,
  title,
  onClick,
  isActive,
  disabled,
}: {
  label: string;
  title: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
}) {
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

// Add a scheme to bare domains so "example.com" becomes a real link, while
// leaving absolute URLs, anchors, mailto: and tel: untouched.
function normalizeUrl(input: string): string {
  const url = input.trim();
  if (!url) return url;
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(url)) return url;
  return `https://${url}`;
}

function manageLink(editor: Editor) {
  const inLink = editor.isActive("link");
  const hasSelection = !editor.state.selection.empty;
  const prevHref = (editor.getAttributes("link").href as string) ?? "";

  const input = window.prompt(
    inLink ? "Edit link URL (clear the field to remove the link)" : "Link URL",
    prevHref || "https://"
  );
  if (input === null) return; // cancelled

  const url = normalizeUrl(input);

  // Empty → remove the link (selects the whole link first so it fully clears).
  if (url === "") {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();
    return;
  }

  // Cursor sits inside an existing link → update the entire link.
  if (inLink) {
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    return;
  }

  // Some text is selected → turn that selection into a link.
  if (hasSelection) {
    editor.chain().focus().setLink({ href: url }).run();
    return;
  }

  // Nothing selected and not in a link → insert new linked text. Ask what it
  // should say (defaulting to the URL), so a link can be added from scratch.
  const text = (window.prompt("Link text", url) ?? url).trim() || url;
  editor
    .chain()
    .focus()
    .insertContent({
      type: "text",
      text,
      marks: [{ type: "link", attrs: { href: url } }],
    })
    // Drop the link mark so typing after the link isn't also linked.
    .unsetMark("link")
    .run();
}

export function RichTextEditor({
  name = "content",
  initialHTML = "",
}: {
  name?: string;
  initialHTML?: string;
}) {
  const [html, setHtml] = useState(initialHTML);
  // Bump on every transaction so toolbar active-states track the cursor, not
  // just document edits (moving into/out of a link must update the buttons).
  const [, setTick] = useState(0);

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
    onTransaction: () => setTick((n) => n + 1),
  });

  return (
    <div className="rounded-xl border border-line">
      {editor && (
        <div className="flex flex-wrap gap-1.5 border-b border-line p-2">
          <ToolbarButton label="H2" title="Heading 2"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            isActive={editor.isActive("heading", { level: 2 })} />
          <ToolbarButton label="H3" title="Heading 3"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            isActive={editor.isActive("heading", { level: 3 })} />
          <ToolbarButton label="B" title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")} />
          <ToolbarButton label="I" title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")} />
          <ToolbarButton label="S" title="Strikethrough"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")} />
          <ToolbarButton label="• List" title="Bullet list"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")} />
          <ToolbarButton label="1. List" title="Numbered list"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")} />
          <ToolbarButton label="❝ Quote" title="Blockquote"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")} />
          <ToolbarButton label="Link" title="Add or edit a link"
            onClick={() => manageLink(editor)}
            isActive={editor.isActive("link")} />
          <ToolbarButton label="Unlink" title="Remove link"
            onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
            disabled={!editor.isActive("link")} />
          <ToolbarButton label="Image" title="Insert image by URL"
            onClick={() => {
              const src = window.prompt("Image URL (https://…)");
              if (!src) return;
              const alt = window.prompt("Alt text (describe the image)") ?? "";
              editor.chain().focus().setImage({ src: normalizeUrl(src), alt }).run();
            }} />
          <ToolbarButton label="Table" title="Insert 3×3 table"
            onClick={() =>
              editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
            } />
          <span className="mx-1 w-px self-stretch bg-line" aria-hidden />
          <ToolbarButton label="↶" title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()} />
          <ToolbarButton label="↷" title="Redo"
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
