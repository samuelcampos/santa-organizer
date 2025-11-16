import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RevealLoading() {
    return (
        <Card className="w-full max-w-md text-center shadow-2xl">
            <CardHeader>
                <Skeleton className="h-6 w-3/4 mx-auto" />
                <Skeleton className="h-8 w-1/2 mx-auto mt-2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="relative rounded-lg border-2 border-dashed p-6">
                    <Skeleton className="h-10 w-3/4 mx-auto" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3 mx-auto" />
                    <Skeleton className="h-4 w-full mx-auto" />
                    <Skeleton className="h-4 w-2/3 mx-auto" />
                </div>
                 <div className="rounded-md bg-muted p-3">
                    <Skeleton className="h-5 w-full mx-auto" />
                </div>
            </CardContent>
        </Card>
    )
}
