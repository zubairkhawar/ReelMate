'use client'

import { useState } from 'react'
import { 
  CreditCard, 
  Download, 
  Edit, 
  Plus, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Building,
  MapPin,
  Phone,
  Mail,
  User,
  Calendar,
  DollarSign,
  Shield,
  Zap,
  Star,
  ChevronRight,
  ExternalLink,
  Settings,
  Receipt,
  FileText,
  CreditCard as CardIcon,
  Banknote,
  Wallet,
  X
} from 'lucide-react'
import Link from 'next/link'

interface Subscription {
  plan: string
  price: number
  billingCycle: string
  nextBilling: string
  status: 'active' | 'expired' | 'trial' | 'cancelled'
  features: string[]
  credits: number
  creditsUsed: number
}

interface PaymentMethod {
  id: string
  type: 'card' | 'bank'
  last4: string
  brand: string
  expiry: string
  isDefault: boolean
  name: string
}

interface BillingAddress {
  name: string
  company: string
  address: string
  city: string
  state: string
  zip: string
  country: string
  phone: string
  email: string
}

interface Invoice {
  id: string
  date: string
  amount: number
  status: 'paid' | 'pending' | 'overdue' | 'cancelled'
  description: string
  invoiceNumber: string
  dueDate: string
}

const mockSubscription: Subscription = {
  plan: 'Pro Plan',
  price: 99,
  billingCycle: 'monthly',
  nextBilling: 'March 15, 2024',
  status: 'active',
  features: [
    'Unlimited UGC videos',
    'AI-powered content generation',
    'Advanced analytics',
    'Priority support',
    'Custom branding',
    'API access'
  ],
  credits: 1000,
  creditsUsed: 247
}

const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    last4: '4242',
    brand: 'Visa',
    expiry: '12/25',
    isDefault: true,
    name: 'John Doe'
  },
  {
    id: '2',
    type: 'card',
    last4: '8888',
    brand: 'Mastercard',
    expiry: '08/26',
    isDefault: false,
    name: 'John Doe'
  }
]

const mockBillingAddress: BillingAddress = {
  name: 'John Doe',
  company: 'Tech Solutions Inc.',
  address: '123 Business Street',
  city: 'New York',
  state: 'NY',
  zip: '10001',
  country: 'United States',
  phone: '+1 (555) 123-4567',
  email: 'john.doe@company.com'
}

const mockInvoices: Invoice[] = [
  {
    id: '1',
    date: 'Feb 15, 2024',
    amount: 99.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    invoiceNumber: 'INV-2024-002',
    dueDate: 'Feb 15, 2024'
  },
  {
    id: '2',
    date: 'Jan 15, 2024',
    amount: 99.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    invoiceNumber: 'INV-2024-001',
    dueDate: 'Jan 15, 2024'
  },
  {
    id: '3',
    date: 'Dec 15, 2023',
    amount: 99.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    invoiceNumber: 'INV-2023-012',
    dueDate: 'Dec 15, 2023'
  },
  {
    id: '4',
    date: 'Nov 15, 2023',
    amount: 99.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    invoiceNumber: 'INV-2023-011',
    dueDate: 'Nov 15, 2023'
  },
  {
    id: '5',
    date: 'Oct 15, 2023',
    amount: 99.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    invoiceNumber: 'INV-2023-010',
    dueDate: 'Oct 15, 2023'
  },
  {
    id: '6',
    date: 'Sep 15, 2023',
    amount: 99.00,
    status: 'paid',
    description: 'Pro Plan - Monthly Subscription',
    invoiceNumber: 'INV-2023-009',
    dueDate: 'Sep 15, 2023'
  }
]

