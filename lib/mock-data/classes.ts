import { ClassSession, AttendanceRecord, MeetingLink } from '@/types/class'
import { addDays, addHours, subDays, setHours, setMinutes } from 'date-fns'

// Helper to create dates
const createTime = (daysOffset: number, hour: number, minute: number = 0): Date => {
    const date = addDays(new Date(), daysOffset)
    return setMinutes(setHours(date, hour), minute)
}

// Sample meeting links
const meetingLinks: { [key: string]: MeetingLink } = {
    zoom1: {
        platform: 'zoom',
        url: 'https://zoom.us/j/1234567890',
        meetingId: '123 456 7890',
        password: 'math2024',
    },
    googleMeet1: {
        platform: 'google-meet',
        url: 'https://meet.google.com/abc-defg-hij',
    },
    teams1: {
        platform: 'ms-teams',
        url: 'https://teams.microsoft.com/l/meetup-join/19%3ameeting',
        meetingId: '234567890',
    },
}

// Sample attendance records
const createAttendance = (classId: string, students: { id: string; name: string; status: 'present' | 'absent' | 'late' | 'excused' }[]): AttendanceRecord[] => {
    return students.map(student => ({
        id: `attendance-${classId}-${student.id}`,
        classId,
        studentId: student.id,
        studentName: student.name,
        status: student.status,
        markedAt: new Date(),
        markedBy: 'teacher-1',
    }))
}

