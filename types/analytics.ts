export interface AnalyticsMetric {
    label: string;
    value: number;
    change?: number; // percentage change
    trend?: 'up' | 'down' | 'neutral';
}

export interface ChartData {
    name: string;
    value: number;
    [key: string]: string | number;
}

export interface StudentProgress {
    studentId: string;
    batchId: string;
    subjectId: string;
    completionPercentage: number;
    contentViewed: number;
    totalContent: number;
    assignmentsCompleted: number;
    totalAssignments: number;
    averageScore: number;
    attendance: number;
    lastActive: Date;
}

export interface ContentEngagement {
    contentId: string;
    viewCount: number;
    downloadCount: number;
    averageWatchTime?: number; // for videos in minutes
    completionRate?: number; // percentage
    rating?: number;
    ratingCount?: number;
}

export interface BatchAnalytics {
    batchId: string;
    totalStudents: number;
    activeStudents: number;
    averageAttendance: number;
    averageScore: number;
    contentCount: number;
    completedAssignments: number;
    pendingAssignments: number;
    engagementRate: number;
}
