import { Invoice, Customer } from '@/types/invoice';

export const sampleCustomers: Customer[] = [
  {
    id: '1',
    name: 'Acme Corporation',
    email: 'billing@acme.com',
    phone: '+1 (555) 123-4567',
    address: '123 Business Ave, Suite 100, New York, NY 10001'
  },
  {
    id: '2',
    name: 'Tech Solutions Ltd',
    email: 'accounts@techsolutions.com',
    phone: '+1 (555) 987-6543',
    address: '456 Innovation Drive, San Francisco, CA 94107'
  },
  {
    id: '3',
    name: 'Global Enterprises',
    email: 'payments@global.com',
    phone: '+1 (555) 456-7890',
    address: '789 Corporate Blvd, Chicago, IL 60601'
  }
];

export const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    customer: sampleCustomers[0],
    items: [
      {
        id: '1',
        description: 'Web Development Services',
        quantity: 40,
        rate: 125,
        amount: 5000
      },
      {
        id: '2',
        description: 'UI/UX Design',
        quantity: 20,
        rate: 100,
        amount: 2000
      }
    ],
    subtotal: 7000,
    tax: 630,
    total: 7630,
    status: 'paid',
    issueDate: '2024-01-15',
    dueDate: '2024-02-15',
    notes: 'Thank you for your business!',
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    customer: sampleCustomers[1],
    items: [
      {
        id: '3',
        description: 'Mobile App Development',
        quantity: 80,
        rate: 150,
        amount: 12000
      }
    ],
    subtotal: 12000,
    tax: 1080,
    total: 13080,
    status: 'sent',
    issueDate: '2024-01-20',
    dueDate: '2024-02-20',
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T09:00:00Z'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    customer: sampleCustomers[2],
    items: [
      {
        id: '4',
        description: 'Consulting Services',
        quantity: 16,
        rate: 200,
        amount: 3200
      }
    ],
    subtotal: 3200,
    tax: 288,
    total: 3488,
    status: 'overdue',
    issueDate: '2024-01-05',
    dueDate: '2024-01-25',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-05T11:00:00Z'
  }
];