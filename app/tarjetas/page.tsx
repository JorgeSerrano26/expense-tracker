import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { CardsView } from "@/components/cards-view";
import { getCards } from "@/app/actions";

export const dynamic = "force-dynamic";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function TarjetasPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["cards"],
    queryFn: async () => serialize(await getCards()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Mis Tarjetas</h1>
            <p className="text-muted-foreground">
              Administrá tus tarjetas de crédito y débito
            </p>
          </header>
          <CardsView />
        </div>
      </div>
    </HydrationBoundary>
  );
}
