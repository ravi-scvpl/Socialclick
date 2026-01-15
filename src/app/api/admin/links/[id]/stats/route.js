import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "../../../../prisma";

export async function POST(request, { params }) {
    const { id } = params;
    const { userId, clicksToAdd, trafficData } = await request.json();

    if (!userId || !id || clicksToAdd === undefined || clicksToAdd < 0) {
        return new NextResponse(JSON.stringify({ message: "Invalid parameters" }), {
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

        // 2. Create Traffic Records
        const trafficPromises = [];
        const count = parseInt(clicksToAdd);

        // Prepare metadata
        const location = {
            country: trafficData?.country || "Unknown",
            city: trafficData?.city || "Unknown",
            countryCode: trafficData?.country ? trafficData.country.substring(0, 2).toUpperCase() : "UN"
        };

        const source = trafficData?.referrer ? { url: trafficData.referrer } : null;
        const createdAt = trafficData?.date ? new Date(trafficData.date) : new Date();

        for (let i = 0; i < count; i++) {
            trafficPromises.push(
                Prisma.Traffic.create({
                    data: {
                        linkId: id,
                        location: location,
                        browser: trafficData?.browser || "Unknown",
                        device: trafficData?.device || "Unknown",
                        source: source,
                        createdAt: createdAt
                    }
                })
            );
        }

        await Promise.all(trafficPromises);

        // 3. Increment Link Stats
        const updatedLink = await Prisma.Link.update({
            where: { id: id },
            data: { clicks: { increment: count } },
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
