'use client'

import { MeetingLink as MeetingLinkType } from '@/types/class'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Video, Copy, ExternalLink, Lock } from 'lucide-react'
import { useState } from 'react'

interface MeetingLinkProps {
    meetingLink: MeetingLinkType
    startTime: Date
    showJoinButton?: boolean
}

export function MeetingLink({ meetingLink, startTime, showJoinButton = true }: MeetingLinkProps) {
    const [copied, setCopied] = useState(false)

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy:', err)
        }
    }

    const getPlatformIcon = () => {
        // In a real app, you'd use actual platform logos
        return <Video className="w-5 h-5" />
    }

    const getPlatformName = () => {
        switch (meetingLink.platform) {
            case 'zoom':
                return 'Zoom'
            case 'google-meet':
                return 'Google Meet'
            case 'ms-teams':
                return 'Microsoft Teams'
            default:
                return 'Online Meeting'
        }
    }

    const canJoinNow = () => {
        const now = new Date()
        const classStart = new Date(startTime)
        const tenMinsBefore = new Date(classStart.getTime() - 10 * 60 * 1000)
        return now >= tenMinsBefore
    }

    const handleJoinMeeting = () => {
        window.open(meetingLink.url, '_blank', 'noopener,noreferrer')
    }

    return (
        <Card>
            <CardContent className="p-4">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        {getPlatformIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1">{getPlatformName()}</h4>

                        {/* Meeting URL */}
                        <div className="flex items-center gap-2 mb-2">
                            <p className="text-xs text-muted-foreground truncate flex-1">
                                {meetingLink.url}
                            </p>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(meetingLink.url)}
                                className="h-6 px-2"
                            >
                                {copied ? (
                                    <span className="text-xs">Copied!</span>
                                ) : (
                                    <Copy className="w-3 h-3" />
                                )}
                            </Button>
                        </div>

                        {/* Meeting ID */}
                        {meetingLink.meetingId && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                                <span className="font-medium">ID:</span>
                                <span>{meetingLink.meetingId}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(meetingLink.meetingId!)}
                                    className="h-5 px-1"
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        )}

                        {/* Password */}
                        {meetingLink.password && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                                <Lock className="w-3 h-3" />
                                <span className="font-medium">Password:</span>
                                <span>{meetingLink.password}</span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(meetingLink.password!)}
                                    className="h-5 px-1"
                                >
                                    <Copy className="w-3 h-3" />
                                </Button>
                            </div>
                        )}

                        {/* Notes */}
                        {meetingLink.notes && (
                            <p className="text-xs text-muted-foreground italic mb-2">
                                {meetingLink.notes}
                            </p>
                        )}

                        {/* Join Button */}
                        {showJoinButton && (
                            <Button
                                size="sm"
                                onClick={handleJoinMeeting}
                                disabled={!canJoinNow()}
                                className="w-full mt-2"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                {canJoinNow() ? 'Join Meeting' : 'Meeting Not Yet Available'}
                            </Button>
                        )}

                        {!canJoinNow() && showJoinButton && (
                            <p className="text-xs text-muted-foreground text-center mt-1">
                                Available 10 minutes before class
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
