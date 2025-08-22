// app/api/session/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { walletAddress } = await req.json();
    if (!walletAddress) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    // fetch or create user
    let user = await prisma.user.findUnique({ where: { fid: walletAddress } });
    if (!user) {
      user = await prisma.user.create({
        data: { fid: walletAddress },
      });
    }

    // store session (simplest: return user object to client, you can extend to JWT or cookies)
    return NextResponse.json({ user });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
