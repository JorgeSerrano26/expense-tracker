import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ExpensesView } from "@/components/expenses-view";
import { getExpenses, getCategories, getCards } from "@/app/actions";

export const dynamic = "force-dynamic";

function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

export default async function Home() {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["expenses", month, year],
      queryFn: async () => serialize(await getExpenses(month, year)),
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
            <h1 className="text-3xl font-bold tracking-tight">Mis Gastos</h1>
            <p className="text-muted-foreground">
              Registrá y controlá tus gastos mensuales
            </p>
          </header>
          <ExpensesView initialMonth={month} initialYear={year} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
