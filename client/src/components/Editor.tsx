import Bold from '@tiptap/extension-bold';
import BulletList from '@tiptap/extension-bullet-list';
import Code from '@tiptap/extension-code';
import CodeBlock from '@tiptap/extension-code-block';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Document from '@tiptap/extension-document';
import HardBreak from '@tiptap/extension-hard-break';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import Italic from '@tiptap/extension-italic';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Paragraph from '@tiptap/extension-paragraph';
import Strike from '@tiptap/extension-strike';
import Text from '@tiptap/extension-text';
import TextAlign from '@tiptap/extension-text-align';
import { EditorContent } from '@tiptap/react';
import { useEffect, useState } from 'react';
import { editDocumentTitle } from '../apis/documentApi';
import { useEditor } from '../hooks/useEditor';
import { ShareDocumentFormInfo } from '../types/DocumentTypes';
import { MenuBar } from './MenuBar';

export interface IEditorProps {
    ydoc?: any;
    provider?: any;
    collabToken: string;
    documentId: string;
    documentTitle: string;
    collabFlag?: boolean;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
}

const Editor = ({
    ydoc,
    provider,
    collabToken,
    documentId,
    documentTitle,
    setShowShareDocumentForm
}: IEditorProps) => {
    const [status, setStatus] = useState('connecting');
    const [title, setTitle] = useState(documentTitle);
    const [debouncedValue, setDebouncedValue] = useState('');
    let updatedHasChangedFlag = false;

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(title);
        }, 2000);
        return () => {
            clearTimeout(handler);
        };
    }, [title]);

    useEffect(() => {
        const updateDocumentTitle = async () => {
            await editDocumentTitle(collabToken, title, documentId);
        };
        if (debouncedValue && title !== documentTitle) {
            updateDocumentTitle();
        }
    }, [debouncedValue]);

    const editor = useEditor(
        {
            // onCreate: ({ editor: currentEditor }) => {
            //     provider.on('synced', () => {
            //         if (currentEditor.isEmpty) {
            //             currentEditor.commands.setContent('Hwllo');
            //         }
            //     });
            // },
            // onUpdate: () => {
            //     if (!updatedHasChangedFlag) {
            //         updatedHasChangedFlag = true;
            //     }
            // },
            extensions:
                ydoc && provider
                    ? [
                          Document,
                          Paragraph,
                          Text,
                          Bold,
                          Italic,
                          Strike,
                          Highlight.configure({
                              multicolor: true
                              // Highlight styling set by index.css
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
                      ]
                    : [
                          Document,
                          Paragraph,
                          Text,
                          Bold,
                          Italic,
                          Strike,
                          Highlight.configure({
                              multicolor: true
                              // Highlight styling set by index.css
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
                          HardBreak
                      ]
        },
        [ydoc, provider]
    );

    useEffect(() => {
        // Update status changes
        const statusHandler = (event: any) => {
            setStatus(event.status);
        };

        if (provider) provider.on('status', statusHandler);

        return () => {
            if (provider) provider.off('status', statusHandler);
        };
    }, [provider]);

    useEffect(() => {
        if (editor && !editor.isActive('highlight')) {
            editor.chain().focus().toggleHighlight().run();
        }
    }, [editor?.isActive('highlight')]);

    return (
        <div className="h-full w-full">
            {editor && (
                <MenuBar
                    editor={editor}
                    documentId={documentId}
                    documentTitle={documentTitle}
                    setShowShareDocumentForm={setShowShareDocumentForm}
                />
            )}
            {editor && (
                <div className="flex h-[95%] w-full flex-col pl-[1.5rem]">
                    <input
                        className="h-[5%] w-full border-none bg-transparent text-center"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <EditorContent
                        className="editor__content h-[95%] w-full pt-2"
                        editor={editor}
                    />
                </div>
            )}
        </div>
    );
};

export default Editor;
