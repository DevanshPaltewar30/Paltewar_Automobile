'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search, Eye, Edit2, Trash2, ChevronUp, ChevronDown,
  ChevronLeft, ChevronRight, Filter, X, Phone, MapPin, Tag
} from 'lucide-react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { useToast } from '@/components/ui/Toast'
import { format } from 'date-fns'
import Link from 'next/link'

interface Category {
  id: string
  name: string
}

interface Customer {
  id: string
  customerName: string
  phoneNumber: string
  alternateMobileNumber: string | null
  city: string | null
  district: string | null
  state: string | null
  workDescription: string | null
  notes: string | null
  address: string | null
  categoryId: string | null
  category: Category | null
  createdAt: string
}

interface PaginationData {
  page: number
  limit: number
  total: number
  totalPages: number
}

interface CustomerViewModalProps {
  customer: Customer
  onClose: () => void
}

function CustomerViewModal({ customer, onClose }: CustomerViewModalProps) {
  const fields = [
    { label: 'Customer Name', value: customer.customerName },
    { label: 'Primary Phone', value: customer.phoneNumber },
    { label: 'Alternate Phone', value: customer.alternateMobileNumber || '—' },
    { label: 'Address', value: customer.address || '—' },
    { label: 'City', value: customer.city || '—' },
    { label: 'District', value: customer.district || '—' },
    { label: 'State', value: customer.state || '—' },
    { label: 'Work Category', value: customer.category?.name || '—' },
    { label: 'Work Description', value: customer.workDescription || '—' },
    { label: 'Notes', value: customer.notes || '—' },
    { label: 'Added On', value: format(new Date(customer.createdAt), 'dd MMM yyyy, hh:mm a') },
  ]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <div className="modal-title">{customer.customerName}</div>
            <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2 }}>
              Customer Details
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">
          {fields.map((f) => (
            <div key={f.label} className="detail-row">
              <div className="detail-label">{f.label}</div>
              <div className="detail-value">{f.value}</div>
            </div>
          ))}
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
          <Link href={`/dashboard/customers/${customer.id}/edit`} className="btn btn-primary">
            <Edit2 size={14} /> Edit Customer
          </Link>
        </div>
      </div>
    </div>
  )
}

