"use client"

import { useState, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Search, Trash2, TrendingUp, Edit3, Check, X } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import type { Order, OrderStatus } from "@/lib/types"
import { EditOrderModal } from "@/components/edit-order-modal"

interface OrdersTableProps {
  orders: Order[]
  onUpdate: (id: string, updates: Partial<Order>) => void
  onDelete: (id: string) => void
  /** Trigger adding a new outgoing sale prefilled from this order */
  onCreateSale?: (order: Order) => void
  isHistoryView?: boolean
}

export function OrdersTable({ orders, onUpdate, onDelete, onCreateSale, isHistoryView = false }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Sorting
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Order
    direction: 'asc' | 'desc'
  } | null>(null)
  const requestSort = (key: keyof Order) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig?.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }
  const sortedOrders = useMemo(() => {
    if (!sortConfig) return filteredOrders
    const sorted = [...filteredOrders].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal)
      const bStr = String(bVal)
      return (
        (sortConfig.direction === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr))
      )
    })
    return sorted
  }, [filteredOrders, sortConfig])

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case "Ordered":
        return "bg-blue-100 text-blue-800"
      case "Shipped":
        return "bg-yellow-100 text-yellow-800"
      case "Delivered":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Canceled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const getRowHighlight = (status: OrderStatus) => {
    switch (status) {
      case "Ordered":
        return "bg-blue-100 dark:bg-blue-900/30"
      case "Shipped":
        return "bg-yellow-100 dark:bg-yellow-900/30"
      case "Delivered":
      case "Completed":
        return "bg-green-100 dark:bg-green-900/30"
      case "Canceled":
        return "bg-red-100 dark:bg-red-900/30"
      default:
        return ""
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
    if (field === "purchasePrice") {
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
      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
          <Input
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as OrderStatus | "all")}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Ordered">Ordered</SelectItem>
            <SelectItem value="Shipped">Shipped</SelectItem>
            <SelectItem value="Delivered">Delivered</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Canceled">Canceled</SelectItem>
          </SelectContent>
        </Select>
      </div>

          {/* Table */}
      <div className="overflow-auto rounded-lg bg-white dark:bg-gray-800 shadow-md">
        <Table>
          <TableHeader className="sticky top-0 bg-white dark:bg-gray-800 z-10">
            <TableRow>
              {isHistoryView && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={filteredOrders.length > 0 && selectedIds.size === filteredOrders.length}
                    indeterminate={
                      selectedIds.size > 0 && selectedIds.size < filteredOrders.length
                        ? true
                        : undefined
                    }
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedIds(new Set(filteredOrders.map((o) => o.id)))
                      } else {
                        setSelectedIds(new Set())
                      }
                    }}
                  />
                </TableHead>
              )}
              <TableHead
                onClick={() => requestSort('orderNumber')}
                className="dark:text-white cursor-pointer"
              >
                Order #
              </TableHead>
              <TableHead
                onClick={() => requestSort('productName')}
                className="dark:text-white cursor-pointer"
              >
                Product
              </TableHead>
              <TableHead
                onClick={() => requestSort('purchasePrice')}
                className="dark:text-white cursor-pointer"
              >
                Price (CAD)
              </TableHead>
              <TableHead
                onClick={() => requestSort('trackingLink')}
                className="dark:text-white cursor-pointer"
              >
                Tracking
              </TableHead>
              <TableHead
                onClick={() => requestSort('createdAt')}
                className="dark:text-white cursor-pointer"
              >
                Date Added
              </TableHead>
              <TableHead
                onClick={() => requestSort('status')}
                className="dark:text-white cursor-pointer"
              >
                Status
              </TableHead>
              <TableHead className="w-[100px] dark:text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
              <TableBody>
            {sortedOrders.map((order) => (
              <TableRow
                key={order.id}
                className={`${getRowHighlight(order.status)} transition-colors`}
              >
                {isHistoryView && (
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(order.id)}
                      onCheckedChange={(checked) => {
                        const next = new Set(selectedIds)
                        if (checked) next.add(order.id)
                        else next.delete(order.id)
                        setSelectedIds(next)
                      }}
                    />
                  </TableCell>
                )}
                <TableCell className="dark:text-gray-300">
                  <a
                    href={order.popmartLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {order.orderNumber}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell className="font-medium dark:text-gray-300">
                  {editingCell?.id === order.id && editingCell?.field === "productName" ? (
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
                      onClick={() => !isHistoryView && startEditing(order.id, "productName", order.productName)}
                    >
                      {order.productName}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === order.id && editingCell?.field === "purchasePrice" ? (
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
                      onClick={() => !isHistoryView && startEditing(order.id, "purchasePrice", order.purchasePrice)}
                    >
                      ${order.purchasePrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === order.id && editingCell?.field === "trackingLink" ? (
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
                  ) : order.trackingLink ? (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded`}
                      onClick={() => !isHistoryView && startEditing(order.id, "trackingLink", order.trackingLink)}
                    >
                      <a
                        href={order.trackingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        Track
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded italic lowercase text-red-600 text-center block w-full`}
                      onClick={() => !isHistoryView && startEditing(order.id, "trackingLink", order.trackingLink)}
                    >
                      n/a
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {isHistoryView ? (
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  ) : (
                    <Select
                      value={order.status}
                      onValueChange={(value) => onUpdate(order.id, { status: value as OrderStatus })}
                    >
                      <SelectTrigger className="w-[120px]">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ordered">Ordered</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Delivered">Delivered</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Canceled">Canceled</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {!isHistoryView && (
                    <div className="flex items-center space-x-2">
                      {onCreateSale && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onCreateSale(order)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <TrendingUp className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(order.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter className="bg-white dark:bg-gray-800">
            <TableRow>
              <TableCell colSpan={2} className="font-medium dark:text-white">
                Total $ Spent
              </TableCell>
              <TableCell className="font-bold text-lg dark:text-white">
                ${filteredOrders
                  .filter((order) => order.status !== 'Canceled')
                  .reduce((sum, order) => sum + order.purchasePrice, 0)
                  .toFixed(2)}
              </TableCell>
              <TableCell colSpan={2}></TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>

      {filteredOrders.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">No orders found matching your criteria.</div>
      )}
    </div>
  )
}
