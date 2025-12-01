'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { Loader2, Eye, EyeOff, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { teacherRegistrationSchema, type TeacherRegistrationFormData } from '@/lib/validations/auth'

const SUBJECTS = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'English', 'History', 'Geography', 'Computer Science',
    'Economics', 'Business Studies', 'Accountancy', 'Other'
]

export default function TeacherRegisterPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedSubjects, setSelectedSubjects] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors },
        trigger,
        setValue,
    } = useForm<TeacherRegistrationFormData>({
        resolver: zodResolver(teacherRegistrationSchema),
    })

    const toggleSubject = (subject: string) => {
        const updated = selectedSubjects.includes(subject)
            ? selectedSubjects.filter(s => s !== subject)
            : [...selectedSubjects, subject]
        setSelectedSubjects(updated)
        setValue('subjects', updated)
    }

    const handleNext = async () => {
        const isValid = await trigger(['name', 'email', 'password', 'confirmPassword', 'phoneNumber'])
        if (isValid) setStep(2)
    }

    const onSubmit = async (data: TeacherRegistrationFormData) => {
        setIsLoading(true)

        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsLoading(false)
        setSuccess(true)
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                            <Check className="h-8 w-8 text-secondary" />
                        </div>
                        <CardTitle className="text-2xl">Application Submitted!</CardTitle>
                        <CardDescription className="space-y-2">
                            <p>Your teacher registration has been submitted for verification.</p>
                            <p className="text-sm">Our team will review your application and notify you via email within 24-48 hours.</p>
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

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 py-12">
            <Card className="w-full max-w-2xl">
                <CardHeader className="space-y-2">
                    <Link
                        href="/login"
                        className="flex items-center text-sm text-muted-foreground hover:text-foreground"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                    <div className="flex items-center justify-between">
                        <Badge variant="secondary">Teacher Registration</Badge>
                        <Badge variant="outline">Step {step} of 2</Badge>
                    </div>
                    <CardTitle className="text-3xl font-bold">Join as a Teacher</CardTitle>
                    <CardDescription>
                        {step === 1 ? 'Personal information' : 'Professional details'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Progress Indicator */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between mb-2">
                            <span className={`text-sm ${step >= 1 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                Personal Info
                            </span>
                            <span className={`text-sm ${step >= 2 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                                Professional Details
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className="h-full bg-primary transition-all duration-300"
                                style={{ width: `${(step / 2) * 100}%` }}
                            />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {step === 1 && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="Dr. John Doe"
                                        {...register('name')}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address *</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            {...register('email')}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-destructive">{errors.email.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phoneNumber">Phone Number *</Label>
                                        <Input
                                            id="phoneNumber"
                                            type="tel"
                                            placeholder="+1234567890"
                                            {...register('phoneNumber')}
                                        />
                                        {errors.phoneNumber && (
                                            <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password *</Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                {...register('password')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.password && (
                                            <p className="text-sm text-destructive">{errors.password.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="••••••••"
                                                {...register('confirmPassword')}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </button>
                                        </div>
                                        {errors.confirmPassword && (
                                            <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                </div>

                                <Button type="button" onClick={handleNext} className="w-full">
                                    Next Step
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </>
                        )}

                        {step === 2 && (
                            <>
                                <div className="space-y-2">
                                    <Label>Subjects You Teach *</Label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                        {SUBJECTS.map((subject) => (
                                            <button
                                                key={subject}
                                                type="button"
                                                onClick={() => toggleSubject(subject)}
                                                className={`p-2 text-sm rounded-md border transition-colors ${selectedSubjects.includes(subject)
                                                    ? 'bg-primary text-primary-foreground border-primary'
                                                    : 'bg-background hover:bg-muted border-input'
                                                    }`}
                                            >
                                                {subject}
                                            </button>
                                        ))}
                                    </div>
                                    <input type="hidden" {...register('subjects')} />
                                    {errors.subjects && (
                                        <p className="text-sm text-destructive">{errors.subjects.message}</p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="qualification">Highest Qualification *</Label>
                                        <Input
                                            id="qualification"
                                            placeholder="M.Sc. Physics"
                                            {...register('qualification')}
                                        />
                                        {errors.qualification && (
                                            <p className="text-sm text-destructive">{errors.qualification.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="experience">Years of Experience</Label>
                                        <Input
                                            id="experience"
                                            type="number"
                                            placeholder="5"
                                            {...register('experience', { valueAsNumber: true })}
                                        />
                                        {errors.experience && (
                                            <p className="text-sm text-destructive">{errors.experience.message}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio">Short Bio</Label>
                                    <textarea
                                        id="bio"
                                        rows={4}
                                        placeholder="Tell us about yourself and your teaching experience..."
                                        {...register('bio')}
                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                    {errors.bio && (
                                        <p className="text-sm text-destructive">{errors.bio.message}</p>
                                    )}
                                </div>

                                <div className="p-4 rounded-md bg-muted/50 border text-sm">
                                    <p className="font-medium mb-1">Verification Process</p>
                                    <p className="text-muted-foreground text-xs">
                                        After submission, our team will review your credentials. You'll receive an email within 24-48 hours with the verification status.
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                                        <ArrowLeft className="mr-2 h-4 w-4" />
                                        Back
                                    </Button>
                                    <Button type="submit" disabled={isLoading} className="flex-1">
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Application
                                    </Button>
                                </div>
                            </>
                        )}
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center">
                    <p className="text-sm text-muted-foreground">
                        Already have an account?{' '}
                        <Link href="/login" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
