import { auth } from "@/auth";
import { db } from "@/db";
import { fundSources, transactions, categories } from "@/db/schema";
import { sql, desc, and, gte, lte, eq } from "drizzle-orm";
import { DashboardClient } from "@/components/dashboard-client";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, subDays, endOfDay } from "date-fns";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const session = await auth();
  const { range = "month", from, to } = await searchParams;

  const now = new Date();
  let startDate: Date;
  let endDate: Date = endOfDay(now);

  switch (range) {
    case "today":
      startDate = startOfDay(now);
      break;
    case "week":
      startDate = startOfWeek(now, { weekStartsOn: 1 });
      break;
    case "year":
      startDate = startOfYear(now);
      break;
    case "all":
      startDate = new Date(0);
      break;
    case "custom":
      startDate = from ? startOfDay(new Date(from)) : startOfMonth(now);
      endDate = to ? endOfDay(new Date(to)) : endOfDay(now);
      break;
    case "month":
    default:
      startDate = startOfMonth(now);
      break;
  }

  // 1. Get Total Balance (Overall, not affected by range)
  const [balanceResult] = await db
    .select({ total: sql<number>`SUM(${fundSources.balance})` })
    .from(fundSources);
  const totalBalance = balanceResult?.total || 0;

  // 2. Get Income & Expense for the selected range
  const [incomeResult] = await db
    .select({ total: sql<number>`SUM(${transactions.amount})` })
    .from(transactions)
    .where(
      and(
        eq(transactions.type, 'INCOME'),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    );

  const [expenseResult] = await db
    .select({ total: sql<number>`SUM(${transactions.amount})` })
    .from(transactions)
    .where(
      and(
        eq(transactions.type, 'EXPENSE'),
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    );

  const rangeIncome = incomeResult?.total || 0;
  const rangeExpense = expenseResult?.total || 0;

  // 3. Get Chart Data: Spending by Category
  const categoryData = await db
    .select({
      name: categories.name,
      value: sql<number>`SUM(${transactions.amount})`,
    })
    .from(transactions)
    .innerJoin(categories, eq(transactions.categoryId, categories.id))
    .where(
      and(
        eq(transactions.type, 'EXPENSE'),
        gte(transactions.date, startDate)
      )
    )
    .groupBy(categories.name);

  // 4. Get Chart Data: Daily Trend
  // We'll fetch transactions for the period and group them in JS for more flexibility with charts
  const dailyTransactions = await db
    .select({
      date: transactions.date,
      amount: transactions.amount,
      type: transactions.type,
    })
    .from(transactions)
    .where(
      and(
        gte(transactions.date, startDate),
        lte(transactions.date, endDate)
      )
    )
    .orderBy(transactions.date);

  // 5. Get Recent Transactions
  const recentTransactions = await db.query.transactions.findMany({
    with: { fundSource: true, category: true },
    limit: 5,
    orderBy: [desc(transactions.date)],
  });

  return (
    <DashboardClient
      user={session?.user || {}}
      totalBalance={totalBalance}
      rangeIncome={rangeIncome}
      rangeExpense={rangeExpense}
      recentTransactions={recentTransactions}
      categoryData={categoryData}
      dailyTrend={dailyTransactions.map(t => ({
        date: t.date.toISOString(),
        amount: Number(t.amount),
        type: t.type
      }))}
      currentRange={range}
    />
  );
}
