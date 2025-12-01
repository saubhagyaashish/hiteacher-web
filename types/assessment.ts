export type QuestionType = 'mcq_single' | 'mcq_multiple' | 'true_false' | 'short_answer';

export interface Question {
    id: string;
    type: QuestionType;
    question: string;
    options?: string[];
    correctAnswer: string | string[];
    points: number;
    explanation?: string;
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    batchId: string;
    subjectId: string;
    teacherId: string;
    questions: Question[];
    duration: number; // in minutes
    passingMarks: number;
    totalMarks: number;
    attemptsAllowed: number;
    randomizeQuestions: boolean;
    showCorrectAnswers: boolean;
    startDate?: Date;
    endDate?: Date;
    status: 'draft' | 'published' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

export interface QuizAttempt {
    id: string;
    quizId: string;
    studentId: string;
    answers: Record<string, string | string[]>;
    score: number;
    percentage: number;
    isPassed: boolean;
    startedAt: Date;
    submittedAt?: Date;
    attemptNumber: number;
}

export interface Assignment {
    id: string;
    title: string;
    description: string;
    batchId: string;
    subjectId: string;
    teacherId: string;
    attachments?: string[];
    dueDate: Date;
    totalMarks: number;
    allowLateSubmission: boolean;
    lateSubmissionPenalty?: number;
    status: 'draft' | 'published' | 'closed';
    createdAt: Date;
    updatedAt: Date;
}

export interface AssignmentSubmission {
    id: string;
    assignmentId: string;
    studentId: string;
    textContent?: string;
    attachments?: string[];
    submittedAt: Date;
    isLate: boolean;
    score?: number;
    feedback?: string;
    gradedBy?: string;
    gradedAt?: Date;
    resubmissionAllowed: boolean;
    version: number;
}

export interface Grade {
    id: string;
    studentId: string;
    batchId: string;
    subjectId: string;
    assessmentType: 'quiz' | 'assignment';
    assessmentId: string;
    score: number;
    totalMarks: number;
    percentage: number;
    grade?: string;
    remarks?: string;
    date: Date;
}
