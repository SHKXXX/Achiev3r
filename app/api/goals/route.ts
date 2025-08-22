import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../../lib/generated/prisma";

const prisma = new PrismaClient();

// CREATE a new goal
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,       // wallet address (fid)
      title,
      description,
      category,
      stake,        // maps to goalAmount
      startDate,
      endDate,
    } = body;

    if (!userId || !title || !category) { //modified, removed stake
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // create goal
    const newGoal = await prisma.goal.create({
      data: {
        userId,
        title,
        description,
        category: category.toUpperCase(),
        goalAmount: stake,
        currentAmount: stake, // initialize pool same as stake
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      },
    });

    return NextResponse.json({ goal: newGoal }, { status: 201 });
  } catch (error) {
    console.error("Error creating goal:", error);
    return NextResponse.json(
      { error: "Failed to create goal" },
      { status: 500 }
    );
  }
}

// GET all goals for a user
export async function GET(req: NextRequest) {
  try {
    const userId = req.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ goals });
  } catch (error) {
    console.error("Error fetching goals:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const goalId = params.id;

    const updated = await prisma.goal.update({
      where: { id: goalId },
      data: { isPublic: true },
    });

    return NextResponse.json({ goal: updated }, { status: 200 });
  } catch (error) {
    console.error("Error sharing goal:", error);
    return NextResponse.json({ error: "Failed to share goal" }, { status: 500 });
  }
}
