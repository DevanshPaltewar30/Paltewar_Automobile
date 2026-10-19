import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/lib/validations'

export async function GET(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const search = searchParams.get('search') || ''
  const categoryId = searchParams.get('categoryId') || ''
  const city = searchParams.get('city') || ''
  const district = searchParams.get('district') || ''
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'

  const skip = (page - 1) * limit

  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { customerName: { contains: search, mode: 'insensitive' } },
      { phoneNumber: { contains: search, mode: 'insensitive' } },
      { alternateMobileNumber: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (categoryId) {
    where.categoryId = categoryId
  }

  if (city) {
    where.city = { contains: city, mode: 'insensitive' }
  }

  if (district) {
    where.district = { contains: district, mode: 'insensitive' }
  }

  const validSortFields = ['customerName', 'createdAt', 'phoneNumber']
  const orderByField = validSortFields.includes(sortBy) ? sortBy : 'createdAt'

  const [customers, total] = await Promise.all([
    prisma.customer.findMany({
      where,
      include: { category: true },
      skip,
      take: limit,
      orderBy: { [orderByField]: sortOrder },
    }),
    prisma.customer.count({ where }),
  ])

  return NextResponse.json({
    customers,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const result = customerSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const data = result.data

  // Clean empty strings to null
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

  const customer = await prisma.customer.create({
    data: cleanedData,
    include: { category: true },
  })

  return NextResponse.json(customer, { status: 201 })
}
