"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Participant } from "@/lib/types";
import { useI18n } from "@/hooks/use-i18n";

const formSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation_name_min') }).max(50, { message: t('validation_name_max') }),
  description: z.string().max(200, { message: t('validation_desc_max') }).optional(),
});

interface EditParticipantDialogProps {
  participant: Participant;
  onSave: (id: string, name: string, description: string) => void;
  children: React.ReactNode;
}

export function EditParticipantDialog({ participant, onSave, children }: EditParticipantDialogProps) {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: {
      name: participant.name,
      description: participant.description === t('no_suggestions') ? '' : participant.description,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    onSave(participant.id, data.name, data.description || t('no_suggestions'));
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('edit_participant_title')}</DialogTitle>
          <DialogDescription>{t('edit_participant_description')}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('participant_name_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('participant_name_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('gift_suggestions_label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('gift_suggestions_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
                <DialogClose asChild>
                    <Button type="button" variant="outline">{t('cancel_button')}</Button>
                </DialogClose>
                <Button type="submit">{t('save_button')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
