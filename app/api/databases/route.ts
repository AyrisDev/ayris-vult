import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    try {
        const databases = await prisma.monitoredDatabase.findMany({
            include: { backups: true }
        });
        return NextResponse.json(databases);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, containerId, dbType, dbUser, dbName } = body;

        const newDb = await prisma.monitoredDatabase.create({
            data: {
                name,
                containerId: containerId || `manual-${Date.now()}`,
                dbType,
                dbUser,
                dbName,
                status: 'active'
            }
        });

        return NextResponse.json(newDb);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
