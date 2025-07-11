import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'
import type { Sale } from '@/lib/types'

const dataFile = path.join(process.cwd(), 'data', 'sales.json')

export async function GET() {
  const json = await fs.readFile(dataFile, 'utf-8')
  const sales: Sale[] = JSON.parse(json)
  return NextResponse.json(sales)
}

export async function POST(request: NextRequest) {
  const newSale: Omit<Sale, 'id'> = await request.json()
  const json = await fs.readFile(dataFile, 'utf-8')
  const sales: Sale[] = JSON.parse(json)
  const sale: Sale = { ...newSale, id: crypto.randomUUID() }
  sales.unshift(sale)
  await fs.writeFile(dataFile, JSON.stringify(sales, null, 2))
  return NextResponse.json(sale)
}
