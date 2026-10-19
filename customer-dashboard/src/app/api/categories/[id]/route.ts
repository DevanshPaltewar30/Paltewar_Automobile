import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { categorySchema } from '@/lib/validations'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { customers: true } } },
  })

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  return NextResponse.json(category)
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
  const result = categorySchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: result.error.flatten() },
      { status: 400 }
    )
  }

  const existing = await prisma.category.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const nameConflict = await prisma.category.findFirst({
    where: { name: result.data.name, NOT: { id } },
  })

  if (nameConflict) {
    return NextResponse.json(
      { error: 'Category with this name already exists' },
      { status: 409 }
    )
  }

  const category = await prisma.category.update({
    where: { id },
    data: { name: result.data.name },
  })

  return NextResponse.json(category)
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
  const category = await prisma.category.findUnique({
    where: { id },
    include: { _count: { select: { customers: true } } },
  })

  if (!category) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  if (category._count.customers > 0) {
    return NextResponse.json(
      {
        error: `Cannot delete category: ${category._count.customers} customer(s) are assigned to it. Reassign them first.`,
      },
      { status: 409 }
    )
  }

  await prisma.category.delete({ where: { id } })

  return NextResponse.json({ message: 'Category deleted successfully' })
}
