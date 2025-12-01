'use client';

import { useAuthStore } from '@/store/auth-store';

export function useAuth() {
    const { user, token, isAuthenticated, isLoading, login, logout, setUser } = useAuthStore();

    return {
        user,
        token,
        isAuthenticated,
        isLoading,
        login,
        logout,
        setUser,
    };
}
