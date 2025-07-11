"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Sale, SaleStatus } from "@/lib/types"

interface AddSaleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd: (sale: Omit<Sale, "id">) => void
  /** Optional initial data to prefill the form */
  initialData?: Partial<Omit<Sale, "id">>
}

export function AddSaleModal({ open, onOpenChange, onAdd, initialData }: AddSaleModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    productName: "",
    purchasePrice: "",
    sellingPrice: "",
    chatLink: "",
    notes: "",
    status: "Pending" as SaleStatus,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.customerName || !formData.productName || !formData.sellingPrice) {
      return
    }

    onAdd({
      customerName: formData.customerName,
      productName: formData.productName,
      purchasePrice: Number.parseFloat(formData.purchasePrice),
      sellingPrice: Number.parseFloat(formData.sellingPrice),
      chatLink: formData.chatLink,
      notes: formData.notes,
      status: formData.status,
      createdAt: new Date(),
    })

    // Reset form
    setFormData({
      customerName: "",
      productName: "",
      purchasePrice: "",
      sellingPrice: "",
      chatLink: "",
      notes: "",
      status: "Pending",
    })

    onOpenChange(false)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Reset formData whenever the dialog opens (and use initialData if provided)
  useEffect(() => {
    if (open) {
      setFormData({
        customerName: initialData?.customerName ?? "",
        productName: initialData?.productName ?? "",
        purchasePrice: initialData?.purchasePrice != null ? initialData.purchasePrice.toString() : "",
        sellingPrice: initialData?.sellingPrice != null ? initialData.sellingPrice.toString() : "",
        chatLink: initialData?.chatLink ?? "",
        notes: initialData?.notes ?? "",
        status: initialData?.status ?? "Pending",
      })
    }
  }, [open, initialData])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Add New Sale</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Add a new Labubu sale to track customer details and status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName" className="dark:text-white">
              Customer Name *
            </Label>
            <Input
              id="customerName"
              value={formData.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
              placeholder="Sarah Chen"
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
            <Label htmlFor="sellingPrice" className="dark:text-white">
              Selling Price (CAD) *
            </Label>
            <Input
              id="sellingPrice"
              type="number"
              step="0.01"
              value={formData.sellingPrice}
              onChange={(e) => handleChange("sellingPrice", e.target.value)}
              placeholder="25.00"
              required
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="chatLink" className="dark:text-white">
              Chat Link
            </Label>
            <Input
              id="chatLink"
              type="url"
              value={formData.chatLink}
              onChange={(e) => handleChange("chatLink", e.target.value)}
              placeholder="https://m.me/customer.name"
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="dark:text-white">
              Notes
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Special requests, shipping preferences, etc."
              rows={3}
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
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Canceled">Canceled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Sale</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
