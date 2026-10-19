import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/lib/validations'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: { category: true },
  })

  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  return NextResponse.json(customer)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json()
  const result = customerSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const data = result.data

  const existing = await prisma.customer.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  const cleanedData = {
    customerName: data.customerName,
    phoneNumber: data.phoneNumber,
    alternateMobileNumber: data.alternateMobileNumber || null,
    address: data.address || null,
    city: data.city || null,
    district: data.district || null,
    state: data.state || null,
    workDescription: data.workDescription || null,
    categoryId: data.categoryId || null,
    notes: data.notes || null,
  }

  const customer = await prisma.customer.update({
    where: { id },
    data: cleanedData,
    include: { category: true },
  })

  return NextResponse.json(customer)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const existing = await prisma.customer.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
  }

  await prisma.customer.delete({ where: { id } })

  return NextResponse.json({ message: 'Customer deleted successfully' })
}
