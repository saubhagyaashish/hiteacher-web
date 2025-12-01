'use client'

import { Bell, Search, LogOut, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { useAuthStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
    title: string
    subtitle?: string
}

export function DashboardHeader({ title, subtitle }: DashboardHeaderProps) {
    const router = useRouter()
    const { user, logout } = useAuthStore()

    const handleLogout = () => {
        logout()
        router.push('/login')
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center gap-4 px-6">
                {/* Title */}
                <div className="flex-1">
                    <h1 className="text-lg font-semibold">{title}</h1>
                    {subtitle && (
                        <p className="text-sm text-muted-foreground">{subtitle}</p>
                    )}
                </div>

                {/* Search */}
                <div className="hidden md:flex items-center w-64">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="pl-8 h-9"
                        />
                    </div>
                </div>

                {/* Notifications */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5" />
                            <Badge
                                variant="destructive"
                                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                            >
                                3
                            </Badge>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Notifications</DialogTitle>
                            <DialogDescription>
                                You have 3 unread notifications
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">New student enrolled</p>
                                    <p className="text-xs text-muted-foreground">
                                        Alice Johnson joined Mathematics batch
                                    </p>
                                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Assignment submitted</p>
                                    <p className="text-xs text-muted-foreground">
                                        Bob Williams submitted Physics homework
                                    </p>
                                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-md hover:bg-muted cursor-pointer">
                                <div className="h-2 w-2 rounded-full bg-secondary mt-2" />
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Class reminder</p>
                                    <p className="text-xs text-muted-foreground">
                                        Chemistry class starts in 1 hour
                                    </p>
                                    <p className="text-xs text-muted-foreground">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

                {/* User Menu */}
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="gap-2 pl-2 pr-3">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar} />
                                <AvatarFallback className="text-xs">
                                    {user?.name ? getInitials(user.name) : 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden md:inline text-sm font-medium">
                                {user?.name}
                            </span>
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Account</DialogTitle>
                            <DialogDescription>
                                Manage your account settings
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="text-lg">
                                        {user?.name ? getInitials(user.name) : 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user?.name}</p>
                                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                                    <Badge variant="secondary" className="mt-1">
                                        {user?.role}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <Button variant="outline" className="justify-start gap-2">
                                    <User className="h-4 w-4" />
                                    Profile Settings
                                </Button>
                                <Button
                                    variant="outline"
                                    className="justify-start gap-2 text-destructive hover:text-destructive"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </header>
    )
}
