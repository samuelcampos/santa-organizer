"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Gift, UserPlus, Euro } from "lucide-react";
import { Label } from "@/components/ui/label";
import { useI18n } from "@/hooks/use-i18n";

const formSchema = (t: (key: string) => string) => z.object({
  name: z.string().min(2, { message: t('validation_name_min') }).max(50, { message: t('validation_name_max') }),
  description: z.string().max(200, { message: t('validation_desc_max') }).optional(),
});


interface ParticipantFormProps {
  addParticipant: (name: string, description: string) => void;
  setGiftValue: (value: number) => void;
  giftValue: number;
}

export function ParticipantForm({ addParticipant, setGiftValue, giftValue }: ParticipantFormProps) {
  const { t } = useI18n();

  type FormValues = z.infer<ReturnType<typeof formSchema>>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema(t)),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addParticipant(data.name, data.description || t('no_suggestions'));
    form.reset();
  };

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Gift className="text-primary"/> 
            {t('step1_title')}
        </CardTitle>
        <CardDescription>{t('step1_description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="gift-value" className="flex items-center gap-2 text-base">
                <Euro className="h-5 w-5 text-muted-foreground"/>
                {t('max_gift_value_label')}
            </Label>
            <Input
                id="gift-value"
                type="number"
                value={giftValue}
                onChange={(e) => setGiftValue(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                className="text-lg"
                placeholder={t('gift_value_placeholder')}
            />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-card p-4 shadow-inner">
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
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              {t('add_participant_button')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
