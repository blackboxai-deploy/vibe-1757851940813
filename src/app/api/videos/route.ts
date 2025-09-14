import { NextResponse } from 'next/server';

// Video management API routes

export async function GET(): Promise<NextResponse> {
  // This would typically fetch from a database
  // For now, return empty array since videos are stored in localStorage
  return NextResponse.json([]);
}

export async function DELETE(): Promise<NextResponse> {
  // This would typically delete from a database
  // For now, return success since videos are managed in localStorage
  return NextResponse.json({ 
    success: true, 
    message: 'Video deletion handled on client side' 
  });
}