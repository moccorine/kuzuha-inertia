import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { marked } from 'marked';
import TurndownService from 'turndown';
import { useEffect } from 'react';

type MarkdownEditorProps = {
    content: string;
    onChange: (markdown: string) => void;
    placeholder?: string;
};

const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
});

export function MarkdownEditor({
    content,
    onChange,
    placeholder = 'Start typing...',
}: MarkdownEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4, 5, 6],
                },
            }),
            Placeholder.configure({
                placeholder,
            }),
        ],
        content: marked(content) as string,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            const markdown = turndownService.turndown(html);
            onChange(markdown);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none focus:outline-none min-h-[400px] p-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:ml-6 [&_ul]:list-disc [&_ol]:mb-4 [&_ol]:ml-6 [&_ol]:list-decimal [&_li]:mb-1 [&_strong]:font-bold [&_em]:italic [&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic [&_code]:bg-gray-100 [&_code]:px-1 [&_code]:rounded',
            },
        },
    });

    useEffect(() => {
        if (editor && content !== undefined) {
            const currentHtml = editor.getHTML();
            const newHtml = marked(content) as string;

            // Only update if content has actually changed to avoid cursor jumping
            if (currentHtml !== newHtml) {
                editor.commands.setContent(newHtml);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="rounded-lg border">
            <div className="border-b bg-muted/50 p-2">
                <div className="flex flex-wrap gap-1">
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('bold') ? 'bg-accent' : ''
                        }`}
                        title="Bold"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('italic') ? 'bg-accent' : ''
                        }`}
                        title="Italic"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('strike') ? 'bg-accent' : ''
                        }`}
                        title="Strikethrough"
                    >
                        <s>S</s>
                    </button>
                    <div className="w-px bg-border" />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('heading', { level: 1 }) ? 'bg-accent' : ''
                        }`}
                        title="Heading 1"
                    >
                        H1
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('heading', { level: 2 }) ? 'bg-accent' : ''
                        }`}
                        title="Heading 2"
                    >
                        H2
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('heading', { level: 3 }) ? 'bg-accent' : ''
                        }`}
                        title="Heading 3"
                    >
                        H3
                    </button>
                    <div className="w-px bg-border" />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('bulletList') ? 'bg-accent' : ''
                        }`}
                        title="Bullet List"
                    >
                        •
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('orderedList') ? 'bg-accent' : ''
                        }`}
                        title="Ordered List"
                    >
                        1.
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('codeBlock') ? 'bg-accent' : ''
                        }`}
                        title="Code Block"
                    >
                        {'</>'}
                    </button>
                    <div className="w-px bg-border" />
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`rounded px-2 py-1 text-sm hover:bg-accent ${
                            editor.isActive('blockquote') ? 'bg-accent' : ''
                        }`}
                        title="Blockquote"
                    >
                        "
                    </button>
                    <button
                        type="button"
                        onClick={() => editor.chain().focus().setHorizontalRule().run()}
                        className="rounded px-2 py-1 text-sm hover:bg-accent"
                        title="Horizontal Rule"
                    >
                        ―
                    </button>
                </div>
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}
