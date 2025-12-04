import { create } from 'zustand'
import { Subject, Topic, Chapter } from '@/types/content'
import { mockSubjects } from '@/lib/mock-data/subjects'

interface SubjectStore {
    // State
    subjects: Subject[]
    selectedSubject: Subject | null
    selectedTopic: Topic | null

    // Subject Actions
    setSubjects: (subjects: Subject[]) => void
    addSubject: (subject: Subject) => void
    updateSubject: (id: string, updates: Partial<Subject>) => void
    deleteSubject: (id: string) => void
    setSelectedSubject: (subject: Subject | null) => void

    // Topic Actions
    addTopic: (subjectId: string, topic: Topic) => void
    updateTopic: (subjectId: string, topicId: string, updates: Partial<Topic>) => void
    deleteTopic: (subjectId: string, topicId: string) => void
    reorderTopics: (subjectId: string, topicIds: string[]) => void
    setSelectedTopic: (topic: Topic | null) => void

    // Chapter Actions
    addChapter: (subjectId: string, topicId: string, chapter: Chapter) => void
    updateChapter: (subjectId: string, topicId: string, chapterId: string, updates: Partial<Chapter>) => void
    deleteChapter: (subjectId: string, topicId: string, chapterId: string) => void
    reorderChapters: (subjectId: string, topicId: string, chapterIds: string[]) => void
    addContentToChapter: (subjectId: string, topicId: string, chapterId: string, contentId: string) => void
    removeContentFromChapter: (subjectId: string, topicId: string, chapterId: string, contentId: string) => void

    // Getters
    getSubjectById: (id: string) => Subject | undefined
    getTopicById: (subjectId: string, topicId: string) => Topic | undefined
    getChapterById: (subjectId: string, topicId: string, chapterId: string) => Chapter | undefined
}

export const useSubjectStore = create<SubjectStore>((set, get) => ({
    // Initial state
    subjects: mockSubjects,
    selectedSubject: null,
    selectedTopic: null,

    // Subject Actions
    setSubjects: (subjects) => set({ subjects }),

    addSubject: (newSubject) => set((state) => ({
        subjects: [...state.subjects, newSubject]
    })),

    updateSubject: (id, updates) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === id ? { ...s, ...updates } : s
        )
    })),

    deleteSubject: (id) => set((state) => ({
        subjects: state.subjects.filter(s => s.id !== id),
        selectedSubject: state.selectedSubject?.id === id ? null : state.selectedSubject
    })),

    setSelectedSubject: (subject) => set({ selectedSubject: subject }),

    // Topic Actions
    addTopic: (subjectId, newTopic) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? { ...s, topics: [...s.topics, newTopic] }
                : s
        )
    })),

    updateTopic: (subjectId, topicId, updates) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId ? { ...t, ...updates } : t
                    )
                }
                : s
        )
    })),

    deleteTopic: (subjectId, topicId) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.filter(t => t.id !== topicId)
                }
                : s
        ),
        selectedTopic: state.selectedTopic?.id === topicId ? null : state.selectedTopic
    })),

    reorderTopics: (subjectId, topicIds) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: topicIds
                        .map(id => s.topics.find(t => t.id === id))
                        .filter((t): t is Topic => t !== undefined)
                        .map((t, index) => ({ ...t, order: index }))
                }
                : s
        )
    })),

    setSelectedTopic: (topic) => set({ selectedTopic: topic }),

    // Chapter Actions
    addChapter: (subjectId, topicId, newChapter) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId
                            ? { ...t, chapters: [...t.chapters, newChapter] }
                            : t
                    )
                }
                : s
        )
    })),

    updateChapter: (subjectId, topicId, chapterId, updates) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId
                            ? {
                                ...t,
                                chapters: t.chapters.map(c =>
                                    c.id === chapterId ? { ...c, ...updates } : c
                                )
                            }
                            : t
                    )
                }
                : s
        )
    })),

    deleteChapter: (subjectId, topicId, chapterId) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId
                            ? {
                                ...t,
                                chapters: t.chapters.filter(c => c.id !== chapterId)
                            }
                            : t
                    )
                }
                : s
        )
    })),

    reorderChapters: (subjectId, topicId, chapterIds) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId
                            ? {
                                ...t,
                                chapters: chapterIds
                                    .map(id => t.chapters.find(c => c.id === id))
                                    .filter((c): c is Chapter => c !== undefined)
                                    .map((c, index) => ({ ...c, order: index }))
                            }
                            : t
                    )
                }
                : s
        )
    })),

    addContentToChapter: (subjectId, topicId, chapterId, contentId) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId
                            ? {
                                ...t,
                                chapters: t.chapters.map(c =>
                                    c.id === chapterId
                                        ? { ...c, contentIds: [...c.contentIds, contentId] }
                                        : c
                                )
                            }
                            : t
                    )
                }
                : s
        )
    })),

    removeContentFromChapter: (subjectId, topicId, chapterId, contentId) => set((state) => ({
        subjects: state.subjects.map(s =>
            s.id === subjectId
                ? {
                    ...s,
                    topics: s.topics.map(t =>
                        t.id === topicId
                            ? {
                                ...t,
                                chapters: t.chapters.map(c =>
                                    c.id === chapterId
                                        ? { ...c, contentIds: c.contentIds.filter(id => id !== contentId) }
                                        : c
                                )
                            }
                            : t
                    )
                }
                : s
        )
    })),

    // Getters
    getSubjectById: (id) => {
        return get().subjects.find(s => s.id === id)
    },

    getTopicById: (subjectId, topicId) => {
        const subject = get().getSubjectById(subjectId)
        return subject?.topics.find(t => t.id === topicId)
    },

    getChapterById: (subjectId, topicId, chapterId) => {
        const topic = get().getTopicById(subjectId, topicId)
        return topic?.chapters.find(c => c.id === chapterId)
    },
}))
