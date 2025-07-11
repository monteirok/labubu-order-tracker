"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order, OrderStatus } from "@/lib/types"

interface AddOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (order: Omit<Order, "id">) => void
}

export function AddOrderModal({ open, onOpenChange, onAdd }: AddOrderModalProps) {
  const [formData, setFormData] = useState({
    orderNumber: "",
    productName: "",
    purchasePrice: "",
    trackingLink: "",
    status: "Ordered" as OrderStatus,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.orderNumber || !formData.productName || !formData.purchasePrice) {
      return
    }

    onAdd({
      orderNumber: formData.orderNumber,
      popmartLink: `https://www.popmart.com/ca/order/${formData.orderNumber}`,
      productName: formData.productName,
      purchasePrice: Number.parseFloat(formData.purchasePrice),
      trackingLink: formData.trackingLink,
      status: formData.status,
      createdAt: new Date(),
    })

    // Reset form
    setFormData({
      orderNumber: "",
      productName: "",
      purchasePrice: "",
      trackingLink: "",
      status: "Ordered",
    })

    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Order</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Add a new Labubu order to track its status and delivery.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="orderNumber" className="dark:text-white">
              Order Number *
            </Label>
            <Input
              id="orderNumber"
              value={formData.orderNumber}
              onChange={(e) => handleChange("orderNumber", e.target.value)}
              placeholder="PM-2024-001"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>


          <div className="space-y-2">
            <Label htmlFor="productName" className="dark:text-white">
              Product Name *
            </Label>
            <Input
              id="productName"
              value={formData.productName}
              onChange={(e) => handleChange("productName", e.target.value)}
              placeholder="Labubu The Monsters Series"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchasePrice" className="dark:text-white">
              Purchase Price (CAD) *
            </Label>
            <Input
              id="purchasePrice"
              type="number"
              step="0.01"
              value={formData.purchasePrice}
              onChange={(e) => handleChange("purchasePrice", e.target.value)}
              placeholder="15.99"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingLink" className="dark:text-white">
              Tracking URL
            </Label>
            <Input
              id="trackingLink"
              type="url"
              value={formData.trackingLink}
              onChange={(e) => handleChange("trackingLink", e.target.value)}
              placeholder="https://track.canadapost.ca/..."
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status" className="dark:text-white">
              Status
            </Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value)}
              className="dark:bg-gray-700 dark:border-gray-600"
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ordered">Ordered</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Order</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
