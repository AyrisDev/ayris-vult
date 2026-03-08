import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prisma = new PrismaClient();
    try {
        const databases = await prisma.monitoredDatabase.findMany({
            include: { backups: true }
        });
        return NextResponse.json(databases);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    const prisma = new PrismaClient();
    try {
        const body = await request.json();
        const { name, containerId, connectionUrl, dbType, dbUser, dbName } = body;

        const newDb = await prisma.monitoredDatabase.create({
            data: {
                name,
                containerId: containerId || null,
                connectionUrl: connectionUrl || null,
                dbType,
                dbUser: dbUser || null,
                dbName: dbName || null,
                status: 'active'
            }
        });

        return NextResponse.json(newDb);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
