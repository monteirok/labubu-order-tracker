import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Order } from '@/lib/types'

const dataFile = path.join(process.cwd(), 'data', 'orders.json')

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const json = await fs.readFile(dataFile, 'utf-8')
  const orders: Order[] = JSON.parse(json)
  const order = orders.find((o) => o.id === params.id)
  if (!order) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const updates: Partial<Order> = await request.json()
  const json = await fs.readFile(dataFile, 'utf-8')
  let orders: Order[] = JSON.parse(json)
  orders = orders.map((o) => (o.id === params.id ? { ...o, ...updates } : o))
  await fs.writeFile(dataFile, JSON.stringify(orders, null, 2))
  const updated = orders.find((o) => o.id === params.id)
  return NextResponse.json(updated)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const json = await fs.readFile(dataFile, 'utf-8')
  let orders: Order[] = JSON.parse(json)
  orders = orders.filter((o) => o.id !== params.id)
  await fs.writeFile(dataFile, JSON.stringify(orders, null, 2))
  return NextResponse.json({ success: true })
}
