"use client";

import { useState, useEffect } from 'react';
import type { Assignment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, ClipboardCopy, Check, Wrench } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  assignments: Assignment[];
  giftValue: number;
}

export function ResultsDisplay({ assignments, giftValue }: ResultsDisplayProps) {
    const { toast } = useToast();
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [organizerLink, setOrganizerLink] = useState('');

    useEffect(() => {
        const data = { assignments, giftValue };
        const encodedData = btoa(encodeURIComponent(JSON.stringify(data)));
        const url = `${window.location.origin}/?organizerData=${encodedData}`;
        setOrganizerLink(url);
    }, [assignments, giftValue]);

    const handleCopyLink = (assignment: Assignment) => {
        const params = new URLSearchParams();
        params.set('gifter', assignment.gifter.name);
        params.set('receiver', assignment.receiver.name);
        params.set('description', assignment.receiver.description);
        params.set('value', giftValue.toString());
        
        const encodedParams = btoa(encodeURIComponent(params.toString()));
    
        const revealUrl = `${window.location.origin}/reveal?data=${encodedParams}`;
        navigator.clipboard.writeText(revealUrl);

        setCopiedLink(assignment.gifter.id);
        setTimeout(() => setCopiedLink(null), 2000);

        toast({
            title: "Link Copiado!",
            description: `O link para ${assignment.gifter.name} foi copiado.`,
        });
    }

    const handleCopyOrganizerLink = () => {
        navigator.clipboard.writeText(organizerLink);
        setCopiedLink('organizer');
        setTimeout(() => setCopiedLink(null), 2000);
        toast({
            title: "Link do Organizador Copiado!",
            description: `Guarde este link para aceder aos resultados mais tarde.`,
        });
    }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Link className="text-primary"/>
            Links Individuais
        </CardTitle>
        <CardDescription>
            Copie e envie o link para cada participante. Não se preocupe, o link só revela o amigo secreto de cada um.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="rounded-lg border bg-card p-4 shadow-inner space-y-3">
            <div className='flex justify-between items-center'>
                <div>
                    <h4 className="font-semibold flex items-center gap-2"><Wrench className="text-primary" /> Link do Organizador</h4>
                    <p className="text-sm text-muted-foreground">Guarde este link para voltar a esta página.</p>
                </div>
                <Button variant="secondary" size="sm" onClick={handleCopyOrganizerLink}>
                    {copiedLink === 'organizer' ? (
                        <>
                            <Check className="mr-2 h-4 w-4 text-green-500" />
                            Copiado!
                        </>
                    ) : (
                        <>
                            <ClipboardCopy className="mr-2 h-4 w-4" />
                            Copiar
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
                        Copiado!
                    </>
                ) : (
                    <>
                        <ClipboardCopy className="mr-2 h-4 w-4" />
                        Copiar Link
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
