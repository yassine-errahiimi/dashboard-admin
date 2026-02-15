"use client"

import { useState } from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { initialBicycles } from "@/lib/store"
import type { Bicycle, BicycleCategory } from "@/lib/types"

const categoryColors: Record<BicycleCategory, string> = {
  VTT: "bg-primary/10 text-primary border-primary/20",
  City: "bg-[hsl(var(--success))]/10 text-[hsl(var(--success))] border-[hsl(var(--success))]/20",
  Electric: "bg-[hsl(var(--warning))]/10 text-[hsl(var(--warning-foreground))] border-[hsl(var(--warning))]/20",
}

export default function BicyclesPage() {
  const [bicycles, setBicycles] = useState<Bicycle[]>(initialBicycles)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingBike, setEditingBike] = useState<Bicycle | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  // Form state
  const [formName, setFormName] = useState("")
  const [formPrice, setFormPrice] = useState("")
  const [formCategory, setFormCategory] = useState<BicycleCategory>("City")

  function openAddDialog() {
    setEditingBike(null)
    setFormName("")
    setFormPrice("")
    setFormCategory("City")
    setDialogOpen(true)
  }

  function openEditDialog(bike: Bicycle) {
    setEditingBike(bike)
    setFormName(bike.name)
    setFormPrice(String(bike.price))
    setFormCategory(bike.category)
    setDialogOpen(true)
  }

  function handleSave() {
    if (!formName.trim() || !formPrice.trim()) return

    if (editingBike) {
      setBicycles((prev) =>
        prev.map((b) =>
          b.id === editingBike.id
            ? { ...b, name: formName, price: Number(formPrice), category: formCategory }
            : b
        )
      )
    } else {
      const newBike: Bicycle = {
        id: `b${Date.now()}`,
        name: formName,
        price: Number(formPrice),
        category: formCategory,
      }
      setBicycles((prev) => [...prev, newBike])
    }
    setDialogOpen(false)
  }

  function handleDelete(id: string) {
    setBicycles((prev) => prev.filter((b) => b.id !== id))
    setDeleteConfirm(null)
  }

  const stats = {
    total: bicycles.length,
    vtt: bicycles.filter((b) => b.category === "VTT").length,
    city: bicycles.filter((b) => b.category === "City").length,
    electric: bicycles.filter((b) => b.category === "Electric").length,
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-balance">
            Bicycle Management
          </h1>
          <p className="text-sm text-muted-foreground">
            Add, edit, and manage your bicycle fleet.
          </p>
        </div>
        <Button onClick={openAddDialog} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Bicycle
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>VTT</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.vtt}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>City</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.city}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Electric</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.electric}</div>
          </CardContent>
        </Card>
      </div>

      {/* Bicycle table */}
      <Card>
        <CardHeader>
          <CardTitle>Fleet Inventory</CardTitle>
          <CardDescription>All bicycles available for rental.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price / hour</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bicycles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                    No bicycles in your fleet. Add one to get started.
                  </TableCell>
                </TableRow>
              ) : (
                bicycles.map((bike) => (
                  <TableRow key={bike.id}>
                    <TableCell className="font-medium">{bike.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={categoryColors[bike.category]}>
                        {bike.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {bike.price} MAD/h
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => openEditDialog(bike)}
                          aria-label={`Edit ${bike.name}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => setDeleteConfirm(bike.id)}
                          aria-label={`Delete ${bike.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBike ? "Edit Bicycle" : "Add New Bicycle"}</DialogTitle>
            <DialogDescription>
              {editingBike
                ? "Update the bicycle details below."
                : "Fill in the details to add a new bicycle to your fleet."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="bike-name">Name</Label>
              <Input
                id="bike-name"
                placeholder="e.g. Trail Blazer 500"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="bike-price">Price (MAD / hour)</Label>
              <Input
                id="bike-price"
                type="number"
                min={0}
                placeholder="e.g. 15"
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label>Category</Label>
              <Select
                value={formCategory}
                onValueChange={(v) => setFormCategory(v as BicycleCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="VTT">VTT</SelectItem>
                  <SelectItem value="City">City</SelectItem>
                  <SelectItem value="Electric">Electric</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formName.trim() || !formPrice.trim()}>
              {editingBike ? "Save Changes" : "Add Bicycle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Bicycle</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this bicycle from your fleet? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
