import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add routes that don't require authentication
const publicRoutes = ['/', '/auth/login', '/auth/register', '/auth/forgot-password', '/auth/verify'];

// Role-based route mapping
const roleRoutes = {
    admin: '/admin',
    teacher: '/teacher',
    student: '/student',
};

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public routes
    if (publicRoutes.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Check authentication (in a real app, verify JWT token)
    const authToken = request.cookies.get('auth-token')?.value;

    if (!authToken) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // Role-based access control (simplified for mock)
    // In production, decode JWT to get user role
    const userRole = request.cookies.get('user-role')?.value as keyof typeof roleRoutes;

    if (userRole && roleRoutes[userRole]) {
        const allowedPrefix = roleRoutes[userRole];

        // If user tries to access a route not for their role, redirect
        if (pathname.startsWith('/admin') && userRole !== 'admin') {
            return NextResponse.redirect(new URL(roleRoutes[userRole] + '/dashboard', request.url));
        }
        if (pathname.startsWith('/teacher') && userRole !== 'teacher') {
            return NextResponse.redirect(new URL(roleRoutes[userRole] + '/dashboard', request.url));
        }
        if (pathname.startsWith('/student') && userRole !== 'student') {
            return NextResponse.redirect(new URL(roleRoutes[userRole] + '/dashboard', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
