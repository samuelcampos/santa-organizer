
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

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      let message = '';
      
      // Before the draw, if there are participants
      if (participants.length > 0 && !assignments) {
        message = t('leave_warning_before_draw');
      }
      
      // After the draw
      if (assignments) {
        message = t('leave_warning_after_draw');
      }

      if (message) {
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [participants, assignments, t]);


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

  const updateParticipant = (id: string, name: string, description: string) => {
    // Check if another participant already has the new name
    if (participants.some(p => p.id !== id && p.name.trim().toLowerCase() === name.trim().toLowerCase())) {
        toast({
            title: t('participant_exists_error_title'),
            description: t('participant_exists_error_description', { name }),
            variant: "destructive",
        });
        return;
    }
    setParticipants(prev => prev.map(p => p.id === id ? { ...p, name: name.trim(), description: description.trim() } : p));
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

    const givers = [...participants];
    let receivers = [...participants];

    // Shuffle both lists to ensure randomness
    for (let i = givers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [givers[i], givers[j]] = [givers[j], givers[i]];
        [receivers[i], receivers[j]] = [receivers[j], receivers[i]];
    }

    const newAssignments: Assignment[] = [];
    let selfDrawFound: boolean;

    do {
      selfDrawFound = false;
      for(let i=0; i<givers.length; i++) {
        if(givers[i].id === receivers[i].id) {
          // If a self-draw is found, swap with the next receiver.
          // This simple swap works for nearly all cases.
          const nextIndex = (i + 1) % receivers.length;
          [receivers[i], receivers[nextIndex]] = [receivers[nextIndex], receivers[i]];
          selfDrawFound = true; // Set flag to re-check the list
          break; // Exit the for-loop and restart the check
        }
      }
    } while (selfDrawFound);


    for (let i = 0; i < givers.length; i++) {
        newAssignments.push({
            gifter: givers[i],
            receiver: receivers[i],
        });
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
                <ParticipantList 
                    participants={participants} 
                    removeParticipant={removeParticipant} 
                    updateParticipant={updateParticipant}
                />
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
