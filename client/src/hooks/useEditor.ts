// this code is from a github issue somewhere, I think it was to deal with flickers
// https://github.com/ueberdosis/tiptap/issues/2040

import { Editor, EditorOptions } from '@tiptap/react';
import { useEffect, useRef, useState } from 'react';

export const useEditor = (options: Partial<EditorOptions> = {}, deps: any[] = []) => {
    const editorRef = useRef<Editor | null>(null);
    const [_, forceUpdate] = useState({});

    useEffect(() => {
        let isMounted = true;

        editorRef.current = new Editor(options);

        editorRef.current.on('transaction', () => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    if (isMounted) {
                        forceUpdate({});
                    }
                });
            });
        });

        return () => {
            isMounted = false;
        };
    }, deps);

    useEffect(() => () => editorRef.current?.destroy(), []);

    return editorRef.current;
};
