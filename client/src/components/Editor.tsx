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
import { editDocumentHasUpdatedInTipTapFlag, editDocumentTitle } from '../apis/documentApi';
import { useUserContext } from '../context/userContext';
import { useEditor } from '../hooks/useEditor';
import {
    DeleteDocumentConfirmationModalInfo,
    ShareDocumentFormInfo
} from '../types/ModalInfoTypes';
import { MenuBar } from './MenuBar';

export interface IEditorProps {
    ydoc?: any;
    provider?: any;
    documentIdBefore: string;
    documentId: string;
    documentIdAfter: string;
    documentTitle: string;
    collabFlag?: boolean;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
    setShowDeleteDocumentConfirmationModal: React.Dispatch<
        React.SetStateAction<DeleteDocumentConfirmationModalInfo>
    >;
    documentHasUpdatedInTipTap: boolean;
}

const Editor = ({
    ydoc,
    provider,
    documentIdBefore,
    documentId,
    documentIdAfter,
    documentTitle,
    setShowShareDocumentForm,
    setShowDeleteDocumentConfirmationModal,
    documentHasUpdatedInTipTap
}: IEditorProps) => {
    const user = useUserContext();
    const { collabToken } = user;
    const [title, setTitle] = useState(documentTitle);
    const [debouncedValue, setDebouncedValue] = useState('');
    const [stopFlaggingDocumentHasUpdated, setStopFlaggingDocumentHasUpdated] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(title);
        }, 2000);
        return () => {
            clearTimeout(handler);
        };
    }, [title]);

    useEffect(() => {
        const updateDocumentHasUpdatedFlag = async () => {
            await editDocumentHasUpdatedInTipTapFlag(collabToken, documentId);
        };
        // state is true if the document has connected to tiptap and has content
        // even if there are no updates, it seems like just connecting will trigger the
        // update event for our editor
        if (stopFlaggingDocumentHasUpdated && !documentHasUpdatedInTipTap)
            updateDocumentHasUpdatedFlag();
    }, [stopFlaggingDocumentHasUpdated]);

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
                                  name: user.firstName,
                                  color: user.textColor
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
    if (editor) {
        editor.on('update', ({ editor }) => {
            setStopFlaggingDocumentHasUpdated(true);
        });
    }

    useEffect(() => {
        if (editor)
            editor
                .chain()
                .focus()
                .toggleHighlight({ color: user.textColor ? user.textColor : '' })
                .run();
    }, [editor]);

    // useEffect(() => {
    //     if (editor) console.log(documentId, 'triggered', editor.isActive('highlight'));
    //     if (editor && !editor.isActive('highlight')) {
    //         console.log('Triggered2');
    //         editor.chain().focus().toggleHighlight({ color: 'rgba(224, 246, 255, 0.7)' }).run();
    //     }
    // }, [editor?.isActive('highlight')]);

    return (
        <div className="h-full w-full">
            {editor && (
                <MenuBar
                    editor={editor}
                    documentIdBefore={documentIdBefore}
                    documentId={documentId}
                    documentIdAfter={documentIdAfter}
                    documentTitle={documentTitle}
                    setShowShareDocumentForm={setShowShareDocumentForm}
                    setShowDeleteDocumentConfirmationModal={setShowDeleteDocumentConfirmationModal}
                />
            )}
            {editor && (
                <div className="flex h-[95%] w-full flex-col">
                    <input
                        className="mt-1 h-[5%] w-full border-none bg-transparent text-center font-['Handlee'] text-[1.3rem] focus:outline-none"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <EditorContent
                        className="editor__content box-border h-[95%] w-full overflow-y-auto px-[1.5rem]"
                        editor={editor}
                    />
                </div>
            )}
        </div>
    );
};

export default Editor;
