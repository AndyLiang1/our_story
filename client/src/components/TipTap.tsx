import './styles.scss';

import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { EditorContent, useEditor } from '@tiptap/react';
import React from 'react';

import * as Y from 'yjs';
import Collaboration from '@tiptap/extension-collaboration';
import { useEffect } from 'react';

import { TiptapCollabProvider } from '@hocuspocus/provider';

import axios from 'axios';
import StarterKit from '@tiptap/starter-kit';

const doc = new Y.Doc();

export const TipTap = () => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure(),
            Collaboration.configure({
                document: doc
            }),
            Table.configure({
                resizable: true
            }),
            TableRow,
            TableHeader,
            TableCell
        ]
        // Remove the automatic content addition on editor initialization.
    });

    useEffect(() => {
        // const provider = new TiptapCollabProvider({
        //   name: 'document.name', // Unique document identifier for syncing. This is your document name.
        //   appId: '7j9y6m10', // Your Cloud Dashboard AppID or `baseURL` for on-premises
        //   token: 'notoken', // Your JWT token
        //   document: doc,
        //   // The onSynced callback ensures initial content is set only once using editor.setContent(), preventing repetitive content loading on editor syncs.
        //   onSynced() {
        //     if (!doc.getMap('config').get('initialContentLoaded') && editor) {
        //       doc.getMap('config').set('initialContentLoaded', true)
        //       editor.commands.setContent(`
        //       <p>This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.</p>
        //       <p>The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.</p>
        //       `)
        //     }
        //   },
        // })
        const data = fetchData(doc);
    }, []);

    const fetchData = async (doc: any) => {
        // const axiosResult = await axios.get(`https://${process.env.REACT_APP_TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents/test_doc?format=json`, {
        //     headers: {
        //         Authorization: process.env.REACT_APP_TIPTAP_SECRET,
        //     },
        //     responseType: 'arraybuffer'
        // });

        const result: any = await axios.get(`http://localhost:3002/getData`);
        console.log(JSON.stringify(result.data));
        editor?.commands.setContent({
            type: 'doc',
            content: [
                {
                    type: 'table',
                    content: [
                        {
                            type: 'tableRow',
                            content: [
                                {
                                    type: 'tableHeader',
                                    attrs: {
                                        colspan: 1,
                                        rowspan: 1
                                    },
                                    content: [
                                        {
                                            type: 'paragraph',
                                            attrs: {
                                                indent: 0,
                                                textAlign: 'left'
                                            },
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: 'Header 1'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tableHeader',
                                    attrs: {
                                        colspan: 1,
                                        rowspan: 1
                                    },
                                    content: [
                                        {
                                            type: 'paragraph',
                                            attrs: {
                                                indent: 0,
                                                textAlign: 'left'
                                            },
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: 'Header 2'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tableHeader',
                                    attrs: {
                                        colspan: 1,
                                        rowspan: 1
                                    },
                                    content: [
                                        {
                                            type: 'paragraph',
                                            attrs: {
                                                indent: 0,
                                                textAlign: 'left'
                                            },
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: 'Header 3'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            type: 'tableRow',
                            content: [
                                {
                                    type: 'tableCell',
                                    attrs: {
                                        colspan: 1,
                                        rowspan: 1
                                    },
                                    content: [
                                        {
                                            type: 'paragraph',
                                            attrs: {
                                                indent: 0,
                                                textAlign: 'left'
                                            },
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: 'Cell 1'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tableCell',
                                    attrs: {
                                        colspan: 1,
                                        rowspan: 1
                                    },
                                    content: [
                                        {
                                            type: 'paragraph',
                                            attrs: {
                                                indent: 0,
                                                textAlign: 'left'
                                            },
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: 'Cell 2'
                                                }
                                            ]
                                        }
                                    ]
                                },
                                {
                                    type: 'tableCell',
                                    attrs: {
                                        colspan: 1,
                                        rowspan: 1
                                    },
                                    content: [
                                        {
                                            type: 'paragraph',
                                            attrs: {
                                                indent: 0,
                                                textAlign: 'left'
                                            },
                                            content: [
                                                {
                                                    type: 'text',
                                                    text: 'Cell 3'
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'paragraph',
                    attrs: {
                        indent: 0,
                        textAlign: 'left'
                    },
                    content: [
                        {
                            type: 'text',
                            text: 'Test'
                        }
                    ]
                }
            ]
        });

        // const fetchResult = await fetch(
        //     `https://${process.env.REACT_APP_TIPTAP_APP_ID}.collab.tiptap.cloud/api/documents/test_doc?format=json`,
        //     {
        //         headers: {
        //             Authorization: "ff027ff9e75b22f7dd61a19bc67b63df58ec282cf7dd9f1020a9ac6668b8ce34"
        //         },
        //     },

        // );

        // const fetchResult = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto')
        // console.log('Result: ', fetchResult);
    };

    return <EditorContent editor={editor} />;
};
