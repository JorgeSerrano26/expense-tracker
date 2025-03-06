"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

interface ExpenseSummaryProps {
  selectedDate: Date
  filter?: string
}

export function ExpenseSummary({ selectedDate, filter }: ExpenseSummaryProps) {
  // This would normally come from your database
  const data = [
    { name: "Groceries", value: 3500, color: "#0088FE" },
    { name: "Utilities", value: 2000, color: "#00C49F" },
    { name: "Entertainment", value: 1500, color: "#FFBB28" },
    { name: "Transportation", value: 1200, color: "#FF8042" },
    { name: "Dining", value: 2300, color: "#8884d8" },
    { name: "Other", value: 2000, color: "#82ca9d" },
  ]

  const COLORS = data.map((item) => item.color)

  const monthYear = selectedDate.toLocaleDateString("es-AR", {
    month: "long",
    year: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
        <CardDescription>Distribution of expenses for {monthYear}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

