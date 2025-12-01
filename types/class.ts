export interface Class {
    id: string;
    title: string;
    description?: string;
    batchId: string;
    teacherId: string;
    date: Date;
    startTime: string;
    duration: number; // in minutes
    meetingLink?: string;
    meetingId?: string;
    recordingUrl?: string;
    isRecurring: boolean;
    recurringPattern?: 'daily' | 'weekly' | 'monthly';
    recurringEndDate?: Date;
    status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
    attendanceIds: string[];
    createdAt: Date;
    updatedAt: Date;
}

export interface Attendance {
    id: string;
    classId: string;
    studentId: string;
    isPresent: boolean;
    joinTime?: Date;
    leaveTime?: Date;
    duration?: number; // in minutes
    markedBy: string;
    markedAt: Date;
}

export interface ClassReminder {
    id: string;
    classId: string;
    type: '1_day' | '1_hour' | 'start_time';
    sentAt?: Date;
    status: 'pending' | 'sent' | 'failed';
}
