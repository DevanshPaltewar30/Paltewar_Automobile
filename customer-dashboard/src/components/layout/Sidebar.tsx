'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import {
  LayoutDashboard,
  Users,
  Tags,
  LogOut,
  Database,
  X,
} from 'lucide-react'

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

const navItems = [
  {
    label: 'Main',
    items: [
      { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { href: '/dashboard/customers', icon: Users, label: 'Customers' },
      { href: '/dashboard/categories', icon: Tags, label: 'Categories' },
    ],
  },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' })
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="modal-overlay"
          style={{ background: 'rgba(0,0,0,0.4)', zIndex: 39 }}
          onClick={onClose}
        />
      )}

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Database size={18} color="white" />
          </div>
          <div>
            <div className="sidebar-logo-text">CustomerDB</div>
            <div className="sidebar-logo-sub">Admin Dashboard</div>
          </div>
          {onClose && (
            <button
              className="btn btn-ghost btn-icon"
              onClick={onClose}
              style={{
                marginLeft: 'auto',
                color: 'rgba(255,255,255,0.5)',
                display: 'none',
              }}
              id="sidebar-close-btn"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          {navItems.map((section) => (
            <div key={section.label}>
              <div className="sidebar-nav-label">{section.label}</div>
              {section.items.map((item) => {
                const isActive =
                  item.href === '/dashboard'
                    ? pathname === '/dashboard'
                    : pathname.startsWith(item.href)

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                    onClick={onClose}
                  >
                    <item.icon size={18} className="nav-icon" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <button
            className="sidebar-nav-item"
            onClick={handleSignOut}
            style={{ color: 'rgba(239,68,68,0.8)' }}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}
