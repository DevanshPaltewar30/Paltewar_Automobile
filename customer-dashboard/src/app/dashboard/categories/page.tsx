'use client'

import { useState, useEffect } from 'react'
import { useToast } from '@/components/ui/Toast'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import {
  Plus, Edit2, Trash2, Tag, X, Check, Loader2, Search
} from 'lucide-react'

interface Category {
  id: string
  name: string
  createdAt: string
  _count: { customers: number }
}

export default function CategoriesPage() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')

  // Add
  const [showAddForm, setShowAddForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Delete
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchCategories = async () => {
    setIsLoading(true)
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAdd = async () => {
    if (!newName.trim()) return
    setIsAdding(true)
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast(`Category "${data.name}" created!`, 'success')
      setNewName('')
      setShowAddForm(false)
      fetchCategories()
    } else {
      showToast(data.error || 'Failed to create category', 'error')
    }
    setIsAdding(false)
  }

  const handleEditStart = (cat: Category) => {
    setEditingId(cat.id)
    setEditName(cat.name)
  }

  const handleEditSave = async (id: string) => {
    if (!editName.trim()) return
    setIsSaving(true)
    const res = await fetch(`/api/categories/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName.trim() }),
    })
    const data = await res.json()
    if (res.ok) {
      showToast('Category renamed!', 'success')
      setEditingId(null)
      fetchCategories()
    } else {
      showToast(data.error || 'Failed to rename', 'error')
    }
    setIsSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteCategory) return
    setIsDeleting(true)
    const res = await fetch(`/api/categories/${deleteCategory.id}`, { method: 'DELETE' })
    const data = await res.json()
    if (res.ok) {
      showToast('Category deleted', 'success')
      setDeleteCategory(null)
      fetchCategories()
    } else {
      showToast(data.error || 'Failed to delete', 'error')
      setDeleteCategory(null)
    }
    setIsDeleting(false)
  }

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">Work Categories</h2>
          <p className="section-desc">
            Organize customers by their type of work. {categories.length} categor{categories.length === 1 ? 'y' : 'ies'} total.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowAddForm(true)}
          id="add-category-btn"
        >
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Add Category Inline Form */}
      {showAddForm && (
        <div
          className="card"
          style={{
            padding: 20,
            marginBottom: 20,
            border: '2px solid rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.03)',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: 12, fontSize: 15 }}>
            New Category
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input
              type="text"
              className="form-input"
              placeholder="Category name (e.g., Plumbing, Electrical...)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              autoFocus
              id="new-category-name-input"
              style={{ maxWidth: 400 }}
            />
            <button
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={isAdding || !newName.trim()}
              id="save-category-btn"
            >
              {isAdding ? <Loader2 size={14} className="animate-spin" /> : <Check size={16} />}
              Save
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => { setShowAddForm(false); setNewName('') }}
            >
              <X size={16} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="card" style={{ padding: 14, marginBottom: 20 }}>
        <div className="search-input-wrapper" style={{ maxWidth: 350 }}>
          <span className="search-input-icon"><Search size={16} /></span>
          <input
            type="text"
            id="category-search"
            className="form-input search-input"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category Grid */}
      {isLoading ? (
        <div className="category-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card category-card">
              <div className="skeleton" style={{ height: 40, width: 40, borderRadius: 10 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 12, width: '30%' }} />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon"><Tag size={28} /></div>
            <div className="empty-state-title">
              {search ? 'No categories match your search' : 'No categories yet'}
            </div>
            <p className="empty-state-desc">
              {search
                ? 'Try a different search term.'
                : 'Create work categories to organize your customers.'}
            </p>
            {!search && (
              <button className="btn btn-primary" onClick={() => setShowAddForm(true)}>
                <Plus size={16} /> Add First Category
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="category-grid">
          {filtered.map((cat) => (
            <div key={cat.id} className="card category-card">
              <div className="category-info">
                <div className="category-icon-wrap">
                  <Tag size={18} />
                </div>
                {editingId === cat.id ? (
                  <div style={{ flex: 1 }}>
                    <input
                      type="text"
                      className="form-input"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleEditSave(cat.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      autoFocus
                      style={{ height: 36 }}
                      id={`edit-category-${cat.id}`}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="category-name">{cat.name}</div>
                    <div className="category-count">
                      {cat._count.customers} customer{cat._count.customers !== 1 ? 's' : ''}
                    </div>
                  </div>
                )}
              </div>

              <div className="category-actions">
                {editingId === cat.id ? (
                  <>
                    <button
                      className="btn btn-primary btn-icon"
                      onClick={() => handleEditSave(cat.id)}
                      disabled={isSaving}
                      title="Save"
                    >
                      {isSaving ? <Loader2 size={14} /> : <Check size={14} />}
                    </button>
                    <button
                      className="btn btn-secondary btn-icon"
                      onClick={() => setEditingId(null)}
                      title="Cancel"
                    >
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => handleEditStart(cat)}
                      title="Rename"
                      id={`rename-category-${cat.id}`}
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={() => setDeleteCategory(cat)}
                      title={
                        cat._count.customers > 0
                          ? `Cannot delete: ${cat._count.customers} customer(s) assigned`
                          : 'Delete category'
                      }
                      id={`delete-category-${cat.id}`}
                      style={{ color: cat._count.customers > 0 ? 'var(--color-text-muted)' : 'var(--color-danger)' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {deleteCategory && (
        <ConfirmDialog
          title="Delete Category"
          message={
            deleteCategory._count.customers > 0
              ? `Cannot delete "${deleteCategory.name}" — it has ${deleteCategory._count.customers} customer(s) assigned. Reassign them first.`
              : `Delete category "${deleteCategory.name}"? This action cannot be undone.`
          }
          confirmLabel={deleteCategory._count.customers > 0 ? 'OK' : 'Delete'}
          cancelLabel={deleteCategory._count.customers > 0 ? 'Close' : 'Cancel'}
          onConfirm={deleteCategory._count.customers > 0 ? () => setDeleteCategory(null) : handleDelete}
          onCancel={() => setDeleteCategory(null)}
          isLoading={isDeleting}
          variant={deleteCategory._count.customers > 0 ? 'warning' : 'danger'}
        />
      )}
    </div>
  )
}
