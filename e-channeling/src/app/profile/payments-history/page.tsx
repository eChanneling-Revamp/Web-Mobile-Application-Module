// src/app/profile/payments-history/page.tsx
"use client";
import React from 'react';

interface PaymentRecord {
  id: string;
  doctorName: string;
  bankName: string;
  fee: number;
  date: string;
  status: 'completed' | 'pending' | 'refunded';
}

const PaymentsHistoryPage: React.FC = () => {
  const payments: PaymentRecord[] = [
    { id: '1', doctorName: 'Dr. Samantha Perera', bankName: 'Commercial Bank', fee: 2500, date: '2023-06-15', status: 'completed' },
    { id: '2', doctorName: 'Dr. Arjun Rajapakse', bankName: 'HSBC', fee: 1800, date: '2023-06-20', status: 'completed' },
    { id: '3', doctorName: 'Dr. Priya Silva', bankName: 'NDB Bank', fee: 2000, date: '2023-05-10', status: 'refunded' },
    { id: '4', doctorName: 'Dr. Kumar Rana', bankName: 'Sampath Bank', fee: 3000, date: '2023-04-22', status: 'pending' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-1 text-sm md:text-base">View your payment and refund records</p>
      </div>

      {/* Payment History Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Doctor Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bank Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee (LKR)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{payment.doctorName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{payment.bankName}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">LKR {payment.fee.toFixed(2)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {payment.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                    {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800">Total Payments</h3>
          <p className="text-2xl font-bold text-blue-900 mt-1">
            LKR {payments.reduce((sum, p) => sum + p.fee, 0).toFixed(2)}
          </p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-green-800">Completed</h3>
          <p className="text-2xl font-bold text-green-900 mt-1">
            {payments.filter(p => p.status === 'completed').length}
          </p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-sm font-medium text-yellow-800">Pending</h3>
          <p className="text-2xl font-bold text-yellow-900 mt-1">
            {payments.filter(p => p.status === 'pending').length}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentsHistoryPage;