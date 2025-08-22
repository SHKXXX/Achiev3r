import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    // Get public goals that are not the current user's
    const userId = req.nextUrl.searchParams.get("excludeUserId");
    
    const goals = await prisma.goal.findMany({
      where: {
        ...(userId ? { NOT: { userId } } : {}),
        isPublic: true, // Assuming you add this field to your schema
      },
      include: {
        user: {
          select: {
            id: true,
            profileImage: true,
            username: true,
          }
        }
      },
      orderBy: { createdAt: "desc" },
      take: 20 // Limit results
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching community goals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}