export default function BillingPage() {
  const [isEditingAddress, setIsEditingAddress] = useState(false)
  const [billingAddress, setBillingAddress] = useState(mockBillingAddress)
  const [editedAddress, setEditedAddress] = useState(mockBillingAddress)
  const [showAddPaymentMethod, setShowAddPaymentMethod] = useState(false)

  const handleSaveAddress = () => {
    setBillingAddress(editedAddress)
    setIsEditingAddress(false)
  }

  const handleCancelAddress = () => {
    setEditedAddress(billingAddress)
    setIsEditingAddress(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'overdue': return 'bg-red-100 text-red-800'
      case 'cancelled': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'overdue': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const creditsPercentage = (mockSubscription.creditsUsed / mockSubscription.credits) * 100

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
        <p className="text-gray-600 mt-1">Manage your subscription, invoices, and payment methods</p>
      </div>

      {/* Top Section - Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Plan */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Current Plan</h3>
              <p className="text-gray-600 mt-1">Your active subscription details</p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                <Settings className="w-4 h-4 mr-2 inline" />
                Change Plan
              </button>
              <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors duration-200">
                Cancel Plan
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Plan Details */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-gray-900">{mockSubscription.plan}</h4>
                  <p className="text-gray-600 capitalize">{mockSubscription.billingCycle} billing</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold text-gray-900">
                  ${mockSubscription.price}
                  <span className="text-lg text-gray-500">/{mockSubscription.billingCycle}</span>
                </div>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  mockSubscription.status === 'active' ? 'bg-green-100 text-green-800' :
                  mockSubscription.status === 'trial' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {mockSubscription.status}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Next billing date</span>
                  <span className="font-medium text-gray-900">{mockSubscription.nextBilling}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits used</span>
                  <span className="font-medium text-gray-900">
                    {mockSubscription.creditsUsed} / {mockSubscription.credits}
                  </span>
                </div>
              </div>

              {/* Credits Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Credits remaining</span>
                  <span className="font-medium text-gray-900">{mockSubscription.credits - mockSubscription.creditsUsed}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${creditsPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Plan Features */}
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Plan Features</h5>
              <div className="space-y-2">
                {mockSubscription.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Download className="w-5 h-5 mr-3 text-blue-600" />
              <span>Download Invoice</span>
            </button>
            
            <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Receipt className="w-5 h-5 mr-3 text-green-600" />
              <span>View Receipts</span>
            </button>
            
            <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Settings className="w-5 h-5 mr-3 text-purple-600" />
              <span>Billing Settings</span>
            </button>
            
            <button className="w-full flex items-center p-3 text-left text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              <Shield className="w-5 h-5 mr-3 text-orange-600" />
              <span>Security</span>
            </button>
          </div>
        </div>
      </div>

      {/* Middle Section - Payment & Address */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Methods */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Payment Methods</h3>
            <button 
              onClick={() => setShowAddPaymentMethod(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <Plus className="w-4 h-4 mr-2 inline" />
              Add Method
            </button>
          </div>

          <div className="space-y-4">
            {mockPaymentMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <CardIcon className="w-5 h-5 text-gray-600" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-gray-900">
                        {method.brand} •••• {method.last4}
                      </span>
                      {method.isDefault && (
                        <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      {method.name} • Expires {method.expiry}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
                    <Edit className="w-4 h-4" />
                  </button>
                  {!method.isDefault && (
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {showAddPaymentMethod && (
            <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Add Payment Method</h4>
                <button 
                  onClick={() => setShowAddPaymentMethod(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Securely add a new credit card or bank account
              </p>
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200">
                Continue
              </button>
            </div>
          )}
        </div>

        {/* Billing Address */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Billing Address</h3>
            {!isEditingAddress ? (
              <button
                onClick={() => setIsEditingAddress(true)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                <Edit className="w-4 h-4 mr-2 inline" />
                Edit
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSaveAddress}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  Save
                </button>
                <button
                  onClick={handleCancelAddress}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {!isEditingAddress ? (
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Building className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{billingAddress.company}</span>
              </div>
              <div className="flex items-center space-x-3">
                <User className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{billingAddress.name}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">
                  {billingAddress.address}, {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{billingAddress.phone}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <span className="text-gray-900">{billingAddress.email}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={editedAddress.name}
                    onChange={(e) => setEditedAddress({...editedAddress, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    value={editedAddress.company}
                    onChange={(e) => setEditedAddress({...editedAddress, company: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <input
                  type="text"
                  value={editedAddress.address}
                  onChange={(e) => setEditedAddress({...editedAddress, address: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    value={editedAddress.city}
                    onChange={(e) => setEditedAddress({...editedAddress, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                  <input
                    type="text"
                    value={editedAddress.state}
                    onChange={(e) => setEditedAddress({...editedAddress, state: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP</label>
                  <input
                    type="text"
                    value={editedAddress.zip}
                    onChange={(e) => setEditedAddress({...editedAddress, zip: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Section - Invoices Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Invoices</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.invoiceNumber}</div>
                      <div className="text-sm text-gray-500">{invoice.description}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      ${invoice.amount.toFixed(2)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      <span className="ml-1 capitalize">{invoice.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-gray-400 hover:text-gray-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing 1-6 of 6 invoices
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Previous
              </button>
              <button className="px-3 py-2 text-sm text-white bg-blue-600 rounded-lg">1</button>
              <button className="px-3 py-2 text-sm text-gray-500 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
