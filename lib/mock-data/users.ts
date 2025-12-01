import { Teacher, Student, Admin } from '@/types/user';

export const mockTeachers: Teacher[] = [
    {
        id: 't1',
        email: 'john.doe@example.com',
        name: 'John Doe',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
        phoneNumber: '+1234567890',
        subjects: ['Mathematics', 'Physics'],
        experience: 8,
        qualification: 'M.Sc. Mathematics',
        bio: 'Passionate mathematics teacher with 8 years of experience',
        verificationStatus: 'approved',
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-11-20'),
    },
    {
        id: 't2',
        email: 'sarah.smith@example.com',
        name: 'Sarah Smith',
        role: 'teacher',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
        phoneNumber: '+1234567891',
        subjects: ['Chemistry', 'Biology'],
        experience: 5,
        qualification: 'M.Sc. Chemistry',
        bio: 'Experienced chemistry teacher specializing in organic chemistry',
        verificationStatus: 'approved',
        status: 'active',
        createdAt: new Date('2024-02-10'),
        updatedAt: new Date('2024-11-18'),
    },
];

export const mockStudents: Student[] = [
    {
        id: 's1',
        email: 'alice.johnson@example.com',
        name: 'Alice Johnson',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
        phoneNumber: '+1234567892',
        enrollmentDate: new Date('2024-03-01'),
        batchIds: ['b1', 'b2'],
        parentName: 'Robert Johnson',
        parentContact: '+1234567893',
        status: 'active',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-11-25'),
    },
    {
        id: 's2',
        email: 'bob.williams@example.com',
        name: 'Bob Williams',
        role: 'student',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
        phoneNumber: '+1234567894',
        enrollmentDate: new Date('2024-03-05'),
        batchIds: ['b1'],
        parentName: 'Mary Williams',
        parentContact: '+1234567895',
        status: 'active',
        createdAt: new Date('2024-03-05'),
        updatedAt: new Date('2024-11-24'),
    },
];

export const mockAdmins: Admin[] = [
    {
        id: 'a1',
        email: 'admin@hiteacher.com',
        name: 'Admin User',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin',
        phoneNumber: '+1234567896',
        permissions: ['all'],
        status: 'active',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-11-30'),
    },
];

// Simulated API delay
export const mockApiDelay = (min: number = 500, max: number = 1500): Promise<void> => {
    const delay = Math.random() * (max - min) + min;
    return new Promise(resolve => setTimeout(resolve, delay));
};

// Mock authentication token
export const generateMockToken = (userId: string, role: string): string => {
    return `mock_token_${userId}_${role}_${Date.now()}`;
};
