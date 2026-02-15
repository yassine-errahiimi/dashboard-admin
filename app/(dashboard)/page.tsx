"use client"

import { useMemo } from "react"
import { Bike, CalendarDays, Clock, TrendingUp } from "lucide-react"
import Link from "next/link"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { initialBicycles, initialReservations } from "@/lib/store"

const statusStyles: Record<string, string> = {
  Pending: "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90",
  Confirmed: "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90",
  Annulled: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
}

export default function DashboardPage() {
  const stats = useMemo(() => {
    const totalReservations = initialReservations.length
    const pendingCount = initialReservations.filter((r) => r.status === "Pending").length
    const confirmedCount = initialReservations.filter((r) => r.status === "Confirmed").length
    const totalBicycles = initialBicycles.length
    return { totalReservations, pendingCount, confirmedCount, totalBicycles }
  }, [])

  const recentReservations = initialReservations.slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of your bicycle rental operations.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Reservations
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReservations}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pending
            </CardTitle>
            <Clock className="h-4 w-4 text-[hsl(var(--warning))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Confirmed
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-[hsl(var(--success))]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fleet Size
            </CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBicycles}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Reservations</CardTitle>
            <CardDescription>Latest bookings across all categories.</CardDescription>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/reservations">View all</Link>
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Phone</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReservations.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium">{r.customerName}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {r.phoneNumber}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{r.bicycleCategory}</Badge>
                  </TableCell>
                  <TableCell>{r.duration}h</TableCell>
                  <TableCell>
                    <Badge className={statusStyles[r.status]}>{r.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
