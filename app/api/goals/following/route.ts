import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get goals that the user is following
    const followedGoals = await prisma.goalFollow.findMany({
      where: { userId },
      include: {
        goal: {
          include: {
            user: {
              select: {
                id: true,
                profileImage: true,
                username: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    const goals = followedGoals.map(follow => follow.goal);

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching followed goals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}