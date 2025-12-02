'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Home, Search, BookOpen, ArrowLeft, FileQuestion } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function NotFound() {
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            // Redirect to search or home page
            window.location.href = `/?search=${encodeURIComponent(searchQuery)}`
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500" />
            </div>

            <div className="relative z-10 max-w-4xl mx-auto text-center">
                {/* Glassmorphism Card */}
                <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-8 md:p-12 shadow-2xl">
                    {/* 404 Number */}
                    <div className="relative mb-8">
                        <h1 className="text-9xl md:text-[200px] font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                            404
                        </h1>
                        <FileQuestion className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 text-white/20 animate-spin-slow" />
                    </div>

                    {/* Main Message */}
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                        Oops! This Lesson Doesn't Exist
                    </h2>
                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Looks like this page skipped class! It might have been moved, deleted, or never existed in the first place.
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="mb-8 max-w-md mx-auto">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search for content, courses, or topics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-12 pr-4 py-6 bg-white/10 border-white/30 text-white placeholder:text-white/50 focus:bg-white/20 transition-all rounded-full text-lg"
                            />
                        </div>
                    </form>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href="/">
                            <Button
                                size="lg"
                                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-6 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                            >
                                <Home className="w-5 h-5 mr-2" />
                                Back to Home
                            </Button>
                        </Link>

                        <Link href="/dashboard">
                            <Button
                                size="lg"
                                variant="outline"
                                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-6 rounded-full text-lg font-semibold backdrop-blur-sm"
                            >
                                <BookOpen className="w-5 h-5 mr-2" />
                                Go to Dashboard
                            </Button>
                        </Link>
                    </div>

                    {/* Helpful Links */}
                    <div className="mt-12 pt-8 border-t border-white/20">
                        <p className="text-white/60 mb-4">Popular destinations:</p>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <Link href="/courses" className="text-white/80 hover:text-white transition-colors underline">
                                Courses
                            </Link>
                            <span className="text-white/40">•</span>
                            <Link href="/content" className="text-white/80 hover:text-white transition-colors underline">
                                Content Library
                            </Link>
                            <span className="text-white/40">•</span>
                            <Link href="/help" className="text-white/80 hover:text-white transition-colors underline">
                                Help Center
                            </Link>
                            <span className="text-white/40">•</span>
                            <Link href="/contact" className="text-white/80 hover:text-white transition-colors underline">
                                Contact Support
                            </Link>
                        </div>
                    </div>
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
                @keyframes spin-slow {
                    from {
                        transform: translateX(-50%) translateY(-50%) rotate(0deg);
                    }
                    to {
                        transform: translateX(-50%) translateY(-50%) rotate(360deg);
                    }
                }
                .animate-spin-slow {
                    animation: spin-slow 20s linear infinite;
                }
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
