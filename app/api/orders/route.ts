import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Order } from '@/lib/types'

const dataFile = path.join(process.cwd(), 'data', 'orders.json')

export async function GET() {
  const json = await fs.readFile(dataFile, 'utf-8')
  const orders: Order[] = JSON.parse(json)
  return NextResponse.json(orders)
}

export async function POST(request: NextRequest) {
  const newOrder: Omit<Order, 'id'> = await request.json()
  const json = await fs.readFile(dataFile, 'utf-8')
  const orders: Order[] = JSON.parse(json)
  // Store createdAt as ISO string, but cast to 'any' to satisfy the type
  const order: Order = { ...newOrder, id: crypto.randomUUID(), createdAt: newOrder.createdAt ?? new Date().toISOString() } as any
  orders.unshift(order)
  await fs.writeFile(dataFile, JSON.stringify(orders, null, 2))
  return NextResponse.json(order)
}
