import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { SubscriptionsView } from "@/components/subscriptions-view";
import { getSubscriptions, getCategories, getCards } from "@/app/actions";

export const dynamic = "force-dynamic";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function SuscripcionesPage() {
  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["subscriptions"],
      queryFn: async () => serialize(await getSubscriptions()),
    }),
    queryClient.prefetchQuery({
      queryKey: ["categories"],
      queryFn: async () => serialize(await getCategories()),
    }),
    queryClient.prefetchQuery({
      queryKey: ["cards"],
      queryFn: async () => serialize(await getCards()),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl px-4 py-8">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Suscripciones</h1>
            <p className="text-muted-foreground">
              Administrá tus membresías y suscripciones recurrentes
            </p>
          </header>
          <SubscriptionsView />
        </div>
      </div>
    </HydrationBoundary>
  );
}
