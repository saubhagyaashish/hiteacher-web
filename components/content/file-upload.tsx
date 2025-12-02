'use client'

import { useState, useCallback } from 'react'
import { Upload, File, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { ALLOWED_VIDEO_TYPES, ALLOWED_DOCUMENT_TYPES, MAX_FILE_SIZE } from '@/lib/validations/content'

interface FileUploadProps {
    type: 'video' | 'document'
    onFileSelect: (file: File) => void
}

export function FileUpload({ type, onFileSelect }: FileUploadProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const [error, setError] = useState<string>('')

    const allowedTypes = type === 'video' ? ALLOWED_VIDEO_TYPES : ALLOWED_DOCUMENT_TYPES

    const validateFile = (file: File): string | null => {
        if (!allowedTypes.includes(file.type)) {
            return `Invalid file type. Allowed types: ${type === 'video' ? 'MP4, WebM, AVI' : 'PDF, DOC, DOCX, PPT, PPTX'
                }`
        }

        if (file.size > MAX_FILE_SIZE) {
            return `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`
        }

        return null
    }

    const handleFiles = (files: FileList | null) => {
        if (!files || files.length === 0) return

        const file = files[0]
        const error = validateFile(file)

        if (error) {
            setError(error)
            setSelectedFile(null)
            return
        }

        setError('')
        setSelectedFile(file)
        onFileSelect(file)
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const removeFile = () => {
        setSelectedFile(null)
        setError('')
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return bytes + ' B'
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return (
        <div className="space-y-4">
            {!selectedFile ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={cn(
                        'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
                        isDragging
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                    )}
                >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-sm font-medium mb-1">
                        Drag and drop your {type} file here
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                        or click to browse
                    </p>
                    <input
                        type="file"
                        accept={allowedTypes.join(',')}
                        onChange={(e) => handleFiles(e.target.files)}
                        className="hidden"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 cursor-pointer"
                    >
                        Browse Files
                    </label>
                    <p className="text-xs text-muted-foreground mt-4">
                        {type === 'video' && 'Supported: MP4, WebM, AVI (Max 100MB)'}
                        {type === 'document' && 'Supported: PDF, DOC, DOCX, PPT, PPTX (Max 100MB)'}
                    </p>
                </div>
            ) : (
                <div className="border rounded-lg p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <File className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                            {formatFileSize(selectedFile.size)}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={removeFile}
                        className="h-8 w-8 rounded-full hover:bg-muted flex items-center justify-center"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}
