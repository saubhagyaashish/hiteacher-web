'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuthStore } from '@/store/auth-store'
import { loginSchema, type LoginFormData } from '@/lib/validations/auth'

export default function LoginPage() {
    const router = useRouter()
    const { login } = useAuthStore()
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true)
        setError(null)

        try {
            // Mock API call with delay
            await login(data.email, data.password)

            // Get user from store to determine redirect
            const user = useAuthStore.getState().user

            // Role-based redirect
            if (user?.role === 'admin') {
                router.push('/admin/dashboard')
            } else if (user?.role === 'teacher') {
                router.push('/teacher/dashboard')
            } else if (user?.role === 'student') {
                router.push('/student/dashboard')
            }
        } catch (err) {
            setError('Invalid email or password')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-2 text-center">
                    <Badge variant="secondary" className="mx-auto w-fit mb-2">
                        Hi Teacher LMS
                    </Badge>
                    <CardTitle className="text-3xl font-bold">Welcome Back</CardTitle>
                    <CardDescription>
                        Sign in to your account to continue
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {error && (
                            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                {...register('email')}
                                disabled={isLoading}
                            />
                            {errors.email && (
                                <p className="text-sm text-destructive">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Link
                                    href="/forgot-password"
                                    className="text-sm text-primary hover:underline"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    {...register('password')}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-destructive">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="rememberMe"
                                {...register('rememberMe')}
                                className="h-4 w-4 rounded border-input"
                            />
                            <Label htmlFor="rememberMe" className="text-sm font-normal cursor-pointer">
                                Remember me for 30 days
                            </Label>
                        </div>

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Sign In
                        </Button>
                    </form>

                    {/* Demo credentials hint */}
                    <div className="mt-6 p-4 rounded-md bg-muted/50 border text-sm space-y-2">
                        <p className="font-medium text-muted-foreground">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-muted-foreground">
                            <p><strong>Admin:</strong> admin@hiteacher.com</p>
                            <p><strong>Teacher:</strong> teacher@example.com</p>
                            <p><strong>Student:</strong> student@example.com</p>
                            <p className="text-xs italic">Password: any text (6+ chars)</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link href="/register/student" className="text-primary hover:underline">
                            Sign up as Student
                        </Link>
                        {' or '}
                        <Link href="/register/teacher" className="text-primary hover:underline">
                            Join as Teacher
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}
