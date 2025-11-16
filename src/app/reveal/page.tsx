"use client";

import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Logo } from "@/components/logo";
import { Gift, Heart } from "lucide-react";
import RevealLoading from './loading';

interface RevealData {
    gifter: string;
    receiver: string;
    description: string;
    value: string;
}

function RevealContent() {
    const searchParams = useSearchParams();
    const [data, setData] = useState<RevealData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const encodedData = searchParams.get('data');
        if (encodedData) {
            try {
                const decodedData = decodeURIComponent(atob(encodedData));
                const params = new URLSearchParams(decodedData);
                const gifter = params.get('gifter');
                const receiver = params.get('receiver');
                const description = params.get('description');
                const value = params.get('value');

                if (gifter && receiver && description && value) {
                    setData({ gifter, receiver, description, value });
                } else {
                    setError("Informações incompletas no link.");
                }
            } catch (e) {
                setError("Link inválido ou corrompido.");
            }
        } else {
            setError("Nenhum dado encontrado para revelar.");
        }
    }, [searchParams]);

    if(error) {
        return (
            <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in">
                <CardHeader>
                    <CardTitle className="text-destructive">Oops! Algo deu errado.</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        )
    }

    if (!data) {
        return <RevealLoading />;
    }
    
    return (
        <Card className="w-full max-w-md text-center shadow-2xl animate-fade-in">
            <CardHeader>
                <p className="text-lg text-muted-foreground">Olá, <span className="font-bold text-primary">{data.gifter}</span>!</p>
                <CardTitle className="text-3xl font-headline">Você tirou...</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative rounded-lg border-2 border-dashed border-accent p-6 bg-accent/10">
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-background px-2">
                        <Gift className="h-8 w-8 text-accent"/>
                    </div>
                    <h3 className="text-4xl font-bold text-accent">{data.receiver}</h3>
                </div>

                <div>
                    <h4 className="font-semibold text-primary">Sugestões de Presente:</h4>
                    <p className="text-muted-foreground">{data.description}</p>
                </div>
                
                <div className="rounded-md bg-muted p-3">
                    <p className="text-sm text-muted-foreground">Lembre-se, o valor máximo combinado é de <span className="font-bold text-primary">R$ {data.value}</span>.</p>
                </div>

                <div className="flex items-center justify-center gap-2 pt-4 text-muted-foreground">
                    <p>Boas compras!</p>
                    <Heart className="h-4 w-4 text-pink-500"/>
                </div>
            </CardContent>
        </Card>
    );
}


export default function RevealPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-background to-primary/10">
             <div className="absolute top-8">
                <Logo />
            </div>
            <Suspense fallback={<RevealLoading />}>
                <RevealContent />
            </Suspense>
        </main>
    );
}
