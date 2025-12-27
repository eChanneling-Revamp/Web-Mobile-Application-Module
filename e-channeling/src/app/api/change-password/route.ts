import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { currentPassword, newPassword } = await request.json();
  
  // Simple validation
  if (currentPassword === newPassword) {
    return NextResponse.json(
      { error: 'New password cannot be the same as old password' }, 
      { status: 400 }
    );
  }
  
  if (newPassword.length < 8) {
    return NextResponse.json(
      { error: 'Password must be at least 8 characters' }, 
      { status: 400 }
    );
  }
  
  return NextResponse.json({ 
    message: 'Password changed successfully',
    success: true 
  });
}