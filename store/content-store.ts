import { create } from 'zustand'
import { Content, ContentFilters, ContentStats, ViewMode } from '@/types/content'
import { mockContent } from '@/lib/mock-data/content'

interface ContentStore {
    // State
    content: Content[]
    filters: ContentFilters
    viewMode: ViewMode
    selectedContent: Content | null

    // Actions
    setContent: (content: Content[]) => void
    addContent: (content: Content) => void
    updateContent: (id: string, updates: Partial<Content>) => void
    deleteContent: (id: string) => void
    duplicateContent: (id: string) => void
    setFilters: (filters: Partial<ContentFilters>) => void
    setViewMode: (mode: ViewMode) => void
    setSelectedContent: (content: Content | null) => void
    getContentById: (id: string) => Content | undefined
    getFilteredContent: () => Content[]
    getStats: () => ContentStats
    resetFilters: () => void
}

export const useContentStore = create<ContentStore>((set, get) => ({
    // Initial state
    content: mockContent,
    filters: {
        search: '',
        type: 'all',
        category: 'all',
        status: 'all',
        dateRange: 'all',
    },
    viewMode: 'grid',
    selectedContent: null,

    // Actions
    setContent: (content) => set({ content }),

    addContent: (newContent) => set((state) => ({
        content: [newContent, ...state.content]
    })),

    updateContent: (id, updates) => set((state) => ({
        content: state.content.map(c =>
            c.id === id ? { ...c, ...updates, updatedAt: new Date() } : c
        )
    })),

    deleteContent: (id) => set((state) => ({
        content: state.content.filter(c => c.id !== id),
        selectedContent: state.selectedContent?.id === id ? null : state.selectedContent
    })),

    duplicateContent: (id) => set((state) => {
        const original = state.content.find(c => c.id === id)
        if (!original) return state

        const duplicate: Content = {
            ...original,
            id: `content-${Date.now()}`,
            title: `${original.title} (Copy)`,
            status: 'draft',
            views: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        return { content: [duplicate, ...state.content] }
    }),

    setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
    })),

    setViewMode: (mode) => set({ viewMode: mode }),

    setSelectedContent: (content) => set({ selectedContent: content }),

    getContentById: (id) => {
        const { content } = get()
        return content.find(c => c.id === id)
    },

    getFilteredContent: () => {
        const { content, filters } = get()

        return content.filter(item => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase()
                const matchesSearch =
                    item.title.toLowerCase().includes(searchLower) ||
                    item.description.toLowerCase().includes(searchLower)
                if (!matchesSearch) return false
            }

            // Type filter
            if (filters.type && filters.type !== 'all') {
                if (item.type !== filters.type) return false
            }

            // Category filter
            if (filters.category && filters.category !== 'all') {
                if (item.category !== filters.category) return false
            }

            // Status filter
            if (filters.status && filters.status !== 'all') {
                if (item.status !== filters.status) return false
            }

            // Date range filter
            if (filters.dateRange && filters.dateRange !== 'all') {
                const now = new Date()
                const itemDate = new Date(item.createdAt)
                const daysDiff = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24))

                if (filters.dateRange === 'week' && daysDiff > 7) return false
                if (filters.dateRange === 'month' && daysDiff > 30) return false
            }

            return true
        })
    },

    getStats: () => {
        const { content } = get()

        return {
            total: content.length,
            published: content.filter(c => c.status === 'published').length,
            drafts: content.filter(c => c.status === 'draft').length,
            scheduled: content.filter(c => c.status === 'scheduled').length,
            totalViews: content.reduce((sum, c) => sum + c.views, 0),
        }
    },

    resetFilters: () => set({
        filters: {
            search: '',
            type: 'all',
            category: 'all',
            status: 'all',
            dateRange: 'all',
        }
    }),
}))
