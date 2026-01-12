import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../prisma";

export async function POST(request) {
    const { userId } = await request.json();

    if (!userId) {
        return new NextResponse(JSON.stringify({ message: "UserId required" }), {
            status: 400,
        });
    }

    try {
        // 1. Verify Admin Role
        const user = await Prisma.User.findUnique({
            where: { id: userId },
        });

        if (!user || user.role !== "ADMIN") {
            return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
                status: 403,
            });
        }

        // 2. Fetch All Links (with owner info)
        const links = await Prisma.Link.findMany({
            include: {
                user: {
                    select: { email: true, name: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return new NextResponse(JSON.stringify({ data: links, message: "SUCCESS" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error fetching admin links:", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}
