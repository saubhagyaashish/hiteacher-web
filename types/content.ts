// Content Types for Phase 6: Content Management System
export type ContentType = 'lesson' | 'video' | 'document' | 'quiz'
export type ContentStatus = 'published' | 'draft' | 'scheduled'

export interface Content {
    id: string
    title: string
    description: string
    type: ContentType
    status: ContentStatus
    category: string
    tags: string[]
    thumbnail?: string
    content: string // Rich text HTML
    fileUrl?: string // For videos/documents
    fileName?: string
    fileSize?: number // In bytes
    duration?: number // For videos in minutes
    views: number
    createdAt: Date
    updatedAt: Date
    scheduledAt?: Date
    batchIds: string[] // Which batches can access
    commentsEnabled: boolean
    downloadEnabled: boolean
    teacherId: string
}

export interface ContentFilters {
    search?: string
    type?: ContentType | 'all'
    category?: string
    status?: ContentStatus | 'all'
    dateRange?: 'week' | 'month' | 'all'
}

export interface ContentStats {
    total: number
    published: number
    drafts: number
    scheduled: number
    totalViews: number
}

export type ViewMode = 'grid' | 'list'

// Legacy types (will be used later for hierarchical content structure)
export type LegacyContentType = 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other'

export interface Subject {
    id: string
    name: string
    description?: string
    icon?: string
    color?: string
    topics: Topic[]
}

export interface Topic {
    id: string
    subjectId: string
    name: string
    description?: string
    order: number
    chapters: Chapter[]
}

export interface Chapter {
    id: string
    topicId: string
    name: string
    description?: string
    order: number
    contentIds: string[]
}
