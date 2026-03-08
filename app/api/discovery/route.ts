import { NextResponse } from 'next/server';
import { getContainers } from '@/lib/docker';

export async function GET() {
  const containers = getContainers();
  const databases = containers.filter((c: any) => 
    c.Image.includes('postgres') || 
    c.Image.includes('mysql') || 
    c.Image.includes('mongo')
  );
  
  return NextResponse.json(databases);
}
