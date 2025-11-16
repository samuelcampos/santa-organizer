"use client";

import { useState } from 'react';
import type { Assignment } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, ClipboardCopy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ResultsDisplayProps {
  assignments: Assignment[];
  giftValue: number;
}

export function ResultsDisplay({ assignments, giftValue }: ResultsDisplayProps) {
    const { toast } = useToast();
    const [copiedLink, setCopiedLink] = useState<string | null>(null);

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
      <CardContent>
        <ul className="space-y-3">
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
