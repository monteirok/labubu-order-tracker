"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableFooter } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Search, Trash2, Check, X } from "lucide-react"
import type { Order, OrderStatus } from "@/lib/types"

interface OrdersTableProps {
  orders: Order[]
  onUpdate: (id: string, updates: Partial<Order>) => void
  onDelete: (id: string) => void
  isHistoryView?: boolean
}

export function OrdersTable({ orders, onUpdate, onDelete, isHistoryView = false }: OrdersTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all")
  const [editingCell, setEditingCell] = useState<{ id: string; field: string } | null>(null)
  const [editValue, setEditValue] = useState("")

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  return (
      <div className="space-y-4">
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
          <div className="rounded-md border border-gray-200 dark:border-gray-700 overflow-hidden">
            <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="dark:text-white">Order #</TableHead>
              <TableHead className="dark:text-white">Product</TableHead>
              <TableHead className="dark:text-white">Price (CAD)</TableHead>
              <TableHead className="dark:text-white">Tracking</TableHead>
              <TableHead className="dark:text-white">Status</TableHead>
              <TableHead className="w-[100px] dark:text-white">Actions</TableHead>
            </TableRow>
          </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                key={order.id}
                className={order.status === 'Canceled' ? 'bg-red-50 dark:bg-red-900/30' : ''}
              >
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
                  {editingCell?.id === order.id && editingCell?.field === "productName" && !isHistoryView ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => {
                        onUpdate(order.id, { productName: editValue });
                        setEditingCell(null);
                        setEditValue("");
                      }}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setEditingCell(null);
                        setEditValue("");
                      }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded`}
                      onClick={() => !isHistoryView && (setEditingCell({ id: order.id, field: "productName" }), setEditValue(order.productName))}
                    >
                      {order.productName}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === order.id && editingCell?.field === "purchasePrice" && !isHistoryView ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-20 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => {
                        onUpdate(order.id, { purchasePrice: Number.parseFloat(editValue) || 0 });
                        setEditingCell(null);
                        setEditValue("");
                      }}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setEditingCell(null);
                        setEditValue("");
                      }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded`}
                      onClick={() => !isHistoryView && (setEditingCell({ id: order.id, field: "purchasePrice" }), setEditValue(order.purchasePrice.toString()))}
                    >
                      ${order.purchasePrice.toFixed(2)}
                    </div>
                  )}
                </TableCell>
                <TableCell className="dark:text-gray-300">
                  {editingCell?.id === order.id && editingCell?.field === "trackingLink" && !isHistoryView ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="url"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                      />
                      <Button size="sm" onClick={() => {
                        onUpdate(order.id, { trackingLink: editValue });
                        setEditingCell(null);
                        setEditValue("");
                      }}>
                        <Check className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => {
                        setEditingCell(null);
                        setEditValue("");
                      }}>
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      className={`${!isHistoryView ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700" : ""} p-1 rounded`}
                      onClick={() => !isHistoryView && (setEditingCell({ id: order.id, field: "trackingLink" }), setEditValue(order.trackingLink))}
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
                  )}
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
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(order.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
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
              <TableCell colSpan={3}></TableCell>
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
