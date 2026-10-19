import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@1234'

  const existingAdmin = await prisma.admin.findUnique({
    where: { email: adminEmail },
  })

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    await prisma.admin.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: 'Admin',
      },
    })
    console.log(`✅ Admin created: ${adminEmail}`)
  } else {
    console.log(`ℹ️  Admin already exists: ${adminEmail}`)
  }

  // Create sample categories
  const categories = [
    'Plumbing',
    'Electrical',
    'Carpentry',
    'Painting',
    'Flooring',
    'Roofing',
    'HVAC',
    'General Construction',
  ]

  for (const name of categories) {
    const existing = await prisma.category.findUnique({ where: { name } })
    if (!existing) {
      await prisma.category.create({ data: { name } })
      console.log(`✅ Category created: ${name}`)
    }
  }

  console.log('🎉 Seeding complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
