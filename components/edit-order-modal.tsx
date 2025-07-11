"use client"

import React, { useState, useEffect } from "react"
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
import { Checkbox } from "@/components/ui/checkbox"
import type { Order, OrderStatus } from "@/lib/types"

interface EditOrderModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onSave: (updates: Partial<Order>) => void
}

export function EditOrderModal({ open, onOpenChange, order, onSave }: EditOrderModalProps) {
  const seriesOptions = [
    'Big Into Energy',
    'Exciting Macaron',
    'Have A Seat',
  ]
  const [formData, setFormData] = useState({
    orderNumber: "",
    productName: "",
    purchasePrice: "",
    trackingLink: "",
    status: "Ordered" as OrderStatus,
    series: [] as string[],
  })

  useEffect(() => {
    if (order && open) {
      setFormData({
        orderNumber: order.orderNumber,
        productName: order.productName,
        purchasePrice: order.purchasePrice.toString(),
        trackingLink: order.trackingLink,
        status: order.status,
        series: order.series,
      })
    }
  }, [order, open])

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleSeriesChange = (option: string, checked: boolean) => {
    setFormData((prev) => {
      const series = checked
        ? [...prev.series, option]
        : prev.series.filter((s) => s !== option)
      return { ...prev, series }
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!order) return
    onSave({
      orderNumber: formData.orderNumber,
      popmartLink: `https://www.popmart.com/ca/order/${formData.orderNumber}`,
      productName: formData.productName,
      purchasePrice: Number.parseFloat(formData.purchasePrice),
      trackingLink: formData.trackingLink,
      status: formData.status,
      series: formData.series,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="dark:text-white">Edit Order</DialogTitle>
          <DialogDescription className="dark:text-gray-300">
            Update the details of the order.
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
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>

          <div className="space-y-2">
            <Label className="dark:text-white">Series</Label>
            <div className="space-y-1">
              {seriesOptions.map((option) => (
                <div key={option} className="flex items-center">
                  <Checkbox
                    id={`series-${option}`}
                    checked={formData.series.includes(option)}
                    onCheckedChange={(checked) => handleSeriesChange(option, !!checked)}
                    className="mr-2"
                  />
                  <Label htmlFor={`series-${option}`} className="dark:text-white cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
