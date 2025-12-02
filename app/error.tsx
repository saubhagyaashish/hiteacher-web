'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Home, RefreshCw, Mail, AlertTriangle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const [errorId] = useState(() => {
        // Generate a unique error ID for support reference
        return `ERR-${Date.now().toString(36).toUpperCase()}`
    })
    const [countdown, setCountdown] = useState(30)
    const [autoRetry, setAutoRetry] = useState(true)

    useEffect(() => {
        // Log error for monitoring
        console.error('Application Error:', error)
    }, [error])

    useEffect(() => {
        if (!autoRetry || countdown <= 0) return

        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    reset()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [autoRetry, countdown, reset])

    const handleRetry = () => {
        setCountdown(30)
        reset()
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-900 via-red-900 to-pink-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* Error Icon */}
                    <div className="relative mb-8 inline-block">
                        <div className="w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center shadow-xl animate-pulse">
                            <AlertTriangle className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute inset-0 w-32 h-32 mx-auto bg-gradient-to-br from-orange-400 to-red-500 rounded-full blur-xl opacity-50 animate-ping" />
                    </div>

                    {/* 500 Number */}
                    <h1 className="text-7xl md:text-8xl font-bold bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent mb-4">
                        500
                    </h1>

                    {/* Main Message */}
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Our Servers Need a Study Break
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Don't worry, it's not you – it's us! Our servers encountered an unexpected error. We've been notified and are working to fix it.
                    </p>

                    {/* Error ID */}
                    <div className="mb-8 p-4 bg-white/10 border border-white/20 rounded-xl backdrop-blur-sm inline-block">
                        <p className="text-sm text-white/60 mb-1">Error Reference ID</p>
                        <p className="text-lg font-mono text-white font-semibold">{errorId}</p>
                        <p className="text-xs text-white/40 mt-1">Quote this ID when contacting support</p>
                    </div>

                    {/* Auto-retry countdown */}
                    {autoRetry && countdown > 0 && (
                        <div className="mb-8">
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-full backdrop-blur-sm">
                                <RefreshCw className="w-5 h-5 text-white/80 animate-spin" />
                                <span className="text-white/80">
                                    Auto-retrying in <span className="font-bold text-white">{countdown}</span> seconds
                                </span>
                            </div>
                            <button
                                onClick={() => setAutoRetry(false)}
                                className="block mx-auto mt-2 text-sm text-white/60 hover:text-white transition-colors underline"
                            >
                                Cancel auto-retry
                            </button>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                        <Button
                            onClick={handleRetry}
                            size="lg"
                            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                        >
                            <RefreshCw className="w-5 h-5 mr-2" />
                            Try Again Now
                        </Button>

                        <Link href="/">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-6 rounded-full text-lg font-semibold backdrop-blur-sm"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
                        </Link>
                    </div>

                    {/* Contact Support */}
                    <div className="pt-8 border-t border-white/20">
                        <p className="text-white/60 mb-4">Still having issues?</p>
                        <Link href="/contact">
                            <Button
                                variant="ghost"
                                className="text-white hover:text-white/80 hover:bg-white/10"
                            >
                                <Mail className="w-4 h-4 mr-2" />
                                Contact Support
                            </Button>
                        </Link>
                    </div>

                    {/* Technical Details (Optional - for development) */}
                    {process.env.NODE_ENV === 'development' && (
                        <details className="mt-8 text-left">
                            <summary className="cursor-pointer text-white/60 hover:text-white transition-colors">
                                Technical Details (Development Only)
                            </summary>
                            <div className="mt-4 p-4 bg-black/30 rounded-lg overflow-auto max-h-64">
                                <p className="text-red-400 font-mono text-sm break-all">
                                    {error.message}
                                </p>
                                {error.digest && (
                                    <p className="text-white/60 font-mono text-xs mt-2">
                                        Digest: {error.digest}
                                    </p>
                                )}
                            </div>
                        </details>
                    )}
                </div>

                {/* Back Button */}
                <button
                    onClick={() => window.history.back()}
                    className="mt-6 text-white/60 hover:text-white transition-colors flex items-center gap-2 mx-auto"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go back to previous page
                </button>
            </div>

            <style jsx global>{`
                .delay-500 {
                    animation-delay: 500ms;
                }
                .delay-1000 {
                    animation-delay: 1000ms;
                }
            `}</style>
        </div>
    )
}
