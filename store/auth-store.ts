import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,

            login: async (email: string, password: string) => {
                set({ isLoading: true });

                // Mock API delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Mock user based on email (simplified for demo)
                let mockUser: User | null = null;

                if (email === 'admin@hiteacher.com') {
                    mockUser = {
                        id: 'a1',
                        email: email,
                        name: 'Admin User',
                        role: 'admin',
                        status: 'active',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                } else if (email.includes('teacher')) {
                    mockUser = {
                        id: 't1',
                        email: email,
                        name: 'John Doe',
                        role: 'teacher',
                        status: 'active',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                } else {
                    mockUser = {
                        id: 's1',
                        email: email,
                        name: 'Alice Johnson',
                        role: 'student',
                        status: 'active',
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    };
                }

                const mockToken = `mock_token_${mockUser.id}_${Date.now()}`;

                set({
                    user: mockUser,
                    token: mockToken,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            logout: () => {
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user) => {
                set({ user, isAuthenticated: !!user });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
