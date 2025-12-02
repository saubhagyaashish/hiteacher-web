'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface ContentEditorProps {
    value: string
    onChange: (value: string) => void
}

export function ContentEditor({ value, onChange }: ContentEditorProps) {
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'code-block'],
            ['clean'],
        ],
    }

    const formats = [
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'list',
        'link',
        'image',
        'code-block',
    ]

    return (
        <div className="content-editor">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                formats={formats}
                placeholder="Start writing your content here..."
                className="min-h-[300px]"
            />
            <style jsx global>{`
                .content-editor .ql-container {
                    min-height: 300px;
                    font-size: 16px;
                }
                .content-editor .ql-editor {
                    min-height: 300px;
                }
                .content-editor .ql-toolbar {
                    border-top-left-radius: 0.5rem;
                    border-top-right-radius: 0.5rem;
                    background: hsl(var(--muted));
                }
                .content-editor .ql-container {
                    border-bottom-left-radius: 0.5rem;
                    border-bottom-right-radius: 0.5rem;
                }
            `}</style>
        </div>
    )
}
