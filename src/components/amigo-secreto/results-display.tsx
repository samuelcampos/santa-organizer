"use client";

import { useState, useEffect } from 'react';
import type { Assignment, RevealData } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, ClipboardCopy, Check, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from '@/hooks/use-i18n';
import { encodeData } from '@/lib/url-data';

interface ResultsDisplayProps {
  assignments: Assignment[];
  giftValue: number;
}

export function ResultsDisplay({ assignments, giftValue }: ResultsDisplayProps) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [organizerLink, setOrganizerLink] = useState('');

    useEffect(() => {
        const data = { assignments, giftValue };
        const encodedData = encodeData(data);
        const url = `${window.location.origin}/?organizerData=${encodeURIComponent(encodedData)}`;
        setOrganizerLink(url);
    }, [assignments, giftValue]);

    const handleCopyLink = (assignment: Assignment) => {
        const data: RevealData = {
          gifter: assignment.gifter.name,
          receiver: assignment.receiver.name,
          description: assignment.receiver.description,
          value: giftValue.toString()
        }
        
        const encodedParams = encodeData(data);
    
        const revealUrl = `${window.location.origin}/reveal?data=${encodeURIComponent(encodedParams)}`;
        navigator.clipboard.writeText(revealUrl);

        setCopiedLink(assignment.gifter.id);
        setTimeout(() => setCopiedLink(null), 2000);

        toast({
            title: t('link_copied_toast_title'),
            description: t('link_copied_toast_description', { name: assignment.gifter.name }),
        });
    }

    const handleCopyOrganizerLink = () => {
        navigator.clipboard.writeText(organizerLink);
        setCopiedLink('organizer');
        setTimeout(() => setCopiedLink(null), 2000);
        toast({
            title: t('organizer_link_copied_toast_title'),
            description: t('organizer_link_copied_toast_description'),
        });
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Link className="text-primary"/>
            {t('individual_links_title')}
        </CardTitle>
        <CardDescription>
            {t('individual_links_description')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border bg-card p-4 shadow-inner space-y-3">
            <div className='flex justify-between items-center'>
                <div>
                    <h4 className="font-semibold flex items-center gap-2"><Wrench className="text-primary" /> {t('organizer_link_title')}</h4>
                    <p className="text-sm text-muted-foreground">{t('organizer_link_description')}</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleCopyOrganizerLink}>
                    {copiedLink === 'organizer' ? (
                        <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            {t('copied_button')}
                        </>
                    ) : (
                        <>
                            <ClipboardCopy className="mr-2 h-4 w-4" />
                            {t('copy_button')}
                        </>
                    )}
                </Button>
            </div>
        </div>

        <ul className="space-y-3 pt-4">
          {assignments.map((assignment) => (
            <li key={assignment.gifter.id} className="flex items-center justify-between rounded-md border p-3 bg-background">
              <p className="font-semibold text-card-foreground">{assignment.gifter.name}</p>
              <Button variant="outline" size="sm" onClick={() => handleCopyLink(assignment)}>
                {copiedLink === assignment.gifter.id ? (
                    <>
                        <Check className="mr-2 h-4 w-4 text-green-500" />
                        {t('copied_button')}
                    </>
                ) : (
                    <>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        {t('copy_link_button')}
                    </>
                )}
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
