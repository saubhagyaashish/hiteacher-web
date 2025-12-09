'use client'

import { useState } from 'react'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'

interface DashboardLayoutProps {
    children: React.ReactNode
    role: 'admin' | 'teacher' | 'student'
    title: string
    subtitle?: string
}

export function DashboardLayout({ children, role, title, subtitle }: DashboardLayoutProps) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar */}
            <DashboardSidebar
                role={role}
                isCollapsed={isSidebarCollapsed}
                onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                isMobileOpen={isMobileSidebarOpen}
                onMobileClose={() => setIsMobileSidebarOpen(false)}
            />

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                <DashboardHeader
                    title={title}
                    subtitle={subtitle}
                    onMobileMenuClick={() => setIsMobileSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-primary/5 via-background to-secondary/5">
                    {/* Responsive padding: mobile (p-4), tablet (p-6), desktop (p-8) */}
                    <div className="container mx-auto p-4 md:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
