export interface IMenuBarProps {
    editor: any;
}

export function MenuBar({ editor }: IMenuBarProps) {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('Enter the image URL');

        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };
    return (
        <div className="h-[10%] w-full">
            <button  onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
                bold
            </button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} >
                italic
            </button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
                strike
            </button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive('code') ? 'is-active' : ''}>
                code
            </button>
            <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Left
          </button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
                center
            </button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
                right
            </button>
            <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>clear marks</button>
            <button onClick={() => editor.chain().focus().clearNodes().run()}>clear nodes</button>
            <button onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
                paragraph
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
                h1
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
                h2
            </button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
                h3
            </button>
            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive('bulletList') ? 'is-active' : ''}>
                bullet list
            </button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive('orderedList') ? 'is-active' : ''}>
                ordered list
            </button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={editor.isActive('codeBlock') ? 'is-active' : ''}>
                code block
            </button>
            {/* <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive('blockquote') ? 'is-active' : ''}>
                blockquote
            </button> */}
            {/* <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>horizontal rule</button> */}
            <button onClick={() => editor.chain().focus().setHardBreak().run()}>hard break</button>
            {/* <button onClick={() => addImage()}>Image</button> */}
            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()}>
                undo
            </button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()}>
                redo
            </button>
            <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
                Toggle highlight
            </button>
            <button onClick={() => editor.chain().focus().toggleHighlight({ color: '#e0f6ff' }).run()}>Highlight blue</button>
        </div>
    );
}
