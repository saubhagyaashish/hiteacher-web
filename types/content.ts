export type ContentType = 'pdf' | 'ppt' | 'doc' | 'video' | 'image' | 'other';

export interface Content {
    id: string;
    title: string;
    description?: string;
    type: ContentType;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    thumbnailUrl?: string;
    subjectId: string;
    topicId: string;
    chapterId: string;
    uploadedBy: string;
    batchIds: string[];
    tags: string[];
    version: number;
    publishDate?: Date;
    expiryDate?: Date;
    isPublished: boolean;
    viewCount: number;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface Subject {
    id: string;
    name: string;
    description?: string;
    icon?: string;
    color?: string;
    topics: Topic[];
}

export interface Topic {
    id: string;
    subjectId: string;
    name: string;
    description?: string;
    order: number;
    chapters: Chapter[];
}

export interface Chapter {
    id: string;
    topicId: string;
    name: string;
    description?: string;
    order: number;
    contentIds: string[];
}
