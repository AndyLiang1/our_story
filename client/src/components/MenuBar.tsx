import {
    FaAlignCenter,
    FaAlignLeft,
    FaAlignRight,
    FaBold,
    FaCode,
    FaHighlighter,
    FaItalic,
    FaListOl,
    FaListUl,
    FaParagraph,
    FaShareSquare,
    FaTrashAlt
} from 'react-icons/fa';
import { LuHeading1, LuHeading2, LuHeading3 } from 'react-icons/lu';
import { DeleteDocumentConfirmationModalInfo, ShareDocumentFormInfo } from '../types/ModalInfoTypes';

export interface IMenuBarProps {
    editor: any;
    documentIdBefore: string;
    documentId: string;
    documentIdAfter: string;
    documentTitle: string;
    setShowShareDocumentForm: React.Dispatch<React.SetStateAction<ShareDocumentFormInfo>>;
    setShowDeleteDocumentConfirmationModal: React.Dispatch<
        React.SetStateAction<DeleteDocumentConfirmationModalInfo>
    >;
}

export function MenuBar({
    editor,
    documentIdBefore,
    documentId,
    documentIdAfter,
    documentTitle,
    setShowShareDocumentForm,
    setShowDeleteDocumentConfirmationModal
}: IMenuBarProps) {
    if (!editor) {
        return null;
    }

    const handleShareButtonClicked = () => {
        setShowShareDocumentForm({
            documentId,
            documentTitle,
            status: true
        });
    };

    const handleDeleteButtonClicked = () => {
        setShowDeleteDocumentConfirmationModal({
            documentIdBefore,
            documentId,
            documentIdAfter,
            status: true
        });
    };

    return (
        <div className="box-border flex h-[5%] w-full bg-gray-100 px-[1.5rem]">
            <div className="flex h-full w-[90%] justify-start">
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    disabled={!editor.can().chain().focus().toggleBold().run()}
                >
                    <FaBold className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    disabled={!editor.can().chain().focus().toggleItalic().run()}
                >
                    <FaItalic className="text-[1rem]" />
                </button>
                {/* <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                disabled={!editor.can().chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'is-active' : ''}
            >
                strike
            </button> */}
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    disabled={!editor.can().chain().focus().toggleCode().run()}
                >
                    <FaCode className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                >
                    <FaAlignLeft className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                >
                    <FaAlignCenter className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                >
                    <FaAlignRight className="text-[1rem]" />
                </button>
                {/* <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
                clear marks
            </button> */}
                {/* <button onClick={() => editor.chain().focus().clearNodes().run()}>clear nodes</button> */}
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().setParagraph().run()}
                >
                    <FaParagraph className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                >
                    <LuHeading1 className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                >
                    <LuHeading2 className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                >
                    <LuHeading3 className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                >
                    <FaListUl className="text-[1rem]" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                >
                    <FaListOl className="text-[1rem]" />
                </button>
                {/* <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive('codeBlock') ? 'is-active' : ''}
            >
                code block
            </button> */}
                {/* <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
                blockquote
            </button> */}
                {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule</button> */}
                {/* <button
                className={
                    'flex aspect-square h-full items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-200 text-center'
                }
                onClick={() => editor.chain().focus().setHardBreak().run()}
            >
                hard break
            </button> */}
                {/* <button onClick={() => addImage()}>Image</button> */}
                {/* <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                undo
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
            >
                redo
            </button> */}
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={() => editor.chain().focus().toggleHighlight().run()} // Highlight styling set by index.css
                >
                    <FaHighlighter className="text-[1rem]" />
                </button>
                {/* <button
                className={
                    'flex aspect-square h-full items-center justify-center bg-gray-100 hover:bg-gray-200 transition duration-200 text-center'
                }
                onClick={() => editor.chain().focus().toggleHighlight({ color: '#e0f6ff', opacity: '0.5' }).run()}
            >
                <FaHighlighter />
            </button> */}
            </div>
            <div className="flex h-full w-[10%] justify-end">
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={handleShareButtonClicked} // Highlight styling set by index.css
                >
                    <FaShareSquare className="h-full text-[1.2rem]" color="#52cdff" />
                </button>
                <button
                    className={
                        'flex aspect-square h-full items-center justify-center text-center transition duration-200 hover:bg-gray-200'
                    }
                    onClick={handleDeleteButtonClicked} // Highlight styling set by index.css
                >
                    <FaTrashAlt className="h-full text-[0.9rem]" />
                </button>
            </div>
        </div>
    );
}
