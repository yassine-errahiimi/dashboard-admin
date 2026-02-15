"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { initialReservations } from "@/lib/store"
import type { BicycleCategory, Reservation, ReservationStatus } from "@/lib/types"

const statusStyles: Record<string, string> = {
  Pending:
    "bg-[hsl(var(--warning))] text-[hsl(var(--warning-foreground))] hover:bg-[hsl(var(--warning))]/90",
  Confirmed:
    "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]/90",
  Annulled: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>(initialReservations)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">("all")
  const [categoryFilter, setCategoryFilter] = useState<BicycleCategory | "all">("all")
  const [dateFilter, setDateFilter] = useState<Date | undefined>(undefined)

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(search.toLowerCase()) ||
        r.phoneNumber.includes(search)
      const matchesStatus = statusFilter === "all" || r.status === statusFilter
      const matchesCategory = categoryFilter === "all" || r.bicycleCategory === categoryFilter
      const matchesDate =
        !dateFilter || r.reservationDate === format(dateFilter, "yyyy-MM-dd")
      return matchesSearch && matchesStatus && matchesCategory && matchesDate
    })
  }, [reservations, search, statusFilter, categoryFilter, dateFilter])

  function updateStatus(id: string, status: ReservationStatus) {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-balance">Reservations</h1>
        <p className="text-sm text-muted-foreground">
          Manage all bicycle rental bookings.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>Narrow down reservations by date, category, or status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Name or phone..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="min-w-[150px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Status
              </label>
              <Select
                value={statusFilter}
                onValueChange={(v) => setStatusFilter(v as ReservationStatus | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Annulled">Annulled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[150px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Category
              </label>
              <Select
                value={categoryFilter}
                onValueChange={(v) => setCategoryFilter(v as BicycleCategory | "all")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="VTT">VTT</SelectItem>
                  <SelectItem value="City">City</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="min-w-[180px]">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !dateFilter && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateFilter ? format(dateFilter, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateFilter}
                    onSelect={setDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {(search || statusFilter !== "all" || categoryFilter !== "all" || dateFilter) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearch("")
                  setStatusFilter("all")
                  setCategoryFilter("all")
                  setDateFilter(undefined)
                }}
              >
                Clear all
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="hidden sm:table-cell">Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                    No reservations found.
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.customerName}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {r.phoneNumber}
                    </TableCell>
                    <TableCell>{r.duration}h</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {r.reservationDate}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{r.bicycleCategory}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusStyles[r.status]}>{r.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {r.status !== "Confirmed" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-[hsl(var(--success))] hover:text-[hsl(var(--success))] hover:bg-[hsl(var(--success))]/10"
                            onClick={() => updateStatus(r.id, "Confirmed")}
                          >
                            Confirm
                          </Button>
                        )}
                        {r.status !== "Annulled" && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => updateStatus(r.id, "Annulled")}
                          >
                            Annul
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
