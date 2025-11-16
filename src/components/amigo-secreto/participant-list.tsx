import type { Participant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, X, User } from "lucide-react";

interface ParticipantListProps {
  participants: Participant[];
  removeParticipant: (id: string) => void;
}

export function ParticipantList({ participants, removeParticipant }: ParticipantListProps) {
  if (participants.length === 0) {
    return (
        <Card className="shadow-lg border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-muted-foreground">
                    <Users/>
                    Lista de Participantes
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">Adicione o primeiro participante para começar!</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Users className="text-primary"/>
            Lista de Participantes ({participants.length})
        </CardTitle>
        <CardDescription>Revise a lista antes de realizar o sorteio.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {participants.map((p) => (
            <li key={p.id} className="flex items-start sm:items-center justify-between gap-4 rounded-md border p-3 bg-background hover:bg-muted/80 transition-colors flex-col sm:flex-row">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1 sm:mt-0">
                    <User className="h-5 w-5 text-primary"/>
                </div>
                <div className="flex-1">
                    <p className="font-semibold text-card-foreground">{p.name}</p>
                    <p className="text-sm text-muted-foreground break-words">{p.description}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeParticipant(p.id)} aria-label={`Remover ${p.name}`} className="flex-shrink-0 self-end sm:self-center">
                <X className="h-4 w-4 text-destructive" />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
