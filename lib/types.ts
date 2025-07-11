export type OrderStatus = "Ordered" | "Shipped" | "Delivered" | "Completed" | "Canceled"
export type SaleStatus = "Pending" | "Shipped" | "Completed" | "Canceled"

export interface Order {
  id: string
  orderNumber: string
  popmartLink: string
  productName: string
  purchasePrice: number
  trackingLink: string
  status: OrderStatus
  createdAt?: Date
}

export interface Sale {
  id: string
  customerName: string
  productName: string
  purchasePrice: number
  sellingPrice: number
  chatLink: string
  notes: string
  status: SaleStatus
  createdAt?: Date
}
