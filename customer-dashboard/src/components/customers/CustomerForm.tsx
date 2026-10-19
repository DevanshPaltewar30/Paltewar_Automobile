'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { customerSchema, CustomerFormData } from '@/lib/validations'
import { useToast } from '@/components/ui/Toast'
import { Plus, X, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
}

interface CustomerFormProps {
  customerId?: string
  defaultValues?: Partial<CustomerFormData>
  onSuccess?: () => void
}

export function CustomerForm({ customerId, defaultValues, onSuccess }: CustomerFormProps) {
  const router = useRouter()
  const { showToast } = useToast()
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showNewCategory, setShowNewCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [addingCategory, setAddingCategory] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
    reset,
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    defaultValues,
  })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const res = await fetch('/api/categories')
    if (res.ok) {
      const data = await res.json()
      setCategories(data)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return
    setAddingCategory(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName.trim() }),
      })
      const data = await res.json()
      if (res.ok) {
        setCategories((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
        setValue('categoryId', data.id)
        setNewCategoryName('')
        setShowNewCategory(false)
        showToast(`Category "${data.name}" created!`, 'success')
      } else {
        showToast(data.error || 'Failed to create category', 'error')
      }
    } catch {
      showToast('Network error', 'error')
    }
    setAddingCategory(false)
  }

  const onSubmit = async (data: CustomerFormData) => {
    setIsLoading(true)
    try {
      const url = customerId
        ? `/api/customers/${customerId}`
        : '/api/customers'
      const method = customerId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const result = await res.json()

      if (res.ok) {
        showToast(
          customerId ? 'Customer updated successfully!' : 'Customer added successfully!',
          'success'
        )
        if (onSuccess) {
          onSuccess()
        } else {
          router.push('/dashboard/customers')
          router.refresh()
        }
      } else {
        showToast(result.error || 'Failed to save customer', 'error')
      }
    } catch {
      showToast('Network error. Please try again.', 'error')
    }
    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Row 1: Name + Phone */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="customerName">
              Customer Name <span className="required">*</span>
            </label>
            <input
              id="customerName"
              type="text"
              className={`form-input ${errors.customerName ? 'error' : ''}`}
              placeholder="Full name"
              {...register('customerName')}
            />
            {errors.customerName && (
              <p className="form-error">{errors.customerName.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="phoneNumber">
              Primary Mobile Number <span className="required">*</span>
            </label>
            <input
              id="phoneNumber"
              type="tel"
              className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
              placeholder="+91 98765 43210"
              {...register('phoneNumber')}
            />
            {errors.phoneNumber && (
              <p className="form-error">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        {/* Row 2: Alternate Phone + Address */}
        <div className="grid-2">
          <div className="form-group">
            <label className="form-label" htmlFor="alternateMobileNumber">
              Alternate Mobile Number
            </label>
            <input
              id="alternateMobileNumber"
              type="tel"
              className={`form-input ${errors.alternateMobileNumber ? 'error' : ''}`}
              placeholder="+91 87654 32109"
              {...register('alternateMobileNumber')}
            />
            {errors.alternateMobileNumber && (
              <p className="form-error">{errors.alternateMobileNumber.message}</p>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="address">
              Address
            </label>
            <input
              id="address"
              type="text"
              className="form-input"
              placeholder="Street address"
              {...register('address')}
            />
          </div>
        </div>

        {/* Row 3: City, District, State */}
        <div className="grid-3">
          <div className="form-group">
            <label className="form-label" htmlFor="city">City</label>
            <input
              id="city"
              type="text"
              className="form-input"
              placeholder="City"
              {...register('city')}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="district">District</label>
            <input
              id="district"
              type="text"
              className="form-input"
              placeholder="District"
              {...register('district')}
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="state">State</label>
            <input
              id="state"
              type="text"
              className="form-input"
              placeholder="State"
              {...register('state')}
            />
          </div>
        </div>

        {/* Work Description */}
        <div className="form-group">
          <label className="form-label" htmlFor="workDescription">
            Work Description
          </label>
          <textarea
            id="workDescription"
            className="form-input form-textarea"
            placeholder="Describe the work or requirements..."
            {...register('workDescription')}
          />
        </div>

        {/* Category */}
        <div className="form-group">
          <label className="form-label" htmlFor="categoryId">
            Work Category
          </label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <select
                id="categoryId"
                className="form-input form-select"
                {...register('categoryId')}
              >
                <option value="">— Select a category —</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowNewCategory(!showNewCategory)}
              title="Add new category"
              style={{ flexShrink: 0 }}
            >
              <Plus size={16} />
              New
            </button>
          </div>

          {/* Inline new category input */}
          {showNewCategory && (
            <div
              style={{
                display: 'flex',
                gap: 8,
                marginTop: 10,
                padding: 14,
                background: 'rgba(99,102,241,0.05)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid rgba(99,102,241,0.2)',
              }}
            >
              <input
                type="text"
                className="form-input"
                placeholder="New category name..."
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCategory()
                  }
                }}
                autoFocus
                id="new-category-input"
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleAddCategory}
                disabled={addingCategory || !newCategoryName.trim()}
              >
                {addingCategory ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
              </button>
              <button
                type="button"
                className="btn btn-ghost btn-icon"
                onClick={() => { setShowNewCategory(false); setNewCategoryName('') }}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Notes */}
        <div className="form-group">
          <label className="form-label" htmlFor="notes">
            Comments / Notes
          </label>
          <textarea
            id="notes"
            className="form-input form-textarea"
            placeholder="Additional notes or comments..."
            {...register('notes')}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', paddingTop: 8 }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => router.push('/dashboard/customers')}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            id="customer-form-submit"
          >
            {isLoading && <span className="loading-spinner" style={{ width: 16, height: 16 }} />}
            {isLoading
              ? 'Saving...'
              : customerId
              ? 'Update Customer'
              : 'Add Customer'}
          </button>
        </div>
      </div>
    </form>
  )
}
