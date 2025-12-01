export interface Batch {
    id: string;
    name: string;
    description?: string;
    subject: string;
    teacherIds: string[];
    studentIds: string[];
    startDate: Date;
    endDate?: Date;
    schedule?: string;
    maxStudents?: number;
    status: 'active' | 'inactive' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

export interface BatchSettings {
    batchId: string;
    allowLateJoin: boolean;
    accessStartDate?: Date;
    accessEndDate?: Date;
    isVisible: boolean;
    autoApproveStudents: boolean;
}

export interface BatchAccessRequest {
    id: string;
    batchId: string;
    studentId: string;
    status: 'pending' | 'approved' | 'rejected';
    requestDate: Date;
    responseDate?: Date;
    message?: string;
}