export function CustomerTable() {
  const router = useRouter()
  const { showToast } = useToast()

  const [customers, setCustomers] = useState<Customer[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1, limit: 10, total: 0, totalPages: 0
  })
  const [isLoading, setIsLoading] = useState(true)

  // Filters
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterCity, setFilterCity] = useState('')
  const [filterDistrict, setFilterDistrict] = useState('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Modals
  const [viewCustomer, setViewCustomer] = useState<Customer | null>(null)
  const [deleteCustomer, setDeleteCustomer] = useState<Customer | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCustomers = useCallback(async (page = 1) => {
    setIsLoading(true)
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10',
      search,
      categoryId: filterCategory,
      city: filterCity,
      district: filterDistrict,
      sortBy,
      sortOrder,
    })
    const res = await fetch(`/api/customers?${params}`)
    if (res.ok) {
      const data = await res.json()
      setCustomers(data.customers)
      setPagination(data.pagination)
    }
    setIsLoading(false)
  }, [search, filterCategory, filterCity, filterDistrict, sortBy, sortOrder])

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories)
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(1), 300)
    return () => clearTimeout(timer)
  }, [fetchCustomers])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(o => o === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleDelete = async () => {
    if (!deleteCustomer) return
    setIsDeleting(true)
    const res = await fetch(`/api/customers/${deleteCustomer.id}`, { method: 'DELETE' })
    if (res.ok) {
      showToast('Customer deleted successfully', 'success')
      setDeleteCustomer(null)
      fetchCustomers(pagination.page)
    } else {
      const data = await res.json()
      showToast(data.error || 'Failed to delete customer', 'error')
    }
    setIsDeleting(false)
  }

  const clearFilters = () => {
    setSearch('')
    setFilterCategory('')
    setFilterCity('')
    setFilterDistrict('')
  }

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field) return null
    return sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  const hasFilters = search || filterCategory || filterCity || filterDistrict

  return (
    <div>
      {/* Filter Bar */}
      <div className="card" style={{ padding: 16, marginBottom: 20 }}>
        <div className="filter-bar">
          <div className="search-input-wrapper" style={{ minWidth: 260 }}>
            <span className="search-input-icon"><Search size={16} /></span>
            <input
              type="text"
              id="customer-search"
              className="form-input search-input"
              placeholder="Search by name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            id="filter-category"
            className="form-input form-select"
            style={{ width: 180 }}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <input
            type="text"
            id="filter-city"
            className="form-input"
            style={{ width: 140 }}
            placeholder="City..."
            value={filterCity}
            onChange={(e) => setFilterCity(e.target.value)}
          />

          <input
            type="text"
            id="filter-district"
            className="form-input"
            style={{ width: 140 }}
            placeholder="District..."
            value={filterDistrict}
            onChange={(e) => setFilterDistrict(e.target.value)}
          />

          {hasFilters && (
            <button className="btn btn-ghost" onClick={clearFilters} title="Clear filters">
              <X size={16} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="data-table-wrapper" style={{ border: 'none', borderRadius: 0 }}>
          <table className="data-table">
            <thead>
              <tr>
                <th
                  className="sortable"
                  onClick={() => handleSort('customerName')}
                >
                  Customer Name <SortIcon field="customerName" />
                </th>
                <th>Phone Numbers</th>
                <th>Location</th>
                <th>Category</th>
                <th
                  className="sortable"
                  onClick={() => handleSort('createdAt')}
                >
                  Date Added <SortIcon field="createdAt" />
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 6 }).map((_, j) => (
                      <td key={j}>
                        <div className="skeleton" style={{ height: 16, width: '80%' }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className="empty-state">
                      <div className="empty-state-icon">
                        <Search size={28} />
                      </div>
                      <div className="empty-state-title">No customers found</div>
                      <p className="empty-state-desc">
                        {hasFilters
                          ? 'Try adjusting your filters or search term.'
                          : 'Add your first customer to get started.'}
                      </p>
                      {!hasFilters && (
                        <Link href="/dashboard/customers/new" className="btn btn-primary">
                          + Add Customer
                        </Link>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{customer.customerName}</div>
                      {customer.workDescription && (
                        <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 2 }}>
                          {customer.workDescription.substring(0, 40)}{customer.workDescription.length > 40 ? '...' : ''}
                        </div>
                      )}
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                          <Phone size={12} color="var(--color-primary)" />
                          {customer.phoneNumber}
                        </div>
                        {customer.alternateMobileNumber && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-text-secondary)' }}>
                            <Phone size={11} />
                            {customer.alternateMobileNumber}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      {(customer.city || customer.district) ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                          <MapPin size={12} color="var(--color-text-secondary)" />
                          {[customer.city, customer.district].filter(Boolean).join(', ')}
                        </div>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>—</span>
                      )}
                    </td>
                    <td>
                      {customer.category ? (
                        <span className="badge badge-primary">
                          <Tag size={10} style={{ marginRight: 4 }} />
                          {customer.category.name}
                        </span>
                      ) : (
                        <span className="badge badge-gray">Uncategorized</span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--color-text-secondary)' }}>
                      {format(new Date(customer.createdAt), 'dd MMM yyyy')}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => setViewCustomer(customer)}
                          title="View details"
                          id={`view-customer-${customer.id}`}
                        >
                          <Eye size={16} />
                        </button>
                        <Link
                          href={`/dashboard/customers/${customer.id}/edit`}
                          className="btn btn-ghost btn-icon"
                          title="Edit customer"
                          id={`edit-customer-${customer.id}`}
                        >
                          <Edit2 size={16} />
                        </Link>
                        <button
                          className="btn btn-ghost btn-icon"
                          onClick={() => setDeleteCustomer(customer)}
                          title="Delete customer"
                          id={`delete-customer-${customer.id}`}
                          style={{ color: 'var(--color-danger)' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && pagination.totalPages > 1 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--color-border)' }}>
            <div className="pagination">
              <div className="pagination-info">
                Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–
                {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} customers
              </div>
              <div className="pagination-controls">
                <button
                  className="pagination-btn"
                  disabled={pagination.page <= 1}
                  onClick={() => fetchCustomers(pagination.page - 1)}
                >
                  <ChevronLeft size={16} />
                </button>
                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                  let page: number
                  if (pagination.totalPages <= 5) {
                    page = i + 1
                  } else if (pagination.page <= 3) {
                    page = i + 1
                  } else if (pagination.page >= pagination.totalPages - 2) {
                    page = pagination.totalPages - 4 + i
                  } else {
                    page = pagination.page - 2 + i
                  }
                  return (
                    <button
                      key={page}
                      className={`pagination-btn ${pagination.page === page ? 'active' : ''}`}
                      onClick={() => fetchCustomers(page)}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  className="pagination-btn"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => fetchCustomers(pagination.page + 1)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewCustomer && (
        <CustomerViewModal
          customer={viewCustomer}
          onClose={() => setViewCustomer(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteCustomer && (
        <ConfirmDialog
          title="Delete Customer"
          message={`Are you sure you want to delete "${deleteCustomer.customerName}"? This action cannot be undone.`}
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteCustomer(null)}
          isLoading={isDeleting}
        />
      )}
    </div>
  )
}
