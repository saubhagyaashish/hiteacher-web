'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function VerifyPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [isVerifying, setIsVerifying] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const token = searchParams.get('token')
    const type = searchParams.get('type') || 'email'

    useEffect(() => {
        if (!token) {
            setIsVerifying(false)
            return
        }

        // Mock verification API call
        const verify = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Simulate success (90% success rate)
            const success = Math.random() > 0.1
            setIsSuccess(success)
            setIsVerifying(false)
        }

        verify()
    }, [token])

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                            <XCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl">Invalid Verification Link</CardTitle>
                        <CardDescription>
                            The verification link is missing or invalid. Please check your email and try again.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push('/login')}>
                            Go to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    if (isVerifying) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4">
                            <Loader2 className="h-16 w-16 text-primary animate-spin" />
                        </div>
                        <CardTitle className="text-2xl">Verifying...</CardTitle>
                        <CardDescription>
                            Please wait while we verify your {type === 'email' ? 'email address' : 'account'}.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                            <CheckCircle2 className="h-8 w-8 text-secondary" />
                        </div>
                        <CardTitle className="text-2xl">Verification Successful!</CardTitle>
                        <CardDescription>
                            {type === 'email'
                                ? 'Your email has been verified successfully. You can now sign in to your account.'
                                : 'Your account has been verified. You can now access all features.'}
                        </CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                        <Button onClick={() => router.push('/login')}>
                            Continue to Login
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                        <XCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl">Verification Failed</CardTitle>
                    <CardDescription className="space-y-2">
                        <p>We couldn't verify your {type === 'email' ? 'email address' : 'account'}.</p>
                        <p className="text-sm">The link may have expired or already been used.</p>
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex flex-col gap-2">
                    <Button onClick={() => router.push('/login')}>
                        Go to Login
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        Need help?{' '}
                        <Link href="/contact" className="text-primary hover:underline">
                            Contact support
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
