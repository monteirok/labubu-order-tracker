"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ExternalLink, Search, Trash2, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Sale, SaleStatus } from "@/lib/types"

interface SalesTableProps {
  sales: Sale[]
  onUpdate: (id: string, updates: Partial<Sale>) => void
  onDelete: (id: string) => void
  isHistoryView?: boolean
}

export function SalesTable({ sales, onUpdate, onDelete, isHistoryView = false }: SalesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<SaleStatus | "all">("all")
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.productName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || sale.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: SaleStatus) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Shipped":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const startEditing = (id: string, field: string, currentValue: string | number) => {
    setEditingCell({ id, field })
    setEditValue(currentValue.toString())
  }

  const saveEdit = () => {
    if (!editingCell) return

    const { id, field } = editingCell
    let value: string | number = editValue

    if (field === "sellingPrice") {
      value = Number.parseFloat(editValue) || 0
    }

    onUpdate(id, { [field]: value })
    setEditingCell(null)
    setEditValue("")
  }

  const cancelEdit = () => {
    setEditingCell(null)
    setEditValue("")
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search sales..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as SaleStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      {isHistoryView && selectedIds.size > 0 && (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => {
            selectedIds.forEach((id) => onDelete(id))
            setSelectedIds(new Set())
          }}
        >
          Delete Selected ({selectedIds.size})
        </Button>
      )}
      <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
        <Table>
          <TableHeader>
            <TableRow>
{isHistoryView && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={sales.length > 0 && selectedIds.size === filteredSales.length}
                    indeterminate={selectedIds.size > 0 && selectedIds.size < filteredSales.length}
                    onCheckedChange={(checked) => {
                      if (checked) setSelectedIds(new Set(filteredSales.map((s) => s.id)))
                      else setSelectedIds(new Set())
                    }}
                  />
                </TableHead>
              )}
              <TableHead className="dark:text-white">Customer</TableHead>
              <TableHead className="dark:text-white">Product</TableHead>
              <TableHead className="dark:text-white">Price (CAD)</TableHead>
              <TableHead className="dark:text-white">Chat</TableHead>
              <TableHead className="dark:text-white">Notes</TableHead>
              <TableHead className="dark:text-white">Status</TableHead>
              <TableHead className="w-[100px] dark:text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredSales.map((sale) => (
              <TableRow key={sale.id}>
                {isHistoryView && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(sale.id)}
                      onCheckedChange={(checked) => {
                        const next = new Set(selectedIds)
                        if (checked) next.add(sale.id)
                        else next.delete(sale.id)
                        setSelectedIds(next)
                      }}
                    />
                  </TableCell>
                )}
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === sale.id && editingCell?.field === "customerName" && !isHistoryView ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded`}
                      onClick={() => !isHistoryView && startEditing(sale.id, "customerName", sale.customerName)}
                    >
                      {sale.customerName}
                    </div>
                  )}
                </TableCell>
                <TableCell className="font-medium dark:text-gray-300">{sale.productName}</TableCell>
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === sale.id && editingCell?.field === "sellingPrice" && !isHistoryView ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Button size="sm" onClick={saveEdit}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={cancelEdit}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded`}
                      onClick={() => !isHistoryView && startEditing(sale.id, "sellingPrice", sale.sellingPrice)}
                    >
                      ${sale.sellingPrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  <a
                    href={sale.chatLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    Chat
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === sale.id && editingCell?.field === "notes" && !isHistoryView ? (
                    <div className="flex items-center gap-2">
                      <Textarea
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="min-h-[60px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <div className="flex flex-col gap-1">
                        <Button size="sm" onClick={saveEdit}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded max-w-[200px] truncate`}
                      onClick={() => !isHistoryView && startEditing(sale.id, "notes", sale.notes)}
                      title={sale.notes}
                    >
                      {sale.notes || "Click to add notes..."}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {isHistoryView ? (
                    <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                  ) : (
                    <Select
                      value={sale.status}
                      onValueChange={(value) => onUpdate(sale.id, { status: value as SaleStatus })}
                    >
                      <SelectTrigger className="w-[120px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <Badge className={getStatusColor(sale.status)}>{sale.status}</Badge>
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {!isHistoryView && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(sale.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {isHistoryView && (
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="font-medium dark:text-white">
                  Total Revenue
                </TableCell>
                <TableCell className="font-bold text-lg dark:text-white">
                  ${filteredSales.reduce((sum, sale) => sum + sale.sellingPrice, 0).toFixed(2)}
                </TableCell>
                <TableCell colSpan={4}></TableCell>
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>

      {filteredSales.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No sales found matching your criteria.</div>
      )}
    </div>
  )
}
