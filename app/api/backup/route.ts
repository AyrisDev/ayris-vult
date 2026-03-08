import { NextResponse } from 'next/server';
import { runBackup } from '@/lib/docker';
import path from 'path';
import fs from 'fs';
import { PrismaClient } from '@prisma/client';

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  try {
    const body = await request.json();
    const { id } = body;

    const db = await prisma.monitoredDatabase.findUnique({ where: { id } });
    if (!db) throw new Error('Database not found');

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${db.name.replace(/\s+/g, '-')}-${timestamp}.sql`;
    const publicPath = path.join(process.cwd(), 'public', 'backups');
    
    if (!fs.existsSync(publicPath)) fs.mkdirSync(publicPath, { recursive: true });

    const outputPath = path.join(publicPath, filename);
    
    const success = runBackup(
        db.containerId, 
        db.dbUser, 
        db.dbName, 
        outputPath, 
        db.connectionUrl, 
        db.dbType
    );

    if (success) {
      const stats = fs.statSync(outputPath);
      
      // Log backup in DB
      await prisma.backup.create({
          data: {
              databaseId: db.id,
              filename,
              sizeBytes: BigInt(stats.size),
              status: 'success'
          }
      });

      await prisma.monitoredDatabase.update({
          where: { id: db.id },
          data: { lastBackup: new Date() }
      });

      return NextResponse.json({ success: true, filename, path: `/backups/${filename}` });
    } else {
      return NextResponse.json({ success: false, error: 'Backup process failed' }, { status: 500 });
    }

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
