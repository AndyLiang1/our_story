import * as React from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export interface ITipTapProps {}

export function TipTap(props: ITipTapProps) {
    const editor = useEditor({
        extensions: [StarterKit.configure()]
    });
    return <EditorContent editor={editor} />;
}
