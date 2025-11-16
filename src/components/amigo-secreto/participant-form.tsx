"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Gift, UserPlus, DollarSign } from "lucide-react";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }).max(50, { message: "O nome não pode ter mais de 50 caracteres." }),
  description: z.string().max(200, { message: "A descrição não pode ter mais de 200 caracteres." }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ParticipantFormProps {
  addParticipant: (name: string, description: string) => void;
  setGiftValue: (value: number) => void;
  giftValue: number;
}

export function ParticipantForm({ addParticipant, setGiftValue, giftValue }: ParticipantFormProps) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", description: "" },
  });

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    addParticipant(data.name, data.description || "Sem sugestões.");
    form.reset();
  };

  return (
    <Card className="shadow-lg animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline">
            <Gift className="text-primary"/> 
            1. Configure o Jogo
        </CardTitle>
        <CardDescription>Defina o valor do presente e adicione os participantes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="gift-value" className="flex items-center gap-2 text-base">
                <DollarSign className="h-5 w-5 text-muted-foreground"/>
                Valor Máximo do Presente (R$)
            </Label>
            <Input
                id="gift-value"
                type="number"
                value={giftValue}
                onChange={(e) => setGiftValue(Number(e.target.value) > 0 ? Number(e.target.value) : 0)}
                className="text-lg"
                placeholder="Ex: 50"
            />
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 rounded-lg border bg-card p-4 shadow-inner">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Participante</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: João Silva" {...field} />
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
                  <FormLabel>Sugestões de Presente (opcional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Ex: Livros de ficção, chocolates, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Participante
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
