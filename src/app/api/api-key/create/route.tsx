import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { CreateApiData } from '@/types/api';
import { db } from '@/lib/db';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const user = await getServerSession(authOptions).then(res => res?.user);

    if (!user) {
      return NextResponse.json(
        {
          error: 'Unauthorized to perform this action',
          createdApiKey: null,
        },
        { status: 401 }
      );
    }

    const existingApiKey = await db.apiKey.findFirst({
      where: {
        userId: user.id,
        enabled: true,
      },
    });

    if (existingApiKey) {
      return NextResponse.json(
        {
          error: 'You already have a valid API KEY',
          createdApiKey: null,
        },
        { status: 400 }
      );
    }

    const createdApiKey = await db.apiKey.create({
      data: {
        userId: user.id,
        key: nanoid(),
      },
    });

    return NextResponse.json({ error: null, createdApiKey }, { status: 200 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues, createdApiKey: null }, { status: 400 });
    }

    return NextResponse.json(
      { error: 'Internal server error', createdApiKey: null },
      { status: 500 }
    );
  }
}
