// app/api/users/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fid, username, profileImage } = body;

    if (!fid) {
      return NextResponse.json(
        { error: "Missing wallet address (fid)" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { fid },
    });

    // If not, create
    if (!user) {
      user = await prisma.user.create({
        data: {
          fid,
          username: username || null,
          profileImage: profileImage || null,
        },
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Error in /api/users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
