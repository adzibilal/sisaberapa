import { auth } from "@/auth";
import { db } from "@/db";
import { fundSources, transactions } from "@/db/schema";
import { sql, desc } from "drizzle-orm";
import { DashboardClient } from "@/components/dashboard-client";

export default async function DashboardPage() {
  const session = await auth();

  // 1. Get Total Balance
  const [balanceResult] = await db
    .select({ total: sql<number>`SUM(${fundSources.balance})` })
    .from(fundSources);
  const totalBalance = balanceResult?.total || 0;

  // 2. Get Monthly Income & Expense
  const firstDayOfMonth = new Date();
  firstDayOfMonth.setDate(1);
  firstDayOfMonth.setHours(0, 0, 0, 0);

  const [incomeResult] = await db
    .select({ total: sql<number>`SUM(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.type} = 'INCOME' AND ${transactions.date} >= ${firstDayOfMonth}`);

  const [expenseResult] = await db
    .select({ total: sql<number>`SUM(${transactions.amount})` })
    .from(transactions)
    .where(sql`${transactions.type} = 'EXPENSE' AND ${transactions.date} >= ${firstDayOfMonth}`);

  const monthlyIncome = incomeResult?.total || 0;
  const monthlyExpense = expenseResult?.total || 0;

  // 3. Get Recent Transactions
  const recentTransactions = await db.query.transactions.findMany({
    with: { fundSource: true, category: true },
    limit: 5,
    orderBy: [desc(transactions.date)],
  });

  return (
    <DashboardClient
      user={session?.user || {}}
      totalBalance={totalBalance}
      monthlyIncome={monthlyIncome}
      monthlyExpense={monthlyExpense}
      recentTransactions={recentTransactions}
    />
  );
}
