import { Subject, Topic, Chapter } from '@/types/content'

export const mockSubjects: Subject[] = [
    {
        id: 'subject-1',
        name: 'Mathematics',
        description: 'Core mathematics curriculum covering algebra, calculus, and geometry',
        icon: '📐',
        color: '#3B82F6',
        topics: [
            {
                id: 'topic-1',
                subjectId: 'subject-1',
                name: 'Algebra',
                description: 'Fundamental algebraic concepts and operations',
                order: 0,
                chapters: [
                    {
                        id: 'chapter-1',
                        topicId: 'topic-1',
                        name: 'Introduction to Algebra',
                        description: 'Basic concepts, variables, and expressions',
                        order: 0,
                        contentIds: ['content-1'],
                    },
                    {
                        id: 'chapter-2',
                        topicId: 'topic-1',
                        name: 'Linear Equations',
                        description: 'Solving and graphing linear equations',
                        order: 1,
                        contentIds: [],
                    },
                    {
                        id: 'chapter-3',
                        topicId: 'topic-1',
                        name: 'Quadratic Equations',
                        description: 'Working with quadratic equations and the quadratic formula',
                        order: 2,
                        contentIds: [],
                    },
                ],
            },
            {
                id: 'topic-2',
                subjectId: 'subject-1',
                name: 'Calculus',
                description: 'Introduction to differential and integral calculus',
                order: 1,
                chapters: [
                    {
                        id: 'chapter-4',
                        topicId: 'topic-2',
                        name: 'Limits and Continuity',
                        description: 'Understanding limits and continuous functions',
                        order: 0,
                        contentIds: ['content-2'],
                    },
                    {
                        id: 'chapter-5',
                        topicId: 'topic-2',
                        name: 'Derivatives',
                        description: 'Rules of differentiation and applications',
                        order: 1,
                        contentIds: [],
                    },
                ],
            },
            {
                id: 'topic-3',
                subjectId: 'subject-1',
                name: 'Trigonometry',
                description: 'Trigonometric functions and identities',
                order: 2,
                chapters: [
                    {
                        id: 'chapter-6',
                        topicId: 'topic-3',
                        name: 'Basic Trigonometry',
                        description: 'Sine, cosine, tangent and their applications',
                        order: 0,
                        contentIds: ['content-9'],
                    },
                ],
            },
        ],
    },
    {
        id: 'subject-2',
        name: 'Science',
        description: 'Comprehensive science covering physics, chemistry, and biology',
        icon: '🔬',
        color: '#10B981',
        topics: [
            {
                id: 'topic-4',
                subjectId: 'subject-2',
                name: 'Biology',
                description: 'Study of living organisms',
                order: 0,
                chapters: [
                    {
                        id: 'chapter-7',
                        topicId: 'topic-4',
                        name: 'Cell Biology',
                        description: 'Structure and function of cells',
                        order: 0,
                        contentIds: ['content-4'],
                    },
                    {
                        id: 'chapter-8',
                        topicId: 'topic-4',
                        name: 'Photosynthesis',
                        description: 'How plants produce energy',
                        order: 1,
                        contentIds: ['content-8'],
                    },
                ],
            },
            {
                id: 'topic-5',
                subjectId: 'subject-2',
                name: 'Physics',
                description: 'Physical laws and principles',
                order: 1,
                chapters: [
                    {
                        id: 'chapter-9',
                        topicId: 'topic-5',
                        name: 'Mechanics',
                        description: 'Forces, motion, and energy',
                        order: 0,
                        contentIds: [],
                    },
                ],
            },
        ],
    },
    {
        id: 'subject-3',
        name: 'Programming',
        description: 'Computer programming and software development',
        icon: '💻',
        color: '#8B5CF6',
        topics: [
            {
                id: 'topic-6',
                subjectId: 'subject-3',
                name: 'Python Basics',
                description: 'Introduction to Python programming',
                order: 0,
                chapters: [
                    {
                        id: 'chapter-10',
                        topicId: 'topic-6',
                        name: 'Getting Started',
                        description: 'Python installation and basic syntax',
                        order: 0,
                        contentIds: ['content-3'],
                    },
                    {
                        id: 'chapter-11',
                        topicId: 'topic-6',
                        name: 'Data Structures',
                        description: 'Lists, tuples, dictionaries, and sets',
                        order: 1,
                        contentIds: ['content-7'],
                    },
                ],
            },
        ],
    },
    {
        id: 'subject-4',
        name: 'English',
        description: 'English language and literature',
        icon: '📚',
        color: '#F59E0B',
        topics: [
            {
                id: 'topic-7',
                subjectId: 'subject-4',
                name: 'Literature',
                description: 'Classic and modern literary works',
                order: 0,
                chapters: [
                    {
                        id: 'chapter-12',
                        topicId: 'topic-7',
                        name: 'Shakespeare',
                        description: 'Works of William Shakespeare',
                        order: 0,
                        contentIds: ['content-10'],
                    },
                ],
            },
            {
                id: 'topic-8',
                subjectId: 'subject-4',
                name: 'Grammar',
                description: 'English grammar rules and usage',
                order: 1,
                chapters: [
                    {
                        id: 'chapter-13',
                        topicId: 'topic-8',
                        name: 'Parts of Speech',
                        description: 'Nouns, verbs, adjectives, and more',
                        order: 0,
                        contentIds: ['content-5'],
                    },
                ],
            },
        ],
    },
]

// Helper functions
export function getSubjectById(id: string): Subject | undefined {
    return mockSubjects.find(s => s.id === id)
}

export function getTopicById(subjectId: string, topicId: string): Topic | undefined {
    const subject = getSubjectById(subjectId)
    return subject?.topics.find(t => t.id === topicId)
}

export function getChapterById(subjectId: string, topicId: string, chapterId: string): Chapter | undefined {
    const topic = getTopicById(subjectId, topicId)
    return topic?.chapters.find(c => c.id === chapterId)
}

export function getSubjectStats(subjectId: string) {
    const subject = getSubjectById(subjectId)
    if (!subject) return { topicCount: 0, chapterCount: 0, contentCount: 0 }

    const topicCount = subject.topics.length
    const chapterCount = subject.topics.reduce((sum, topic) => sum + topic.chapters.length, 0)
    const contentCount = subject.topics.reduce(
        (sum, topic) => sum + topic.chapters.reduce((s, chapter) => s + chapter.contentIds.length, 0),
        0
    )

    return { topicCount, chapterCount, contentCount }
}
