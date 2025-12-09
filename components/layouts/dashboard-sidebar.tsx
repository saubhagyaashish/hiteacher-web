'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    Calendar,
    MessageSquare,
    Settings,
    FileText,
    BarChart3,
    ClipboardList,
    ChevronLeft,
    ShieldCheck,
    UserCheck,
    X,
    LucideIcon
} from 'lucide-react'

interface SidebarProps {
    role: 'admin' | 'teacher' | 'student'
    isCollapsed: boolean
    onToggleCollapse: () => void
    isMobileOpen?: boolean
    onMobileClose?: () => void
}

interface NavItem {
    title: string
    href: string
    icon: LucideIcon
    badge?: string
}

const adminNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { title: 'Users', href: '/admin/users', icon: Users },
    { title: 'Approvals', href: '/admin/approvals', icon: UserCheck, badge: '12' },
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { title: 'Settings', href: '/admin/settings', icon: Settings },
]

const teacherNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/teacher/dashboard', icon: LayoutDashboard },
    { title: 'Batches', href: '/teacher/batches', icon: Users },
    { title: 'Students', href: '/teacher/students', icon: Users },
    { title: 'Subjects', href: '/teacher/subjects', icon: FileText },
    { title: 'Content', href: '/teacher/content', icon: BookOpen },
    { title: 'Classes', href: '/teacher/classes', icon: Calendar },
    { title: 'Assignments', href: '/teacher/assignments', icon: ClipboardList },
    { title: 'Analytics', href: '/teacher/analytics', icon: BarChart3 },
    { title: 'Settings', href: '/teacher/settings', icon: Settings },
]

const studentNavItems: NavItem[] = [
    { title: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
    { title: 'Schedule', href: '/student/schedule', icon: Calendar },
    { title: 'Content', href: '/student/content', icon: BookOpen },
    { title: 'Assignments', href: '/student/assignments', icon: ClipboardList, badge: '3' },
    { title: 'Messages', href: '/student/messages', icon: MessageSquare },
    { title: 'Progress', href: '/student/progress', icon: BarChart3 },
    { title: 'Settings', href: '/student/settings', icon: Settings },
]

export function DashboardSidebar({
    role,
    isCollapsed,
    onToggleCollapse,
    isMobileOpen = false,
    onMobileClose
}: SidebarProps) {
    const pathname = usePathname()

    const navItems =
        role === 'admin' ? adminNavItems :
            role === 'teacher' ? teacherNavItems :
                studentNavItems

    const roleConfig = {
        admin: { icon: ShieldCheck, label: 'Admin', color: 'text-primary' },
        teacher: { icon: BookOpen, label: 'Teacher', color: 'text-secondary' },
        student: { icon: Users, label: 'Student', color: 'text-accent' },
    }

    const config = roleConfig[role]
    const RoleIcon = config.icon

    // Close mobile sidebar when route changes
    useEffect(() => {
        if (isMobileOpen && onMobileClose) {
            onMobileClose()
        }
    }, [pathname])

    // Prevent body scroll when mobile sidebar is open
    useEffect(() => {
        if (isMobileOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMobileOpen])

    return (
        <>
            {/* Mobile Overlay/Backdrop */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                    onClick={onMobileClose}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                // Base styles
                "relative flex flex-col h-full border-r bg-card",
                // Mobile: Fixed overlay, hidden by default
                "fixed inset-y-0 left-0 z-50 transition-transform duration-300",
                !isMobileOpen && "-translate-x-full",
                // Desktop: Always visible, relative positioning
                "md:relative md:translate-x-0",
                // Width transitions
                "transition-all duration-300",
                isCollapsed ? "w-16" : "w-64"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    {!isCollapsed && (
                        <div className="flex items-center gap-2">
                            <RoleIcon className={cn("h-5 w-5", config.color)} />
                            <span className="font-semibold text-lg">Hi Teacher</span>
                        </div>
                    )}

                    {/* Desktop: Collapse button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onToggleCollapse}
                        className={cn(
                            "h-8 w-8 hidden md:flex",
                            isCollapsed && "mx-auto"
                        )}
                    >
                        <ChevronLeft className={cn(
                            "h-4 w-4 transition-transform",
                            isCollapsed && "rotate-180"
                        )} />
                    </Button>

                    {/* Mobile: Close button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onMobileClose}
                        className="h-8 w-8 md:hidden"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                {/* Role Badge */}
                {!isCollapsed && (
                    <div className="px-4 py-3">
                        <Badge variant="secondary" className="w-full justify-center">
                            {config.label} Portal
                        </Badge>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto p-2">
                    <ul className="space-y-1">
                        {navItems.map((item) => {
                            const Icon = item.icon
                            const isActive = pathname === item.href

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            // Base styles - minimum 44px touch target
                                            "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition-colors",
                                            // Active state
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            // Collapsed state
                                            isCollapsed && "justify-center",
                                            // Touch feedback
                                            "active:scale-95 active:opacity-80"
                                        )}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        {!isCollapsed && (
                                            <>
                                                <span className="flex-1">{item.title}</span>
                                                {item.badge && (
                                                    <Badge variant="destructive" className="h-5 px-1.5 text-xs">
                                                        {item.badge}
                                                    </Badge>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </nav>

                {/* Footer */}
                {!isCollapsed && (
                    <div className="p-4 border-t">
                        <div className="text-xs text-muted-foreground space-y-1">
                            <p className="font-medium">Hi Teacher LMS</p>
                            <p>v1.0.0 - Phase 11</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}
