
"use client";

import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Share2 } from 'lucide-react';
import { XIcon, FacebookIcon, WhatsAppIcon } from './social-icons';

export function ShareSection() {
    const { t } = useI18n();
    const [shareUrl, setShareUrl] = useState('');

    useEffect(() => {
        setShareUrl(window.location.origin);
    }, []);

    const shareText = t('share_text');
    const emailSubject = t('share_email_subject');

    const socialLinks = [
        {
            name: "WhatsApp",
            icon: <WhatsAppIcon className="h-6 w-6" />,
            url: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        },
        {
            name: "Facebook",
            icon: <FacebookIcon className="h-6 w-6" />,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: "X",
            icon: <XIcon className="h-6 w-6" />,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`
        },
        {
            name: "Email",
            icon: <Mail className="h-6 w-6" />,
            url: `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        }
    ];

    return (
        <Card className="w-full max-w-2xl mt-12 animate-fade-in shadow-lg">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 font-headline">
                    <Share2 className="text-primary h-6 w-6"/>
                    {t('share_title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center items-center gap-2 sm:gap-4">
                {socialLinks.map(link => (
                    <Button 
                        key={link.name} 
                        variant="outline" 
                        size="icon" 
                        asChild
                        className="h-12 w-12 sm:h-14 sm:w-14 rounded-full transition-transform transform hover:scale-110 hover:bg-accent/20"
                    >
                        <a href={link.url} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${link.name}`}>
                            {link.icon}
                        </a>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}
