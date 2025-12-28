import { NextResponse } from 'next/server';

// GET - Get current user
export async function GET() {
  const user = {
    id: '1',
    membershipStatus: 'free',
    userType: 'Patient',
    title: 'Mr.',
    fullName: 'Janaya Ransiluni',
    email: 'janaya@example.com',
    mobileNumber: '+94 77 123 4567',
    nicPassport: '123456789V'
  };
  return NextResponse.json(user);
}

// PUT - Update user
export async function PUT(request: Request) {
  const body = await request.json();
  console.log('Updating user with:', body);
  return NextResponse.json({ message: 'Profile updated successfully' });
}

// DELETE - Delete user
export async function DELETE() {
  return NextResponse.json({ message: 'Account deleted successfully' });
}