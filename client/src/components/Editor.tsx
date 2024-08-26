import * as React from 'react';
import { useEffect, useState } from 'react';
import { EditorContent } from '@tiptap/react';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Highlight from '@tiptap/extension-highlight';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import TextAlign from '@tiptap/extension-text-align';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import HardBreak from '@tiptap/extension-hard-break';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { MenuBar } from './MenuBar';
import { useEditor } from '../hooks/useEditor';

export interface IEditorProps {
    ydoc: any;
    provider: any;
}

const Editor = ({ ydoc, provider }: IEditorProps) => {
    const [status, setStatus] = useState('connecting');

    const editor = useEditor({
        onCreate: ({ editor: currentEditor }) => {
            provider.on('synced', () => {
                if (currentEditor.isEmpty) {
                    currentEditor.commands.setContent('Hwllo');
                }
            });
        },
        extensions: [
            Document,
            Paragraph,
            Text,
            Bold,
            Italic,
            Strike,
            Highlight.configure({
                multicolor: true
            }),
            Heading.configure({
                levels: [1, 2, 3]
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            BulletList,
            OrderedList,
            ListItem,
            Code,
            CodeBlock,
            HardBreak,
            Collaboration.configure({
                document: ydoc
            }),
            CollaborationCursor.configure({
                provider: provider,
                user: {
                    name: 'Andy Arya',
                    color: '#e0f6ff'
                }
            })
        ],
        editorProps: {
            attributes: {
                class: 'h-full w-full p-4'
            }
        }
    });

    useEffect(() => {
        // Update status changes
        const statusHandler = (event: any) => {
            setStatus(event.status);
        };

        provider.on('status', statusHandler);

        return () => {
            provider.off('status', statusHandler);
        };
    }, [provider]);

    useEffect(() => {
        if (editor && !editor.isActive('highlight')) {
            editor.chain().focus().toggleHighlight({ color: '#e0f6ff' }).run();
        }
    }, [editor?.isActive('highlight')]);

    return (
        <div className="h-full w-full">
            <MenuBar editor={editor} />
            <EditorContent className="editor__content bg-milk-mocha h-[90%] w-full " editor={editor} />
        </div>
    );
};

export default Editor;
