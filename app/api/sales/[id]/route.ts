import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Sale } from '@/lib/types'

const dataFile = path.join(process.cwd(), 'data', 'sales.json')

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const json = await fs.readFile(dataFile, 'utf-8')
  const sales: Sale[] = JSON.parse(json)
  const sale = sales.find((s) => s.id === params.id)
  if (!sale) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(sale)
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const updates: Partial<Sale> = await request.json()
  const json = await fs.readFile(dataFile, 'utf-8')
  let sales: Sale[] = JSON.parse(json)
  sales = sales.map((s) => (s.id === params.id ? { ...s, ...updates } : s))
  await fs.writeFile(dataFile, JSON.stringify(sales, null, 2))
  const updated = sales.find((s) => s.id === params.id)
  return NextResponse.json(updated)
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const json = await fs.readFile(dataFile, 'utf-8')
  let sales: Sale[] = JSON.parse(json)
  sales = sales.filter((s) => s.id !== params.id)
  await fs.writeFile(dataFile, JSON.stringify(sales, null, 2))
  return NextResponse.json({ success: true })
}
