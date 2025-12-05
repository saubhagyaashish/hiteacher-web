import { create } from 'zustand'
import { Batch } from '@/types/batch'
import { mockBatches } from '@/lib/mock-data/batches'

interface BatchStore {
    // State
    batches: Batch[]
    selectedBatch: Batch | null

    // Actions
    setBatches: (batches: Batch[]) => void
    addBatch: (batch: Batch) => void
    updateBatch: (id: string, updates: Partial<Batch>) => void
    deleteBatch: (id: string) => void
    setSelectedBatch: (batch: Batch | null) => void

    // Getters
    getBatchById: (id: string) => Batch | undefined
    getBatchesByTeacher: (teacherId: string) => Batch[]
    getBatchesByStudent: (studentId: string) => Batch[]
    getActiveBatches: () => Batch[]
}

export const useBatchStore = create<BatchStore>((set, get) => ({
    // Initial state
    batches: mockBatches,
    selectedBatch: null,

    // Actions
    setBatches: (batches) => set({ batches }),

    addBatch: (newBatch) => set((state) => ({
        batches: [...state.batches, newBatch]
    })),

    updateBatch: (id, updates) => set((state) => ({
        batches: state.batches.map(b =>
            b.id === id ? { ...b, ...updates, updatedAt: new Date() } : b
        )
    })),

    deleteBatch: (id) => set((state) => ({
        batches: state.batches.filter(b => b.id !== id),
        selectedBatch: state.selectedBatch?.id === id ? null : state.selectedBatch
    })),

    setSelectedBatch: (batch) => set({ selectedBatch: batch }),

    // Getters
    getBatchById: (id) => {
        return get().batches.find(b => b.id === id)
    },

    getBatchesByTeacher: (teacherId) => {
        return get().batches.filter(b => b.teacherIds.includes(teacherId))
    },

    getBatchesByStudent: (studentId) => {
        return get().batches.filter(b => b.studentIds.includes(studentId))
    },

    getActiveBatches: () => {
        return get().batches.filter(b => b.status === 'active')
    },
}))
