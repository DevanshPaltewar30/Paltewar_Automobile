import { CustomerForm } from '@/components/customers/CustomerForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewCustomerPage() {
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
          <h2 className="section-title">Add New Customer</h2>
          <p className="section-desc">Fill in the details below to create a new customer record</p>
        </div>
      </div>

      <div className="card" style={{ padding: 28, maxWidth: 900 }}>
        <CustomerForm />
      </div>
    </div>
  )
}
