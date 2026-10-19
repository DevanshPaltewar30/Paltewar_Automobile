import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await auth()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [totalCustomers, totalCategories, recentCustomers] = await Promise.all([
    prisma.customer.count(),
    prisma.category.count(),
    prisma.customer.count({
      where: { createdAt: { gte: sevenDaysAgo } },
    }),
  ])

  return NextResponse.json({
    totalCustomers,
    totalCategories,
    recentCustomers,
  })
}
