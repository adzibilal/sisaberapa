"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
    BarChart,
    Bar,
} from "recharts";
import { Card, CardBody, CardHeader, Divider } from "@heroui/react";
import { format, parseISO } from "date-fns";
import { id } from "date-fns/locale";

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f43f5e"];

export function StatsCharts({
    categoryData,
    dailyTrend
}: {
    categoryData: any[],
    dailyTrend: any[]
}) {
    // Process daily trend to aggregate by date
    const chartData = dailyTrend.reduce((acc: any[], curr) => {
        const dateStr = format(parseISO(curr.date), "dd MMM", { locale: id });
        const existing = acc.find(item => item.date === dateStr);

        if (existing) {
            if (curr.type === "INCOME") existing.pemasukan += curr.amount;
            else existing.pengeluaran += curr.amount;
        } else {
            acc.push({
                date: dateStr,
                pemasukan: curr.type === "INCOME" ? curr.amount : 0,
                pengeluaran: curr.type === "EXPENSE" ? curr.amount : 0,
            });
        }
        return acc;
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-background border border-divider p-3 rounded-xl shadow-xl">
                    <p className="font-bold mb-2">{label}</p>
                    {payload.map((entry: any) => (
                        <div key={entry.name} className="flex items-center gap-2 text-sm">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                            <span className="text-default-500">{entry.name}:</span>
                            <span className="font-mono font-bold">
                                Rp {entry.value.toLocaleString("id-ID")}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-sm border border-divider">
                <CardHeader className="flex flex-col items-start px-6 pt-6">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Tren Keuangan</h3>
                    <p className="text-tiny text-default-500">Perbandingan pemasukan & pengeluaran</p>
                </CardHeader>
                <Divider className="my-2" />
                <CardBody className="h-[350px] px-2 pb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorInc" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis
                                dataKey="date"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fontSize: 10, fill: "#666" }}
                            />
                            <YAxis
                                hide
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey="pemasukan"
                                stroke="#16a34a"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorInc)"
                                name="Pemasukan"
                            />
                            <Area
                                type="monotone"
                                dataKey="pengeluaran"
                                stroke="#dc2626"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorExp)"
                                name="Pengeluaran"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardBody>
            </Card>

            <Card className="shadow-sm border border-divider">
                <CardHeader className="flex flex-col items-start px-6 pt-6">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Breakdown Pengeluaran</h3>
                    <p className="text-tiny text-default-500">Distribusi pengeluaran per kategori</p>
                </CardHeader>
                <Divider className="my-2" />
                <CardBody className="h-[350px] px-2 pb-6">
                    {categoryData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-default-400 italic">
                            Belum ada data pengeluaran.
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={categoryData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {categoryData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value) => <span className="text-xs font-medium">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
