import { NextResponse } from 'next/server';

export async function GET() {
  const payments = [
    { id: '1', doctorName: 'Dr. Samantha Perera', bankName: 'Commercial Bank', fee: 2500, date: '2023-06-15', status: 'completed' },
    { id: '2', doctorName: 'Dr. Arjun Rajapakse', bankName: 'HSBC', fee: 1800, date: '2023-06-20', status: 'completed' },
    { id: '3', doctorName: 'Dr. Priya Silva', bankName: 'NDB Bank', fee: 2000, date: '2023-05-10', status: 'refunded' },
    { id: '4', doctorName: 'Dr. Kumar Rana', bankName: 'Sampath Bank', fee: 3000, date: '2023-04-22', status: 'pending' },
  ];
  return NextResponse.json(payments);
}