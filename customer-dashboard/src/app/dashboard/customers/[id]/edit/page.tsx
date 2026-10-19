'use client'

import { useEffect, useState } from 'react'
import { CustomerForm } from '@/components/customers/CustomerForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { use } from 'react'

interface Customer {
  id: string
  customerName: string
  phoneNumber: string
  alternateMobileNumber: string | null
  address: string | null
  city: string | null
  district: string | null
  state: string | null
  workDescription: string | null
  categoryId: string | null
  notes: string | null
}

export default function EditCustomerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/customers/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('Customer not found')
        return r.json()
      })
      .then((data) => {
        setCustomer(data)
        setIsLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setIsLoading(false)
      })
  }, [id])

  return (
    <div>
      <div className="section-header" style={{ marginBottom: 24 }}>
        <div>
          <Link
            href="/dashboard/customers"
            className="btn btn-ghost btn-sm"
            style={{ marginBottom: 8, paddingLeft: 0 }}
          >
            <ArrowLeft size={16} /> Back to Customers
          </Link>
          <h2 className="section-title">Edit Customer</h2>
          <p className="section-desc">Update the customer details below</p>
        </div>
      </div>

      <div className="card" style={{ padding: 28, maxWidth: 900 }}>
        {isLoading ? (
          <div className="loading-overlay">
            <span className="loading-spinner" />
            Loading customer data...
          </div>
        ) : error ? (
          <div className="empty-state">
            <div className="empty-state-title">Customer not found</div>
            <p className="empty-state-desc">{error}</p>
            <Link href="/dashboard/customers" className="btn btn-primary">
              Back to Customers
            </Link>
          </div>
        ) : customer ? (
          <CustomerForm
            customerId={id}
            defaultValues={{
              customerName: customer.customerName,
              phoneNumber: customer.phoneNumber,
              alternateMobileNumber: customer.alternateMobileNumber || '',
              address: customer.address || '',
              city: customer.city || '',
              district: customer.district || '',
              state: customer.state || '',
              workDescription: customer.workDescription || '',
              categoryId: customer.categoryId || '',
              notes: customer.notes || '',
            }}
          />
        ) : null}
      </div>
    </div>
  )
}
