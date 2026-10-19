'use client'

import { useState } from 'react'
import { Menu, User, Bell } from 'lucide-react'
import { useSession } from 'next-auth/react'

interface TopbarProps {
  title: string
  subtitle?: string
  onMenuClick?: () => void
}

export function Topbar({ title, subtitle, onMenuClick }: TopbarProps) {
  const { data: session } = useSession()

  return (
    <header className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <button
          className="btn btn-ghost btn-icon"
          onClick={onMenuClick}
          style={{ display: 'none' }}
          id="mobile-menu-btn"
        >
          <Menu size={20} />
        </button>
        <div>
          <h1 className="topbar-title">{title}</h1>
          {subtitle && <p className="topbar-subtitle">{subtitle}</p>}
        </div>
      </div>

      <div className="topbar-right">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            padding: '6px 14px',
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <User size={16} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>
              {session?.user?.name || session?.user?.email?.split('@')[0] || 'Admin'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>
              Administrator
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
