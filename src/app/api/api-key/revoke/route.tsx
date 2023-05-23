import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function POST(req: Request) {
  try {
    const user = await getServerSession(authOptions).then(res => res?.user);

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', success: false }, { status: 401 });
    }

    const validApiKey = await db.apiKey.findFirst({
      where: {
        userId: user.id,
        enabled: true,
      },
    });

    if (!validApiKey) {
      return NextResponse.json(
        { error: 'This API key could not be revoked', success: false },
        { status: 500 }
      );
    }

    // invalidate API key
    await db.apiKey.update({
      where: {
        id: validApiKey.id,
      },
      data: {
        enabled: false,
      },
    });

    return NextResponse.json({ error: null, success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues, success: false }, { status: 400 });
    }

    return NextResponse.json({ error: 'Internal Server Error', success: false }, { status: 500 });
  }
}
