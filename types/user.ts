export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'teacher' | 'student';
    avatar?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt: Date;
    status: 'active' | 'inactive' | 'pending';
}

export interface Teacher extends User {
    role: 'teacher';
    subjects: string[];
    experience?: number;
    qualification?: string;
    bio?: string;
    verificationStatus: 'pending' | 'approved' | 'rejected';
}

export interface Student extends User {
    role: 'student';
    enrollmentDate: Date;
    batchIds: string[];
    parentName?: string;
    parentContact?: string;
}

export interface Admin extends User {
    role: 'admin';
    permissions: string[];
}
