import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../prisma";

export async function POST(request, { params }) {
    const { id } = params;
    const { userId, clicks } = await request.json();

    if (!userId || !id || clicks === undefined) {
        return new NextResponse(JSON.stringify({ message: "Missing required parameters" }), {
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

        // 2. Update Link Stats
        const updatedLink = await Prisma.Link.update({
            where: { id: id },
            data: { clicks: parseInt(clicks) },
        });

        return new NextResponse(JSON.stringify({ data: updatedLink, message: "SUCCESS" }), {
            status: 200,
        });
    } catch (error) {
        console.error("Error updating link stats:", error);
        return new NextResponse(JSON.stringify({ message: "Internal Server Error" }), {
            status: 500,
        });
    }
}
