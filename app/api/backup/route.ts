import { NextResponse } from 'next/server';
import { runBackup } from '@/lib/docker';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { containerName, dbUser, dbName, dbType } = body;

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${containerName}-${timestamp}.sql`;
    const publicPath = path.join(process.cwd(), 'public', 'backups');
    
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

    const outputPath = path.join(publicPath, filename);
    
    const success = runBackup(containerName, dbUser, dbName, outputPath);

    if (success) {
      return NextResponse.json({ success: true, filename, path: `/backups/${filename}` });
    } else {
      return NextResponse.json({ success: false, error: 'Backup process failed' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
