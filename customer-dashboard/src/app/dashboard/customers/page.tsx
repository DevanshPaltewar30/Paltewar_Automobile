import { CustomerTable } from '@/components/customers/CustomerTable'
import Link from 'next/link'
import { UserPlus } from 'lucide-react'

export default function CustomersPage() {
  return (
    <div>
      <div className="section-header">
        <div>
          <h2 className="section-title">All Customers</h2>
          <p className="section-desc">Search, filter, and manage all your customer records</p>
        </div>
        <Link href="/dashboard/customers/new" className="btn btn-primary" id="add-customer-btn">
          <UserPlus size={16} /> Add Customer
        </Link>
      </div>
      <CustomerTable />
    </div>
  )
}
