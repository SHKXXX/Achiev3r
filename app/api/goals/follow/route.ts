import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { goalId, userId } = await req.json();

    if (!goalId || !userId) {
      return NextResponse.json(
        { error: "Missing goalId or userId" },
        { status: 400 }
      );
    }

    // Check if already following
    const existingFollow = await prisma.goalFollow.findUnique({
      where: {
        userId_goalId: {
          userId,
          goalId
        }
      }
    });

    if (existingFollow) {
      return NextResponse.json({ message: "Already following this goal" });
    }

    // Create follow relationship
    await prisma.goalFollow.create({
      data: {
        userId,
        goalId
      }
    });

    return NextResponse.json({ message: "Now following goal" });
  } catch (error) {
    console.error("Error following goal:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}