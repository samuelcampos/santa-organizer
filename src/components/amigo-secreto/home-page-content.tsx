"use client";

import { useState, useEffect } from "react";
import type { Participant, Assignment } from "@/lib/types";
import { ParticipantForm } from "@/components/amigo-secreto/participant-form";
import { ParticipantList } from "@/components/amigo-secreto/participant-list";
import { ResultsDisplay } from "@/components/amigo-secreto/results-display";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/components/logo";
import { Shuffle, PartyPopper, RotateCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/hooks/use-i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ShareSection } from "./share-section";
import { decodeData } from "@/lib/url-data";

export function HomePageContent() {
  const { t } = useI18n();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [giftValue, setGiftValue] = useState<number>(30);
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const { toast } = useToast();
  const searchParams = useSearchParams();

  useEffect(() => {
    const data = searchParams.get('organizerData');
    if (data) {
      try {
        const parsedData = decodeData<{ assignments: Assignment[]; giftValue: number }>(data);
        if (parsedData.assignments && parsedData.giftValue) {
          setAssignments(parsedData.assignments);
          setGiftValue(parsedData.giftValue);
          // Reconstruct participants from assignments
          const allParticipants = parsedData.assignments.map((a: Assignment) => a.gifter);
          setParticipants(allParticipants);
        }
      } catch (e) {
        console.error("Failed to parse organizer data", e);
        toast({
            title: t('load_data_error_title'),
            description: t('load_data_error_description'),
            variant: "destructive",
        });
      }
    }
  }, [searchParams, toast, t]);


  const addParticipant = (name: string, description: string) => {
    if (participants.find(p => p.name.trim().toLowerCase() === name.trim().toLowerCase())) {
        toast({
            title: t('participant_exists_error_title'),
            description: t('participant_exists_error_description', { name }),
            variant: "destructive",
        });
        return;
    }
    const newParticipant: Participant = { id: crypto.randomUUID(), name: name.trim(), description: description.trim() };
    setParticipants(prev => [...prev, newParticipant]);
  };

  const removeParticipant = (id: string) => {
    setParticipants(prev => prev.filter(p => p.id !== id));
  };

  const handleDraw = () => {
    if (participants.length < 2) {
      toast({
        title: t('draw_error_title'),
        description: t('draw_error_description'),
        variant: "destructive",
      });
      return;
    }

    let shuffled = [...participants];
    let newAssignments: Assignment[] = [];
    let attempts = 0;

    // This loop prevents a participant from drawing themselves.
    while (attempts < 10) {
        shuffled = [...participants].sort(() => Math.random() - 0.5);
        newAssignments = shuffled.map((participant, index) => ({
            gifter: participant,
            receiver: shuffled[(index + 1) % shuffled.length],
        }));

        const selfDraw = newAssignments.some(a => a.gifter.id === a.receiver.id);
        if (!selfDraw) {
            break;
        }
        attempts++;
    }

    // Fallback for the rare case the loop fails (e.g., only 2 participants)
    if (newAssignments.some(a => a.gifter.id === a.receiver.id)) {
        // Simple swap for 2 participants drawing themselves
        if (newAssignments.length === 2) {
             const [a1, a2] = newAssignments;
             newAssignments = [
                 { gifter: a1.gifter, receiver: a2.receiver },
                 { gifter: a2.gifter, receiver: a1.receiver }
             ];
        } else {
             // More complex logic would be needed for > 2, but random shuffle is very likely to succeed.
             // For simplicity, we accept the small chance of failure and let the user re-draw.
             toast({
                title: t('draw_internal_error_title'),
                description: t('draw_internal_error_description'),
                variant: "destructive",
             });
             return;
        }
    }

    setAssignments(newAssignments);
  };
  
  const resetGame = () => {
    setParticipants([]);
    setAssignments(null);
    setGiftValue(30);
    // Clear URL params
    window.history.pushState({}, '', '/');
  };

  return (
    <main className="container mx-auto flex min-h-screen flex-col items-center p-4 md:p-8">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <header className="mb-8 text-center">
        <Logo />
        <p className="mt-2 text-muted-foreground">
          {t('app_subtitle')}
        </p>
      </header>

      {assignments ? (
        <div className="w-full max-w-2xl animate-fade-in">
            <Card className="mb-6 shadow-lg border-accent">
                <CardContent className="p-6 text-center">
                    <PartyPopper className="mx-auto h-16 w-16 text-accent animate-bounce" />
                    <h2 className="mt-4 text-3xl font-bold text-primary font-headline">{t('draw_complete_title')}</h2>
                    <p className="mt-2 text-muted-foreground">
                        {t('draw_complete_subtitle')}
                    </p>
                </CardContent>
            </Card>
            <ResultsDisplay assignments={assignments} giftValue={giftValue} />
            <Button onClick={resetGame} variant="outline" className="mt-8 w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('start_new_draw_button')}
            </Button>
        </div>
      ) : (
        <div className="w-full max-w-2xl space-y-8">
          <ParticipantForm addParticipant={addParticipant} setGiftValue={setGiftValue} giftValue={giftValue} />
          
          {participants.length > 0 && (
            <div className="animate-fade-in">
                <ParticipantList participants={participants} removeParticipant={removeParticipant} />
            </div>
          )}

          {participants.length > 0 && (
            <div className="animate-fade-in">
                <Button 
                    onClick={handleDraw} 
                    disabled={participants.length < 2}
                    className="w-full text-lg py-6 bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg transition-transform transform hover:scale-105"
                >
                <Shuffle className="mr-2 h-6 w-6" />
                {t('perform_draw_button')}
                </Button>
                {participants.length < 2 && (
                    <p className="text-center text-sm text-destructive/80 mt-2">
                        {t('add_more_participants_message', { count: 2 - participants.length })}
                    </p>
                )}
            </div>
          )}
        </div>
      )}

      <ShareSection />
    </main>
  );
}
