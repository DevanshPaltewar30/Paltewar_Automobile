'use client'

import { useEffect, useState } from 'react'
import { Users, Tags, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

interface Stats {
  totalCustomers: number
  totalCategories: number
  recentCustomers: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setStats(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [])

  const statCards = [
    {
      label: 'Total Customers',
      value: stats?.totalCustomers ?? 0,
      icon: Users,
      iconClass: 'stat-icon-primary',
      cardClass: 'stat-card-primary',
      badge: 'All time',
      badgeClass: 'stat-badge-blue',
      href: '/dashboard/customers',
    },
    {
      label: 'Total Categories',
      value: stats?.totalCategories ?? 0,
      icon: Tags,
      iconClass: 'stat-icon-success',
      cardClass: 'stat-card-success',
      badge: 'Work types',
      badgeClass: 'stat-badge-success',
      href: '/dashboard/categories',
    },
    {
      label: 'Recent Customers',
      value: stats?.recentCustomers ?? 0,
      icon: TrendingUp,
      iconClass: 'stat-icon-accent',
      cardClass: 'stat-card-accent',
      badge: 'Last 7 days',
      badgeClass: 'stat-badge-blue',
      href: '/dashboard/customers',
    },
  ]

  return (
    <div>
      {/* Welcome Banner */}
      <div
        className="card"
        style={{
          marginBottom: 28,
          padding: '28px 32px',
          background: 'linear-gradient(135deg, var(--color-secondary) 0%, #1e293b 100%)',
          border: 'none',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: -40, right: -40,
            width: 200, height: 200,
            borderRadius: '50%',
            background: 'rgba(99,102,241,0.1)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: -30, right: 120,
            width: 120, height: 120,
            borderRadius: '50%',
            background: 'rgba(6,182,212,0.08)',
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 6 }}>
              Welcome back! 👋
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', maxWidth: 480 }}>
              Manage your customer records, track work categories, and keep your business data organized.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Link href="/dashboard/customers/new" className="btn btn-primary" style={{ whiteSpace: 'nowrap' }}>
              + Add Customer
            </Link>
            <Link href="/dashboard/customers" className="btn btn-secondary">
              View All
            </Link>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid-stats">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} style={{ textDecoration: 'none' }}>
            <div className={`card stat-card ${card.cardClass}`}>
              <div>
                {isLoading ? (
                  <div className="skeleton" style={{ width: 80, height: 40, marginBottom: 8 }} />
                ) : (
                  <div className="stat-value">{card.value.toLocaleString()}</div>
                )}
                <div className="stat-label">{card.label}</div>
                <div className={`stat-badge ${card.badgeClass}`}>
                  <Calendar size={10} />
                  {card.badge}
                </div>
              </div>
              <div className={`stat-card-icon ${card.iconClass}`}>
                <card.icon size={22} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid-2" style={{ gap: 20 }}>
        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Quick Actions</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Common tasks to get you started
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/dashboard/customers/new" className="btn btn-primary" id="quick-add-customer">
              <Users size={16} /> Add New Customer
            </Link>
            <Link href="/dashboard/categories" className="btn btn-secondary" id="quick-manage-categories">
              <Tags size={16} /> Manage Categories
            </Link>
          </div>
        </div>

        <div className="card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>System Info</h3>
          <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 20 }}>
            Database connection status
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Database</span>
              <span className="badge badge-success">● Connected</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>ORM</span>
              <span className="badge badge-primary">Prisma</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, color: 'var(--color-text-secondary)' }}>Provider</span>
              <span className="badge badge-primary">Supabase PostgreSQL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
