'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar } from '@/components/layout/Topbar'
import { usePathname } from 'next/navigation'

const pageTitles: Record<string, { title: string; subtitle?: string }> = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Overview of your customer data' },
  '/dashboard/customers': { title: 'Customers', subtitle: 'Manage all customer records' },
  '/dashboard/customers/new': { title: 'Add Customer', subtitle: 'Create a new customer record' },
  '/dashboard/categories': { title: 'Categories', subtitle: 'Manage work categories' },
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  // Match dynamic routes
  let pageInfo = pageTitles[pathname]
  if (!pageInfo) {
    if (pathname.includes('/customers/') && pathname.includes('/edit')) {
      pageInfo = { title: 'Edit Customer', subtitle: 'Update customer information' }
    } else if (pathname.includes('/customers/')) {
      pageInfo = { title: 'Customer Details', subtitle: 'View customer information' }
    } else {
      pageInfo = { title: 'Dashboard', subtitle: '' }
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="main-content">
        <Topbar
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <div className="page-content">{children}</div>
      </main>
    </div>
  )
}
