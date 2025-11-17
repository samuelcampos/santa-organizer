import type { Participant } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, X, User, Pencil } from "lucide-react";
import { useI18n } from "@/hooks/use-i18n";
import { EditParticipantDialog } from "./edit-participant-dialog";

interface ParticipantListProps {
  participants: Participant[];
  removeParticipant: (id: string) => void;
  updateParticipant: (id: string, name: string, description: string) => void;
}

export function ParticipantList({ participants, removeParticipant, updateParticipant }: ParticipantListProps) {
  const { t } = useI18n();

  if (participants.length === 0) {
    return (
        <Card className="shadow-lg border-dashed">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline text-muted-foreground">
                    <Users/>
                    {t('participant_list_title')}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-center text-muted-foreground">{t('add_first_participant_message')}</p>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Users className="text-primary"/>
            {t('participant_list_title')} ({participants.length})
        </CardTitle>
        <CardDescription>{t('participant_list_description')}</CardDescription>
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
              <div className="flex self-end sm:self-center">
                <EditParticipantDialog participant={p} onSave={updateParticipant}>
                    <Button variant="ghost" size="icon" aria-label={t('edit_participant_label', { name: p.name })}>
                        <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </EditParticipantDialog>
                <Button variant="ghost" size="icon" onClick={() => removeParticipant(p.id)} aria-label={t('remove_participant_label', { name: p.name })} className="flex-shrink-0">
                    <X className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
