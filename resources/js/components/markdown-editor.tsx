import { defaultKeymap } from '@codemirror/commands';
import { markdown } from '@codemirror/lang-markdown';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers } from '@codemirror/view';
import { useEffect, useRef } from 'react';

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);
    const viewRef = useRef<EditorView | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const startState = EditorState.create({
            doc: value,
            extensions: [
                lineNumbers(),
                markdown(),
                keymap.of(defaultKeymap),
                EditorView.updateListener.of((update) => {
                    if (update.docChanged) {
                        onChange(update.state.doc.toString());
                    }
                }),
                EditorView.theme({
                    '&': {
                        height: '500px',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '0.5rem',
                        backgroundColor: 'hsl(var(--background))',
                    },
                    '.cm-scroller': {
                        overflow: 'auto',
                        fontFamily: 'monospace',
                    },
                    '.cm-content': {
                        padding: '1rem',
                        backgroundColor: 'hsl(var(--background))',
                    },
                    '.cm-gutters': {
                        backgroundColor: 'hsl(var(--muted))',
                        color: 'hsl(var(--muted-foreground))',
                        border: 'none',
                    },
                    '.cm-activeLineGutter': {
                        backgroundColor: 'hsl(var(--accent))',
                    },
                }),
            ],
        });

        const view = new EditorView({
            state: startState,
            parent: editorRef.current,
        });

        viewRef.current = view;

        return () => {
            view.destroy();
        };
    }, []);

    useEffect(() => {
        if (viewRef.current) {
            const currentValue = viewRef.current.state.doc.toString();
            if (currentValue !== value) {
                viewRef.current.dispatch({
                    changes: {
                        from: 0,
                        to: currentValue.length,
                        insert: value,
                    },
                });
            }
        }
    }, [value]);

    return <div ref={editorRef} />;
}
