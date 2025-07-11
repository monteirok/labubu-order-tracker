"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, TrendingUp, Clock, CheckCircle, Archive } from "lucide-react"
import { OrdersTable } from "@/components/orders-table"
import { SalesTable } from "@/components/sales-table"
import { AddOrderModal } from "@/components/add-order-modal"
import { AddSaleModal } from "@/components/add-sale-modal"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import type { Order, Sale } from "@/lib/types"

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [sales, setSales] = useState<Sale[]>([])
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false)
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"orders" | "sales">("orders")
  const [salesSubTab, setSalesSubTab] = useState<"active" | "completed">("active")
  const [ordersSubTab, setOrdersSubTab] = useState<"active" | "history">("active")

  const handleAddOrder = (newOrder: Omit<Order, "id">) => {
    const order: Order = {
      ...newOrder,
      id: crypto.randomUUID(),
    }
    setOrders((prev) => [order, ...prev])
  }

  const handleAddSale = (newSale: Omit<Sale, "id">) => {
    const sale: Sale = {
      ...newSale,
      id: crypto.randomUUID(),
    }
    setSales((prev) => [sale, ...prev])
  }

  const handleUpdateOrder = (id: string, updates: Partial<Order>) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, ...updates } : order)))
  }

  const handleUpdateSale = (id: string, updates: Partial<Sale>) => {
    setSales((prev) => prev.map((sale) => (sale.id === id ? { ...sale, ...updates } : sale)))
  }

  const handleDeleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((order) => order.id !== id))
  }

  const handleDeleteSale = (id: string) => {
    setSales((prev) => prev.filter((sale) => sale.id !== id))
  }

  // Calculate stats
  const activeOrders = orders.filter((order) => order.status !== "Canceled" && order.status !== "Completed")
  const historyOrders = orders.filter((order) => order.status === "Canceled" || order.status === "Completed")
  const outstandingOrders = orders.filter(
    (order) => order.status !== "Delivered" && order.status !== "Completed" && order.status !== "Canceled",
  ).length
  const pendingSales = sales.filter((sale) => sale.status === "Pending").length
  const totalRevenue = sales
    .filter((sale) => sale.status === "Completed")
    .reduce((sum, sale) => sum + sale.sellingPrice, 0)
  const completedSales = sales.filter((sale) => sale.status === "Completed").length

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Dark Mode Toggle */}
        <div className="flex items-center justify-between">
          <div className="text-center flex-1 space-y-2">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
              <span className="text-2xl">🎀</span>
              Labubu Order & Sales Tracker
              <span className="text-2xl">🎀</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Track your Labubu collection orders and sales in one place
            </p>
          </div>
          <div className="absolute top-4 right-4">
            <DarkModeToggle />
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              📦 Incoming Orders
            </button>
            <button
              onClick={() => setActiveTab("sales")}
              className={`px-6 py-3 rounded-md font-medium transition-all ${
                activeTab === "sales"
                  ? "bg-green-600 text-white shadow-sm"
                  : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              💰 Outgoing Sales
            </button>
          </div>
        </div>

        {/* Quick Stats - Show relevant stats based on active tab */}
        {activeTab === "orders" ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Outstanding Orders</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">{outstandingOrders}</div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Active Orders</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{activeOrders.length}</div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Completed Orders</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {orders.filter((order) => order.status === "Completed").length}
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Canceled Orders</CardTitle>
                <Archive className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {orders.filter((order) => order.status === "Canceled").length}
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Pending Sales</CardTitle>
                <Package className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{pendingSales}</div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Active Sales</CardTitle>
                <Clock className="h-4 w-4 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {sales.filter((sale) => sale.status !== "Completed" && sale.status !== "Canceled").length}
                </div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Completed Sales</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{completedSales}</div>
              </CardContent>
            </Card>
            <Card className="dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-white">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">${totalRevenue.toFixed(2)}</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content - Single Panel Based on Active Tab */}
        <div className="max-w-6xl mx-auto">
          {activeTab === "orders" ? (
            <div className="space-y-4">
              {/* Orders Sub-Navigation */}
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setOrdersSubTab("active")}
                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                      ordersSubTab === "active"
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    Active Orders
                  </button>
                  <button
                    onClick={() => setOrdersSubTab("history")}
                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                      ordersSubTab === "history"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    Order History
                  </button>
                </div>
              </div>

              {/* Orders Content */}
              <Card className="flex flex-col dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 dark:text-white">
                        {ordersSubTab === "active" ? (
                          <>
                            <Package className="h-5 w-5 text-blue-600" />
                            Active Orders
                          </>
                        ) : (
                          <>
                            <Archive className="h-5 w-5 text-purple-600" />
                            Order History
                          </>
                        )}
                      </CardTitle>
                      <CardDescription className="dark:text-gray-300">
                        {ordersSubTab === "active"
                          ? "Track your ongoing Labubu purchases from PopMart"
                          : "View your completed and canceled orders history"}
                      </CardDescription>
                    </div>
                    {ordersSubTab === "active" && (
                      <Button onClick={() => setIsAddOrderOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Order
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <OrdersTable
                    orders={
                      ordersSubTab === "active"
                        ? orders.filter((order) => order.status !== "Canceled" && order.status !== "Completed")
                        : orders.filter((order) => order.status === "Canceled" || order.status === "Completed")
                    }
                    onUpdate={handleUpdateOrder}
                    onDelete={handleDeleteOrder}
                    isHistoryView={ordersSubTab === "history"}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Sales Sub-Navigation */}
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm border border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSalesSubTab("active")}
                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                      salesSubTab === "active"
                        ? "bg-green-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    Active Sales
                  </button>
                  <button
                    onClick={() => setSalesSubTab("completed")}
                    className={`px-4 py-2 rounded-md font-medium transition-all text-sm ${
                      salesSubTab === "completed"
                        ? "bg-purple-600 text-white shadow-sm"
                        : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700"
                    }`}
                  >
                    Completed History
                  </button>
                </div>
              </div>

              {/* Sales Content */}
              <Card className="flex flex-col dark:bg-gray-800 dark:border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 dark:text-white">
                        {salesSubTab === "active" ? (
                          <>
                            <TrendingUp className="h-5 w-5 text-green-600" />
                            Active Sales
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-5 w-5 text-purple-600" />
                            Completed Sales History
                          </>
                        )}
                      </CardTitle>
                      <CardDescription className="dark:text-gray-300">
                        {salesSubTab === "active"
                          ? "Manage your ongoing Labubu sales to customers"
                          : "View your completed and canceled sales history"}
                      </CardDescription>
                    </div>
                    {salesSubTab === "active" && (
                      <Button onClick={() => setIsAddSaleOpen(true)} className="bg-green-600 hover:bg-green-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Sale
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <SalesTable
                    sales={
                      salesSubTab === "active"
                        ? sales.filter((sale) => sale.status !== "Completed" && sale.status !== "Canceled")
                        : sales.filter((sale) => sale.status === "Completed" || sale.status === "Canceled")
                    }
                    onUpdate={handleUpdateSale}
                    onDelete={handleDeleteSale}
                    isHistoryView={salesSubTab === "completed"}
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddOrderModal open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen} onAdd={handleAddOrder} />
      <AddSaleModal open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen} onAdd={handleAddSale} />
    </div>
  )
}