// Mock class sessions
export const mockClasses: ClassSession[] = [
    // Today's classes
    {
        id: 'class-1',
        batchId: 'batch-1',
        batchName: 'Advanced Mathematics - Batch A',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Calculus - Derivatives',
        topic: 'Introduction to Derivatives and Limits',
        description: 'Understanding the concept of derivatives, limits, and their applications in real-world problems.',
        startTime: createTime(0, 10, 0), // Today 10:00 AM
        endTime: createTime(0, 11, 30), // Today 11:30 AM
        duration: 90,
        status: 'scheduled',
        meetingLink: meetingLinks.zoom1,
        attendance: [],
        isRecurring: false,
        createdAt: subDays(new Date(), 5),
        updatedAt: subDays(new Date(), 5),
    },
    {
        id: 'class-2',
        batchId: 'batch-2',
        batchName: 'Physics - Mechanics',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Physics Lab - Motion',
        topic: 'Laws of Motion - Practical Experiments',
        startTime: createTime(0, 14, 0), // Today 2:00 PM
        endTime: createTime(0, 16, 0), // Today 4:00 PM
        duration: 120,
        status: 'scheduled',
        meetingLink: meetingLinks.googleMeet1,
        attendance: [],
        isRecurring: false,
        createdAt: subDays(new Date(), 3),
        updatedAt: subDays(new Date(), 3),
    },

    // Tomorrow's classes
    {
        id: 'class-3',
        batchId: 'batch-1',
        batchName: 'Advanced Mathematics - Batch A',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Algebra - Quadratic Equations',
        topic: 'Solving Complex Quadratic Equations',
        startTime: createTime(1, 10, 0),
        endTime: createTime(1, 11, 30),
        duration: 90,
        status: 'scheduled',
        meetingLink: meetingLinks.zoom1,
        attendance: [],
        isRecurring: true,
        recurringGroupId: 'recurring-math-1',
        createdAt: subDays(new Date(), 7),
        updatedAt: subDays(new Date(), 7),
    },
    {
        id: 'class-4',
        batchId: 'batch-3',
        batchName: 'Chemistry - Organic',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Organic Chemistry Basics',
        topic: 'Hydrocarbons and Functional Groups',
        startTime: createTime(1, 15, 0),
        endTime: createTime(1, 16, 30),
        duration: 90,
        status: 'scheduled',
        attendance: [],
        isRecurring: false,
        createdAt: subDays(new Date(), 4),
        updatedAt: subDays(new Date(), 4),
    },

    // Next week's classes
    {
        id: 'class-5',
        batchId: 'batch-2',
        batchName: 'Physics - Mechanics',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Thermodynamics Introduction',
        topic: 'Heat, Temperature, and Energy Transfer',
        startTime: createTime(3, 14, 0),
        endTime: createTime(3, 15, 30),
        duration: 90,
        status: 'scheduled',
        meetingLink: meetingLinks.teams1,
        attendance: [],
        isRecurring: false,
        createdAt: subDays(new Date(), 2),
        updatedAt: subDays(new Date(), 2),
    },

    // Completed classes (past)
    {
        id: 'class-6',
        batchId: 'batch-1',
        batchName: 'Advanced Mathematics - Batch A',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Trigonometry Review',
        topic: 'Sine, Cosine, and Tangent Functions',
        description: 'Comprehensive review of trigonometric functions and their applications.',
        startTime: createTime(-2, 10, 0),
        endTime: createTime(-2, 11, 30),
        duration: 90,
        status: 'completed',
        meetingLink: meetingLinks.zoom1,
        attendance: createAttendance('class-6', [
            { id: 'student-1', name: 'John Doe', status: 'present' },
            { id: 'student-2', name: 'Jane Smith', status: 'present' },
            { id: 'student-3', name: 'Mike Wilson', status: 'late' },
            { id: 'student-4', name: 'Sarah Brown', status: 'absent' },
            { id: 'student-5', name: 'Tom Davis', status: 'present' },
        ]),
        notes: 'Good participation today. Students grasped the concepts well.',
        topicsCovered: ['Unit Circle', 'Trigonometric Ratios', 'Graph Transformations'],
        homeworkAssigned: 'Complete exercises 5.1 to 5.3 from the textbook',
        isRecurring: true,
        recurringGroupId: 'recurring-math-1',
        createdAt: subDays(new Date(), 10),
        updatedAt: subDays(new Date(), 2),
    },
    {
        id: 'class-7',
        batchId: 'batch-2',
        batchName: 'Physics - Mechanics',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Newton\'s Laws',
        topic: 'Understanding Force and Motion',
        startTime: createTime(-3, 14, 0),
        endTime: createTime(-3, 16, 0),
        duration: 120,
        status: 'completed',
        meetingLink: meetingLinks.googleMeet1,
        attendance: createAttendance('class-7', [
            { id: 'student-6', name: 'Emily Chen', status: 'present' },
            { id: 'student-7', name: 'Alex Martinez', status: 'present' },
            { id: 'student-8', name: 'Lisa Anderson', status: 'present' },
            { id: 'student-9', name: 'Chris Taylor', status: 'excused' },
        ]),
        notes: 'Conducted practical demonstrations of Newton\'s laws.',
        topicsCovered: ['First Law', 'Second Law', 'Third Law', 'Free Body Diagrams'],
        isRecurring: false,
        createdAt: subDays(new Date(), 8),
        updatedAt: subDays(new Date(), 3),
    },
    {
        id: 'class-8',
        batchId: 'batch-3',
        batchName: 'Chemistry - Organic',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Chemical Bonding',
        topic: 'Ionic and Covalent Bonds',
        startTime: createTime(-5, 15, 0),
        endTime: createTime(-5, 16, 30),
        duration: 90,
        status: 'completed',
        attendance: createAttendance('class-8', [
            { id: 'student-10', name: 'David Kim', status: 'present' },
            { id: 'student-11', name: 'Rachel Green', status: 'present' },
            { id: 'student-12', name: 'James Lee', status: 'late' },
        ]),
        notes: 'Students struggled with Lewis structures, will review next class.',
        topicsCovered: ['Ionic Bonding', 'Covalent Bonding', 'Lewis Structures'],
        homeworkAssigned: 'Draw Lewis structures for 10 molecules',
        isRecurring: false,
        createdAt: subDays(new Date(), 12),
        updatedAt: subDays(new Date(), 5),
    },

    // More upcoming classes
    {
        id: 'class-9',
        batchId: 'batch-1',
        batchName: 'Advanced Mathematics - Batch A',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Integration Techniques',
        topic: 'Methods of Integration',
        startTime: createTime(2, 10, 0),
        endTime: createTime(2, 11, 30),
        duration: 90,
        status: 'scheduled',
        meetingLink: meetingLinks.zoom1,
        attendance: [],
        isRecurring: true,
        recurringGroupId: 'recurring-math-1',
        createdAt: subDays(new Date(), 7),
        updatedAt: subDays(new Date(), 7),
    },
    {
        id: 'class-10',
        batchId: 'batch-4',
        batchName: 'Biology - NEET Prep',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Cell Biology',
        topic: 'Cell Structure and Function',
        startTime: createTime(4, 11, 0),
        endTime: createTime(4, 12, 30),
        duration: 90,
        status: 'scheduled',
        meetingLink: {
            platform: 'zoom',
            url: 'https://zoom.us/j/9876543210',
            meetingId: '987 654 3210',
            password: 'bio2024',
        },
        attendance: [],
        isRecurring: false,
        createdAt: subDays(new Date(), 1),
        updatedAt: subDays(new Date(), 1),
    },

    // Cancelled class
    {
        id: 'class-11',
        batchId: 'batch-2',
        batchName: 'Physics - Mechanics',
        teacherId: 'teacher-1',
        teacherName: 'Prof. Sarah Johnson',
        title: 'Electromagnetism',
        topic: 'Electric Fields and Magnetic Fields',
        startTime: createTime(-1, 14, 0),
        endTime: createTime(-1, 16, 0),
        duration: 120,
        status: 'cancelled',
        notes: 'Cancelled due to technical issues. Will be rescheduled.',
        attendance: [],
        isRecurring: false,
        createdAt: subDays(new Date(), 6),
        updatedAt: subDays(new Date(), 1),
    },
]

// Helper function to get classes by batch
export const getClassesByBatch = (batchId: string): ClassSession[] => {
    return mockClasses.filter(cls => cls.batchId === batchId)
}

// Helper function to get upcoming classes
export const getUpcomingClasses = (limit: number = 5): ClassSession[] => {
    const now = new Date()
    return mockClasses
        .filter(cls => cls.startTime > now && cls.status === 'scheduled')
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
        .slice(0, limit)
}

// Helper function to get today's classes
export const getTodayClasses = (): ClassSession[] => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return mockClasses.filter(cls => {
        const classDate = new Date(cls.startTime)
        classDate.setHours(0, 0, 0, 0)
        return classDate.getTime() === today.getTime()
    })
}
